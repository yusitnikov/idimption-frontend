<template>
  <BasicSearchBox
    class="select"
    v-model="text"
    @input="bringSelectedItemToFocus"
    :placeholder="(chosenOption && chosenOption.text) || emptyPlaceholder"
    :ignoreEvents="ignoreEvents"
    @focus="onFocus"
    @blur="onBlur"
    @keydown="onKeyDown"
    ref="input"
  >
    <div
      v-for="(row, index) in rows"
      :class="{
        item: true,
        enabled: !row.disabled,
        disabled: row.disabled,
        selected: index === selectedRowIndex
      }"
      @click="() => !row.disabled && row.onClick && row.onClick()"
      ref="items"
      :key="row.id.toString()"
    >
      <HighlightSelection :text="row.text" v-if="row.highlight" />
      <template v-else>{{ row.text }}</template>
    </div>
  </BasicSearchBox>
</template>

<script>
import BasicSearchBox from "./BasicSearchBox";
import Guid from "guid";
import { getKeyCodeByEvent, matchesFreeTextSearch } from "../misc";
import HighlightSelection from "./HighlightSelection";

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
  components: { HighlightSelection, BasicSearchBox },
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
      text: "",
      selectedValue: null
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
    chosenOption() {
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
        const optionText = option.text;
        const optionTextLoCase = optionText.toLowerCase();
        textUsed = textUsed || optionTextLoCase === trimmedTextLoCase;
        if (!option.hidden && matchesFreeTextSearch(optionText, trimmedText)) {
          rows.push({
            ...option,
            highlight: true,
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
    },
    selectedRowIndex() {
      const { rows, selectedValue } = this;
      for (let index = 0; index < rows.length; index++) {
        if (rows[index].id === selectedValue) {
          return index;
        }
      }

      return 0;
    }
  },
  methods: {
    onFocus() {
      this.$emit("focus");
      this.selectedValue = this.value;
      this.bringSelectedItemToFocus();
    },
    onBlur() {
      this.$emit("blur");
      this.reset(false);
    },
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
    },
    reset(blur = true) {
      this.text = "";
      if (blur) {
        this.$nextTick(() => this.blur());
      }
    },
    async bringSelectedItemToFocus() {
      await this.$nextTick;
      if (this.rows.length) {
        const item = this.$refs.items[this.selectedRowIndex];
        // noinspection JSUnresolvedVariable
        if (item.scrollIntoViewIfNeeded) {
          item.scrollIntoViewIfNeeded();
        } else {
          item.scrollIntoView();
        }
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
      const { rows, selectedRowIndex } = this;
      const selectedRow = rows[selectedRowIndex];
      const setSelectedIndex = index => {
        if (rows.length) {
          index = (index + rows.length) % rows.length;
          this.selectedValue = rows[index].id;
          this.bringSelectedItemToFocus();
        }
      };
      // TODO: support PageUp / PageDown
      switch (getKeyCodeByEvent(ev)) {
        case "ArrowUp":
          ev.preventDefault();
          setSelectedIndex(selectedRowIndex - 1);
          break;
        case "ArrowDown":
          ev.preventDefault();
          setSelectedIndex(selectedRowIndex + 1);
          break;
        case "Home":
          ev.preventDefault();
          setSelectedIndex(0);
          break;
        case "End":
          ev.preventDefault();
          setSelectedIndex(-1);
          break;
        case "Enter":
          ev.preventDefault();
          if (selectedRow && !selectedRow.disabled && selectedRow.onClick) {
            selectedRow.onClick();
          }
          break;
      }
    }
  }
};
</script>

<style lang="less">
@import "../styles/essentials";

.select {
  .popup {
    padding: @input-vertical-padding / 2 0;
  }

  .item {
    padding: @input-vertical-padding / 2 @input-horizontal-padding;

    &:hover {
      background: #f8f8f8;
    }
    &.selected {
      background: #eee;
    }

    &.enabled {
      cursor: pointer;
    }

    &.disabled {
      color: #ccc;
    }
  }
}
</style>
