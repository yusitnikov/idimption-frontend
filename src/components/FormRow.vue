<template>
  <div class="form-row">
    <div class="label">{{ label }}</div>
    <div :class="{ value: true, text }"><slot></slot></div>
  </div>
</template>

<script>
export default {
  name: "FormRow",
  props: {
    label: String,
    text: Boolean
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

@label-width: 200px;

.form-row {
  .block-margin;
}

.label {
  position: absolute;
  width: @label-width;
}

.value {
  padding-left: @label-width;
}

.label,
.value.text {
  .form-label-padding;
}
</style>
