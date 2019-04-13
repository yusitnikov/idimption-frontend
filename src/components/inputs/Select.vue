<template>
  <BasicSearchBox
    class="select"
    v-model="text"
    @input="onInput"
    :placeholder="
      (chosenOption && chosenOption.displayText) || emptyPlaceholder
    "
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
      @click="() => clickRow(row)"
      :ref="'item-' + index"
      :key="row.id.toString()"
    >
      <table>
        <tbody>
          <tr>
            <td class="tree-paddings" v-if="isTree && row.treePaddings">
              <span
                v-for="(classNames, index) in row.treePaddings"
                :key="index"
                :class="['tree-padding', ...classNames]"
              >
                <span
                  :class="['tree-line', 'tree-line-horizontal', ...classNames]"
                ></span>
                <span
                  :class="[
                    'tree-line',
                    'tree-line-vertical',
                    'tree-line-top',
                    ...classNames
                  ]"
                ></span>
                <span
                  :class="[
                    'tree-line',
                    'tree-line-vertical',
                    'tree-line-bottom',
                    ...classNames
                  ]"
                ></span>
              </span>

              <ButtonLink
                v-if="row.hasChildren"
                class="no-margin"
                plain
                @click="event => toggleTreeItem(event, row.id)"
              >
                <Icon
                  :type="row.collapsed ? 'caret-right' : 'caret-down'"
                  class="square"
                />
              </ButtonLink>
            </td>
            <td>
              <HighlightSelection :text="row.text" v-if="row.highlight" />
              <template v-else>{{ row.text }}</template>
              <span class="irrelevant" v-if="row.tip !== undefined">
                ({{ row.tip }})
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BasicSearchBox>
</template>

<script>
import Vue from "vue";
import { getKeyCodeByEvent, matchesFreeTextSearch, timeout } from "../../misc";
import { TableData } from "../../TableData";
import Guid from "guid";
import HighlightSelection from "../displayHelpers/HighlightSelection";
import BasicSearchBox from "./BasicSearchBox";
import ButtonLink from "../ButtonLink";
import Icon from "../displayHelpers/Icon";

const commonProps = {
  value: [String, Guid],
  filter: Function,
  tipFunction: Function,
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
  components: { HighlightSelection, BasicSearchBox, ButtonLink, Icon },
  commonProps,
  props: {
    options: {
      type: TableData,
      required: true
    },
    isTree: Boolean,
    ...commonProps
  },
  data() {
    return {
      text: "",
      selectedValue: null,
      collapsedOptions: {}
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
      return this.options.getRowById(this.value);
    },
    trimmedText() {
      return this.text.trim();
    },
    processedOptions() {
      let { options, trimmedText } = this;
      options = options.sortTree();
      options = options.filter(this.filter);
      if (trimmedText) {
        options = options.filter(row =>
          matchesFreeTextSearch(row.displayText, trimmedText)
        );
      }
      return options;
    },
    visibleTreeOptionIds() {
      if (!this.isTree) {
        return null;
      }
      const visibleOptionIds = {};
      for (const row of this.processedOptions.rows) {
        for (const id of row.getRowFullId(this.options)) {
          if (id === row.id) {
            visibleOptionIds[row.id] = true;
          } else if (this.isTreeItemCollapsed(id)) {
            break;
          }
        }
      }
      return visibleOptionIds;
    },
    rows() {
      const { trimmedText } = this;
      let rows = [];

      if (this.allowEmpty && !trimmedText) {
        rows.push({
          id: "",
          text: this.emptyLabel,
          onClick: () => this.onSelect("")
        });
      }

      for (const option of this.processedOptions.rows) {
        if (this.isTree && !this.visibleTreeOptionIds[option.id]) {
          continue;
        }

        let treePaddings = [];
        if (this.isTree) {
          for (
            let child = option;
            child;
            child = child.getParent(this.options)
          ) {
            let classNames = [];
            if (!child.parentId) {
              classNames.push("first-level");
            }
            if (child === option) {
              classNames.push("last-level");
            } else {
              classNames.push("prev-level");
            }

            const siblings = child.getSiblings(this.processedOptions).rows;
            if (siblings[0] === child) {
              classNames.push("first-child");
            }
            if (siblings[siblings.length - 1] === child) {
              classNames.push("last-child");
            }

            treePaddings.unshift(classNames);
          }
        }

        rows.push({
          id: option.id,
          text: option.displayText,
          tip: this.tipFunction ? this.tipFunction(option) : undefined,
          disabled: !this.processedOptions.isMatchingRow(option),
          parentId: option.parentId,
          treePaddings,
          treeLevel: this.isTree ? option.getTreeLevel(this.options) : 0,
          collapsed: this.isTree && this.isTreeItemCollapsed(option.id),
          hasChildren: this.isTree && option.hasChildren(this.processedOptions),
          highlight: true,
          onClick: () => this.onSelect(option.id)
        });
      }

      if (this.allowAdd) {
        const textUsed = !!this.options.getRowByFieldValue(
          "displayText",
          trimmedText,
          true
        );
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
    async clickRow(row) {
      if (!row.disabled && row.onClick) {
        await timeout();
        row.onClick();
      }
    },
    async onInput() {
      await this.$nextTick;
      const selectedRow = this.rows[this.selectedRowIndex];
      // noinspection JSPotentiallyInvalidTargetOfIndexedPropertyAccess
      const firstEnabledRow = this.enabledRows[0];
      if (
        selectedRow &&
        (selectedRow.disabled || !selectedRow.onClick) &&
        firstEnabledRow
      ) {
        this.selectedValue = firstEnabledRow.id;
      }
      this.bringSelectedItemToFocus();
    },
    async bringSelectedItemToFocus() {
      await this.$nextTick;
      if (this.rows.length) {
        const itemsArray = this.$refs["item-" + this.selectedRowIndex] || [];
        const item = itemsArray[0];
        if (!item) {
          return;
        }
        // noinspection JSUnresolvedVariable
        if (item.scrollIntoViewIfNeeded) {
          item.scrollIntoViewIfNeeded();
        } else {
          item.scrollIntoView();
        }
      }
    },
    isTreeItemCollapsed(id) {
      return !!this.collapsedOptions[id];
    },
    toggleTreeItem(event, id) {
      event.stopPropagation();
      if (this.isTreeItemCollapsed(id)) {
        this.expandTreeItem(id);
      } else {
        this.collapseTreeItem(id);
      }
    },
    expandTreeItem(id) {
      Vue.delete(this.collapsedOptions, id);
    },
    collapseTreeItem(id) {
      Vue.set(this.collapsedOptions, id, true);

      // If the previously selected item has been collapsed now, then select the toggled item
      const currentRow = this.options.getRowById(id);
      const selectedRow = this.options.getRowById(this.selectedValue);
      if (selectedRow && selectedRow.isChild(currentRow, this.options)) {
        this.selectedValue = id;
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
        case "ArrowLeft":
          if (selectedRow.hasChildren && !selectedRow.collapsed) {
            ev.preventDefault();
            this.collapseTreeItem(selectedRow.id);
          } else if (selectedRow.treeLevel && selectedRow.treeLevel > 0) {
            ev.preventDefault();
            this.selectedValue = selectedRow.parentId;
            this.bringSelectedItemToFocus();
          }
          break;
        case "ArrowRight":
          if (selectedRow.hasChildren && selectedRow.collapsed) {
            ev.preventDefault();
            this.expandTreeItem(selectedRow.id);
          }
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
@import "../../styles/essentials";

@item-vertical-padding: @input-vertical-padding / 2;
@tree-padding-width: @line-height-px;
@tree-horizontal-line-top: @item-vertical-padding + @line-height-px / 2;

.select {
  .basic-search-box-popup {
    padding: @item-vertical-padding 0;
  }

  .item {
    position: relative;
    padding: @item-vertical-padding @input-horizontal-padding;

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

    table {
      border-collapse: collapse;
    }

    table,
    tbody,
    tr,
    td {
      padding: 0;
    }
  }

  .tree-paddings {
    width: 1px;
    white-space: nowrap;
  }

  .tree-padding {
    display: inline-block;
    width: @tree-padding-width;

    &.first-level {
      margin-left: -@tree-padding-width;

      &.first-child.last-child {
        display: none;
      }
    }

    .tree-line {
      position: absolute;

      &.tree-line-horizontal {
        top: @tree-horizontal-line-top;
        border-top: 1px solid @block-border-color;

        margin-left: @tree-padding-width / 2;
        width: @tree-padding-width / 2;

        &.prev-level {
          display: none;
        }

        &.first-child.first-level.last-level {
          margin-left: 0;
          width: @tree-padding-width;
        }
      }

      &.tree-line-vertical {
        margin-left: @tree-padding-width / 2;
        border-left: 1px solid @block-border-color;

        &.prev-level.last-child {
          display: none;
        }

        &.tree-line-top {
          top: 0;
          height: @tree-horizontal-line-top;

          &.first-child.first-level.last-level {
            display: none;
          }
        }

        &.tree-line-bottom {
          top: @tree-horizontal-line-top;
          bottom: 0;

          &.last-child {
            display: none;
          }
        }
      }
    }
  }
}
</style>
