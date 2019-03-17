<template>
  <button
    type="button"
    :class="['button', 'input', align]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    disabled: Boolean,
    align: {
      type: String,
      default: "left"
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../styles/essentials";

.button.input {
  width: auto;
  min-width: @button-full-height;

  &.left {
    margin-right: @button-distance;
  }

  &.right {
    float: right;
    margin-left: @button-distance;
  }

  &.small {
    padding-left: @input-vertical-padding;
    padding-right: @input-vertical-padding;
  }
}
</style>
