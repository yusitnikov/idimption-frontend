<template>
  <i :class="['icon', 'fas', 'fa-' + type]"></i>
</template>

<script>
export default {
  name: "Icon",
  props: {
    type: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.square {
  width: @line-height-px;
  text-align: center;
}
</style>
