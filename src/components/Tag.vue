<template>
  <span class="tag inline-item">
    <Icon :type="iconClass" :title="iconTitle" v-if="iconClass" />
    {{ " " }}
    <slot />
  </span>
</template>

<script>
import Icon from "./Icon";

export default {
  name: "Tag",
  components: { Icon },
  props: {
    iconClass: String,
    iconTitle: String
  }
};
</script>
