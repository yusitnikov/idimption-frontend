<template>
  <div class="form-row">
    <div class="label">{{ label }}</div>
    <div :class="{ value: true, text }">
      <div class="value-wrapper">
        <slot />
      </div>
    </div>
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

@label-width: 110px;

.form-row {
  .block-margin;

  &.next-section-start {
    margin-top: @section-margin;
  }
}

.label {
  position: absolute;
  width: @label-width;
}

.value {
  padding-left: @label-width;

  .value-wrapper {
    position: relative;
  }
}

.label,
.value.text {
  .form-label-padding;
}
</style>
