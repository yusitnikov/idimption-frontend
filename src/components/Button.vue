<template>
  <button
    type="button"
    class="button input inline-item"
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
    disabled: Boolean
  },
  methods: {
    onClick(event) {
      event.preventDefault();
      this.$emit("click", event);
    }
  }
};
</script>
