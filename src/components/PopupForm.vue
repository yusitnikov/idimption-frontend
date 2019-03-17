<template>
  <div class="popup-form">
    <div class="background" @click="$emit('close')"></div>
    <div class="window">
      <div class="header">
        {{ title }}
      </div>
      <div class="body">
        <slot></slot>
      </div>
      <div class="footer">
        <Button align="right" @click="$emit('save')">{{ okLabel }}</Button>
        <Button align="right" @click="$emit('close')">{{ cancelLabel }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "./Button";

export default {
  name: "PopupForm",
  components: { Button },
  props: {
    title: {
      type: String,
      required: true
    },
    okLabel: {
      type: String,
      default: "OK"
    },
    cancelLabel: {
      type: String,
      default: "Cancel"
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../styles/essentials";

@header-height: 50px;
@footer-height: 50px;
@header-footer-background-color: #eee;

.fullscreen(@margin: 0) {
  position: fixed;
  left: @margin;
  top: @margin;
  right: @margin;
  bottom: @margin;
}

.popup-form {
  .fullscreen();

  .background {
    .fullscreen();

    background-color: rgba(0, 0, 0, 0.2);
  }

  .window {
    .fullscreen(50px);

    border: 1px solid @block-border-color;
    background-color: #fff;

    div {
      position: absolute;
      left: 0;
      right: 0;
      box-sizing: border-box;
      padding: @block-padding;

      &.header {
        top: 0;
        height: @header-height;
        background-color: @header-footer-background-color;
      }

      &.body {
        top: @header-height;
        bottom: @footer-height;
        overflow: auto;
      }

      &.footer {
        bottom: 0;
        height: @footer-height;
        background-color: @header-footer-background-color;
      }
    }
  }
}
</style>
