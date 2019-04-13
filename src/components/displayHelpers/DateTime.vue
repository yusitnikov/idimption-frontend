<template>
  <span class="date-time">
    <template v-if="value">{{ formatted }}</template>
  </span>
</template>

<script>
export default {
  name: "DateTime",
  props: {
    value: [String, Number]
  },
  computed: {
    valueInt() {
      return this.value ? Number(this.value) : null;
    },
    formatted() {
      return this.value ? new Date(this.valueInt * 1000).toLocaleString() : "";
    }
  }
};
</script>
