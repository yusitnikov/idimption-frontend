<template>
  <div :class="['alert', 'alert-' + type]">
    <slot></slot>

    <ButtonLink class="close" plain @click="$emit('close')" v-if="allowClose">
      &times;
    </ButtonLink>
  </div>
</template>

<script>
import ButtonLink from "./ButtonLink";
export default {
  name: "Alert",
  components: { ButtonLink },
  props: {
    type: {
      type: String,
      required: true
    },
    allowClose: Boolean
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.alert {
  .basic-block(@block-padding, auto);
  .block-margin-bottom;
  position: relative;
  background: #eee;
  padding-right: @one-line-block-inner-height;

  &.notification-hidden {
    opacity: 0;
  }

  &.alert-info {
    background-color: @info-background-color;
    border-color: @info-border-color;
    color: @info-color;
  }

  &.alert-success {
    background-color: @success-background-color;
    border-color: @success-border-color;
    color: @success-color;
  }

  &.alert-warning {
    background-color: @warning-background-color;
    border-color: @warning-border-color;
    color: @warning-color;
  }

  &.alert-error {
    background-color: @error-background-color;
    border-color: @error-border-color;
    color: @error-color;
  }

  .button {
    margin-left: @button-distance;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 150%;
    font-weight: bold;
    width: @one-line-block-inner-height;
    line-height: @one-line-block-inner-height;
    text-align: center;
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }

  &::after {
    content: "";
    clear: both;
  }
}
</style>
