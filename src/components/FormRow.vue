<template>
  <div class="form-row">
    <div class="label" :style="{ width: labelWidth + 'px' }">{{ label }}</div>
    <div
      :class="{ value: true, text }"
      :style="{ paddingLeft: labelWidth + 'px' }"
    >
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
    text: Boolean,
    labelWidth: {
      type: Number,
      default: 110
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.form-row {
  .block-margin;

  &.next-section-start {
    margin-top: @section-margin;
  }
}

.label {
  position: absolute;
}

.value .value-wrapper {
  position: relative;
}

.label,
.value.text {
  .form-label-padding;
}
</style>
