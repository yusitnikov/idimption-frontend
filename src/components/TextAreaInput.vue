<template>
  <div class="text-area-input">
    <!-- \u200B is a zero-width UTF character, it helps to display the trailing whitespaces correctly -->
    <div class="fake input" ref="fake">{{ "\u200B" + value + "\u200B" }}</div>
    <textarea
      class="textarea input"
      :value="value"
      :placeholder="placeholder"
      :style="{
        height: height + 'px',
        minHeight: height + 'px',
        maxHeight: height + 'px'
      }"
      @change="$event => $emit('change', $event.target.value)"
      @input="$event => $emit('input', $event.target.value)"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
    >
    </textarea>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "TextAreaInput",
  props: {
    value: String,
    placeholder: String
  },
  data() {
    return {
      height: 0
    };
  },
  computed: {
    ...mapState(["windowSize"])
  },
  mounted() {
    this.calculateHeight();
  },
  watch: {
    value() {
      this.calculateHeight();
    },
    windowSize() {
      this.calculateHeight();
    }
  },
  methods: {
    calculateHeight() {
      this.$nextTick(() => {
        this.height = this.$refs.fake.offsetHeight;
      });
    },
    focus() {
      this.$el.focus();
    },
    blur() {
      this.$el.blur();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.text-area-input {
  position: relative;
}

/* .fake and .textarea should have same styles */
.fake,
.textarea {
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

/* .fake should be hidden from the user, but still rendered to the DOM */
.fake {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.textarea {
  resize: none;
  overflow: hidden;
  min-width: 100%;
  max-width: 100%;
}
</style>
