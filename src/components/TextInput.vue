<template>
  <input
    type="text"
    class="text-input input"
    :value="value"
    :placeholder="placeholder"
    @change="$event => $emit('change', $event.target.value)"
    @input="$event => $emit('input', $event.target.value)"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  />
</template>

<script>
export default {
  name: "TextInput",
  props: {
    value: String,
    placeholder: String
  },
  methods: {
    focus() {
      this.$el.focus();
    },
    blur() {
      this.$el.blur();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
