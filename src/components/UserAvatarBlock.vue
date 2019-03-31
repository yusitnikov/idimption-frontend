<template>
  <div class="user-avatar-block">
    <UserAvatar class="avatar" v-bind="$props" />

    <div class="content">
      <div class="content-wrapper">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import UserAvatar from "./UserAvatar";

export default {
  name: "UserAvatarBlock",
  components: { UserAvatar },
  props: UserAvatar.props
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.user-avatar-block {
  .avatar {
    position: absolute;
  }

  .content {
    padding-left: @avatar-size + @avatar-distance;

    .content-wrapper {
      position: relative;
      min-height: @avatar-size;
    }
  }
}
</style>
