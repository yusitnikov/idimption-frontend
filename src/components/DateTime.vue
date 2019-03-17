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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
