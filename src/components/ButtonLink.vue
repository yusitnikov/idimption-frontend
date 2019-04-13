<template>
  <span class="button-link inline-item">
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
    customColors: Boolean
  },
  computed: {
    classes() {
      return [
        "link",
        this.disabled ? "disabled" : "enabled",
        this.plain ? "plain" : "regular",
        this.customColors ? "custom-colors" : "default-colors"
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

<style lang="less">
@import "../styles/essentials";

.button-link .link {
  text-decoration: none;

  &.enabled {
    cursor: pointer;

    &.default-colors {
      color: #00f;
    }

    &:hover,
    &:active,
    &:focus {
      &.regular {
        text-decoration: underline;
      }
    }
  }

  &.disabled {
    &.default-colors {
      color: #ccc;
    }
  }

  &.plain {
    &.enabled {
      &.default-colors {
        color: inherit;
      }
    }
  }

  .icon + * {
    margin-left: 4px;
  }
}
</style>
