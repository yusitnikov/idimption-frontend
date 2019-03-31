<template>
  <span :class="['button-link', 'button-' + align]">
    <router-link
      :class="classes"
      :to="href"
      :disabled="disabled"
      @click="onClick"
      v-if="href"
    >
      <slot />
    </router-link>
    <a :class="classes" href="" :disabled="disabled" @click="onClick" v-else>
      <slot></slot>
    </a>
  </span>
</template>

<script>
export default {
  name: "ButtonLink",
  props: {
    href: String,
    disabled: Boolean,
    plain: Boolean,
    align: {
      type: String,
      default: "left"
    }
  },
  computed: {
    classes() {
      return [
        "link",
        this.disabled ? "disabled" : "enabled",
        this.plain ? "plain" : "regular"
      ];
    }
  },
  methods: {
    onClick(event) {
      if (!this.href) {
        event.preventDefault();
      }
      this.$emit("click", event);
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.button-link .link {
  text-decoration: none;

  &.enabled {
    cursor: pointer;
    color: #00f;

    &:hover,
    &:active,
    &:focus {
      text-decoration: underline;
    }
  }

  &.disabled {
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
