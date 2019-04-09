<template>
  <div class="basic-search-box">
    <TextInput
      :value="value"
      :placeholder="placeholder"
      noValidation
      @change="$event => $emit('change', $event)"
      @input="$event => $emit('input', $event)"
      @focus="onFocus"
      ref="input"
    />
    <BasicSearchBoxPopup :idimptionSelection="{ global: value }" v-if="opened">
      <slot />
    </BasicSearchBoxPopup>
  </div>
</template>

<script>
import TextInput from "./TextInput";
import BasicSearchBoxPopup from "./BasicSearchBoxPopup";
import Guid from "guid";
import { getKeyCodeByEvent } from "../misc";

export default {
  name: "BasicSearchBox",
  components: { TextInput, BasicSearchBoxPopup },
  props: {
    value: [String, Guid],
    placeholder: String,
    ignoreEvents: Boolean
  },
  data() {
    return {
      opened: false,
      openedChangeTimer: null
    };
  },
  mounted() {
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    document.addEventListener("click", this.onClick);
    document.addEventListener("keydown", this.onKeyDown);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.onClick);
    document.removeEventListener("keydown", this.onKeyDown);
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
      if (this.opened) {
        this.opened = false;
        this.$emit("blur");
      }
    },

    onFocus() {
      this.$emit("focus");
      this.opened = true;
    },
    onClick(ev) {
      if (this.ignoreEvents) {
        return;
      }

      if (!this.$el.contains(ev.target)) {
        this.blur();
      }
    },
    onKeyDown(ev) {
      if (this.ignoreEvents) {
        return;
      }

      if (this.opened) {
        switch (getKeyCodeByEvent(ev)) {
          case "ArrowUp":
            ev.preventDefault();
            break;
          case "ArrowDown":
            ev.preventDefault();
            break;
          case "Tab":
          case "Shift+Tab":
            this.blur();
            return;
          case "Enter":
            ev.preventDefault();
            break;
          case "Escape":
            ev.preventDefault();
            this.blur();
            return;
        }
        this.$emit("keydown", ev);
      }
    }
  }
};
</script>

<style scoped lang="less">
.basic-search-box {
  position: relative;
}
</style>
