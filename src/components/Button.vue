<template>
  <button
    type="button"
    :class="['button', 'input', 'button-' + align]"
    :disabled="disabled"
    @click="onClick"
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
  },
  methods: {
    onClick(event) {
      event.preventDefault();
      this.$emit("click", event);
    }
  }
};
</script>
