<template>
  <div class="input-validation">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: "InputValidation",
  computed: {
    message() {
      const { showValidationMessage, computedValidationMessage } = this.$parent;
      return (showValidationMessage && computedValidationMessage) || "";
    }
  }
};
</script>

<style scoped lang="less">
.input-validation {
  color: red;
}
</style>
