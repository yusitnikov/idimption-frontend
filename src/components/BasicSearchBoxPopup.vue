<template>
  <div class="basic-search-box-popup select-popup">
    <slot />
  </div>
</template>

<script>
export default {
  name: "BasicSearchBoxPopup"
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.basic-search-box-popup {
  position: absolute;
  z-index: @z-index-dropdown-popup;
  background: white;
  border: 1px solid @block-border-color;
  max-height: 300px;
  overflow-y: auto;

  box-sizing: border-box;
  width: 100%;
}
</style>
