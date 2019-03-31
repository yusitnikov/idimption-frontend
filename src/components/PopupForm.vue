<template>
  <portal to="popups" :order="priority">
    <div :class="['popup-form', ($el && $el.className) || '']">
      <div class="background" @click="$emit('close')"></div>
      <div class="window">
        <div class="header">
          {{ title }}
        </div>
        <div class="body">
          <slot></slot>
        </div>
        <div class="footer">
          <Button align="right" @click="save">{{ okLabel }}</Button>
          <Button align="right" @click="$emit('close')">{{
            cancelLabel
          }}</Button>
        </div>
      </div>
    </div>
  </portal>
</template>

<script>
import { focusFirstInput, validateAllInputs } from "../misc";
import Button from "./Button";

export default {
  name: "PopupForm",
  components: { Button },
  props: {
    title: {
      type: String,
      required: true
    },
    priority: {
      type: Number,
      default: 1
    },
    okLabel: {
      type: String,
      default: "OK"
    },
    cancelLabel: {
      type: String,
      default: "Cancel"
    }
  },
  mounted() {
    focusFirstInput(this);
  },
  methods: {
    async save() {
      if (validateAllInputs(this)) {
        this.$emit("save");
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

@header-height: 2 * @block-vertical-padding + @line-height-px;
@footer-height: 2 * @block-vertical-padding + @button-full-height;
@header-footer-background-color: #eee;

.fullscreen-popup(@margin: 0) {
  .fullscreen(@z-index-popup-form, @margin);
}

.popup-form {
  .fullscreen-popup;

  .background {
    .fullscreen-popup;

    background-color: @popup-background-color;
  }

  .window {
    .fullscreen-popup(50px);

    border: 1px solid @block-border-color;
    background-color: #fff;

    > div {
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
