<template>
  <div
    class="user-avatar"
    :style="{ backgroundImage: url ? 'url(' + url + ')' : 'none' }"
  >
    <Icon
      :class="['user-icon', 'user-icon--' + iconType]"
      :type="iconType"
      v-if="iconType"
    />
  </div>
</template>

<script>
import { getApiUrl } from "../misc";
import Icon from "./Icon";

export default {
  name: "UserAvatar",
  components: { Icon },
  props: {
    userId: String,
    avatarUrl: String
  },
  computed: {
    iconType() {
      if (!this.userId) {
        return "user-secret";
      }
      if (!this.avatarUrl) {
        return "user-tie";
      }
      return null;
    },
    url() {
      if (this.iconType) {
        return null;
      }
      const url = this.avatarUrl;
      return url.indexOf("://") >= 0 ? url : getApiUrl("/upload/" + url);
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

@avatar-icon-size: @avatar-size - 5px;

.user-avatar {
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  width: @avatar-size;
  height: @avatar-size;
  border: 1px solid @block-border-color;
  border-radius: @avatar-size / 2;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: cover;

  .user-icon {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    text-align: center;
    line-height: @avatar-icon-size;
    font-size: @avatar-icon-size;

    &.user-icon--user-tie {
      color: @block-border-color;
    }
  }
}
</style>
