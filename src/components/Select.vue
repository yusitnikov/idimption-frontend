<template>
  <BasicSearchBox
    class="select"
    v-model="text"
    :placeholder="(selectedOption && selectedOption.text) || emptyPlaceholder"
    :ignoreEvents="ignoreEvents"
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

const commonProps = {
  value: [String, Guid],
  allowAdd: Boolean,
  allowAddEmpty: Boolean,
  addLabel: {
    type: String,
    default: "Add new"
  },
  allowEmpty: Boolean,
  emptyLabel: {
    type: String,
    default: "No value"
  },
  emptyPlaceholder: {
    type: String,
    default: ""
  },
  selectFirstOnEmpty: Boolean,
  noOptionsLabel: {
    type: String,
    default: "No options"
  },
  ignoreEvents: Boolean
};

export default {
  name: "Select",
  components: { BasicSearchBox },
  commonProps,
  props: {
    options: {
      type: Array,
      required: true
    },
    ...commonProps
  },
  data() {
    return {
      text: ""
    };
  },
  mounted() {
    if (this.selectFirstOnEmpty && !this.value) {
      // noinspection JSPotentiallyInvalidTargetOfIndexedPropertyAccess
      const firstEnabledOption = this.enabledRows[0];
      if (firstEnabledOption) {
        this.onSelect(firstEnabledOption.id, false);
      }
    }
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
          text: this.emptyLabel,
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
          text: this.addLabel + (trimmedText ? " (" + trimmedText + ")" : ""),
          disabled: (!trimmedText && !this.allowAddEmpty) || textUsed,
          onClick: () => this.onCreate()
        });
      }
      if (!rows.length) {
        rows.push({
          id: "noop",
          text: this.noOptionsLabel,
          disabled: true
        });
      }
      return rows;
    },
    enabledRows() {
      return this.rows.filter(row => !row.disabled && row.onClick);
    }
  },
  methods: {
    focus() {
      this.$refs.el.focus();
    },
    blur() {
      this.$refs.el.blur();
    },
    reset(blur = true) {
      this.text = "";
      if (blur) {
        this.$nextTick(() => this.blur());
      }
    },
    onSelect(value, blur = true) {
      this.$emit("change", value);
      this.$emit("input", value);
      this.reset(blur);
    },
    onCreate() {
      this.$emit("create", this.trimmedText);
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
