<template>
  <a
    :class="[
      'button-link',
      disabled ? 'disabled' : 'enabled',
      plain ? 'plain' : 'regular'
    ]"
    href=""
    :disabled="disabled"
    @click="onClick"
  >
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: "ButtonLink",
  props: {
    disabled: Boolean,
    plain: Boolean
  },
  methods: {
    onClick(event) {
      event.preventDefault();
      this.$emit("click");
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.button-link {
  &.enabled {
    cursor: pointer;
  }

  &.disabled {
    text-decoration: none;
    color: #ccc;
  }

  &.plain {
    text-decoration: none;

    &.enabled {
      color: inherit;
    }
  }
}
</style>
