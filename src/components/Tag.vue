<template>
  <span class="tag">
    <Icon :type="iconClass" :title="iconTitle" v-if="iconClass" />
    <slot />
  </span>
</template>

<script>
import Icon from "./Icon";

export default {
  name: "Tag",
  components: { Icon },
  props: {
    iconClass: String,
    iconTitle: String
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.tag {
  margin-right: @button-distance;
}
</style>
