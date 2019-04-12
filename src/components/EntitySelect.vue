<template>
  <div class="entity-select">
    <Select
      v-bind="$attrs"
      :options="updatedData"
      :isTree="isTree"
      :value="value"
      :filter="filter"
      :tipFunction="tipFunction"
      :allowAdd="allowAdd"
      :allowAddEmpty="allowAddEmpty || !!addComponent"
      :addLabel="addLabel"
      :allowEmpty="allowEmpty"
      :emptyLabel="emptyLabel"
      :emptyPlaceholder="emptyPlaceholder"
      :selectFirstOnEmpty="selectFirstOnEmpty"
      :noOptionsLabel="noOptionsLabel"
      :ignoreEvents="ignoreEvents || !!addFormRow"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @change="$event => $emit('change', $event)"
      @input="$event => $emit('input', $event)"
      @create="onCreate"
      ref="input"
    />

    <PopupForm
      v-if="addFormRow"
      title="Add new"
      @save="doCreate"
      @close="reset"
    >
      <component
        :is="addComponent"
        :savedRow="addFormRow"
        :transitionsList="addTransitionsList"
      />
    </PopupForm>
  </div>
</template>

<script>
import EntityTransitionsList from "../EntityTransitionsList";
import { getTableFieldsArray, resolveGuid } from "../EntityHelper";
import { EntityRow } from "../EntityRow";
import Select from "./Select";
import PopupForm from "./PopupForm";

export default {
  name: "EntitySelect",
  inheritAttrs: false,
  components: { Select, PopupForm },
  props: {
    ...Select.commonProps,
    transitionsList: {
      type: EntityTransitionsList,
      default: () => new EntityTransitionsList()
    },
    addField: {
      type: String,
      default: "summary"
    },
    addComponent: Object,
    tableName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      addTransitionsList: new EntityTransitionsList(),
      addFormRow: null
    };
  },
  computed: {
    isTree() {
      return getTableFieldsArray(this.tableName).includes("parentId");
    },
    updatedData() {
      return this.transitionsList
        .getTableData(this.tableName)
        .sort("displayText", (a, b) =>
          a.displayText.localeCompare(b.displayText)
        );
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
    },
    reset() {
      this.addTransitionsList.reset();
      this.addFormRow = null;
      this.$refs.input.reset();
    },
    async doCreate(row = null) {
      row = row || this.addFormRow;
      row = this.addTransitionsList.applyToRow(row);
      await this.addTransitionsList.save();
      await this.$nextTick();
      const id = resolveGuid(row.id);
      this.$emit("change", id);
      this.$emit("input", id);
      this.reset();
    },
    onCreate(text) {
      const row = new EntityRow(
        this.tableName,
        {
          [this.addField]: text
        },
        true
      );
      this.addTransitionsList.addRow(row);
      if (this.addComponent) {
        this.addFormRow = row;
      } else {
        this.doCreate(row);
      }
    }
  }
};
</script>
