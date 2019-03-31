<template>
  <div class="file-input">
    <label class="button input" v-if="!uploading">
      <input type="file" ref="file" @change="upload" />
      <slot />
    </label>
    <div class="progress input" v-else>
      <div
        class="progress-fulfill"
        :style="{ width: uploadProgress * 100 + '%' }"
      ></div>
      Uploading...
    </div>
  </div>
</template>

<script>
import { callApi, showNotification } from "../storeProxy";

export default {
  name: "FileInput",
  data() {
    return {
      uploading: false,
      uploadProgress: 0
    };
  },
  methods: {
    async upload() {
      const file = this.$refs.file.files[0];
      if (!file) {
        return;
      }
      let formData = new FormData();
      formData.append("file", file);
      try {
        this.uploading = true;
        this.uploadProgress = 0;
        const serverFileName = await callApi(
          "/upload.php",
          formData,
          false,
          event => {
            if (event.lengthComputable) {
              this.uploadProgress = event.loaded / event.total;
            }
          }
        );
        this.$emit("input", serverFileName);
        this.$emit("change", serverFileName);
        showNotification("File uploaded.");
      } catch (exception) {
        showNotification(exception.message, "error");
      } finally {
        this.uploading = false;
      }
    }
  }
};
</script>

<style scoped lang="less">
.file-input {
  .input {
    display: inline-block;

    input[type="file"] {
      display: none;
    }
  }

  .progress {
    position: relative;

    .progress-fulfill {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      background: #def;
    }
  }
}
</style>
