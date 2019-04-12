<template>
  <label class="checkbox-input">
    <input
      type="checkbox"
      :checked="value"
      @change="$event => $emit('change', $event.target.checked)"
      @input="$event => $emit('input', $event.target.checked)"
    />
    <slot />
  </label>
</template>

<script>
export default {
  name: "CheckboxInput",
  props: {
    value: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style scoped lang="less">
input {
  position: relative;
  top: 2px;
  margin: 0;
}
</style>
