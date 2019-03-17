<template>
  <BasicSearchBox
    class="select"
    v-model="text"
    :placeholder="selectedOption && selectedOption.text"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @keydown="onKeyDown"
    ref="el"
  >
    <div
      v-for="row in rows"
      :class="{ disabled: row.disabled }"
      @click="() => !row.disabled && row.onClick && row.onClick()"
      :key="row.id.toString()"
    >
      {{ row.text }}
    </div>
  </BasicSearchBox>
</template>

<script>
import BasicSearchBox from "./BasicSearchBox";
import Guid from "guid";
import { getKeyCodeByEvent } from "../misc";

export default {
  name: "Select",
  components: { BasicSearchBox },
  props: {
    options: {
      type: Array,
      required: true
    },
    value: [String, Guid],
    allowAdd: Boolean,
    allowEmpty: Boolean
  },
  data() {
    return {
      text: ""
    };
  },
  computed: {
    selectedOption() {
      for (const option of this.options) {
        if (option.id === this.value) {
          return option;
        }
      }

      return null;
    },
    trimmedText() {
      return this.text.trim();
    },
    rows() {
      const { options, trimmedText } = this;
      const trimmedTextLoCase = trimmedText.toLowerCase();
      let rows = [];
      let textUsed = false;
      if (this.allowEmpty && !trimmedText) {
        rows.push({
          id: "",
          text: "No value",
          onClick: () => this.onSelect("")
        });
      }
      for (const option of options) {
        const optionTextLoCase = option.text.toLowerCase();
        textUsed = textUsed || optionTextLoCase === trimmedTextLoCase;
        if (
          !option.hidden &&
          (!trimmedText || optionTextLoCase.indexOf(trimmedTextLoCase) >= 0)
        ) {
          rows.push({
            ...option,
            onClick: () => this.onSelect(option.id)
          });
        }
      }
      if (this.allowAdd) {
        rows.push({
          id: "create",
          text: "Add new" + (trimmedText ? " (" + trimmedText + ")" : ""),
          disabled: !trimmedText || textUsed,
          onClick: () => this.onCreate()
        });
      }
      if (!rows.length) {
        rows.push({
          id: "noop",
          text: "No options",
          disabled: true
        });
      }
      return rows;
    }
  },
  methods: {
    focus() {
      this.$refs.el.focus();
    },
    blur() {
      this.$refs.el.blur();
    },
    onSelect(value) {
      this.$emit("change", value);
      this.$emit("input", value);
      this.text = "";
      this.$nextTick(() => this.blur());
    },
    onCreate() {
      this.$emit("create", this.trimmedText);
      this.text = "";
      this.$nextTick(() => this.blur());
    },
    onKeyDown(ev) {
      console.log(ev, getKeyCodeByEvent(ev));
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.disabled {
  color: #ccc;
}
</style>
