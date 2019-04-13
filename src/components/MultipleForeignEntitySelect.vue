<template>
  <MultipleEntitySelect
    class="multiple-foreign-entity-select"
    :value="foreignValue"
    :selectTableNames="foreignTableNames"
    :filter="filter"
    :tipFunction="tipFunction"
    :alwaysOpened="alwaysOpened"
    :placeholder="placeholder"
    :allowAdd="allowAdd"
    :addComponent="addComponent"
    :transitionsList="transitionsList"
    :iconClass="iconClass"
    :iconTitle="iconTitle"
    @add="addRow"
    @remove="removeRow"
  >
    <template #before="params">
      <slot name="before" v-bind="params" />
    </template>
    <template #default="params">
      <slot v-bind="params" />
    </template>
    <template #after="params">
      <slot name="after" v-bind="params" />
    </template>
  </MultipleEntitySelect>
</template>

<script>
import { getForeignTableName } from "../EntityHelper";
import EntityTransitionsList from "../EntityTransitionsList";
import { EntityRow } from "../EntityRow";
import MultipleEntitySelect from "./MultipleEntitySelect";
import Tag from "./Tag";

export default {
  name: "MultipleForeignEntitySelect",
  components: { MultipleEntitySelect },
  props: {
    ...Tag.props,
    tableName: {
      type: String,
      required: true
    },
    row: {
      type: EntityRow,
      required: true
    },
    selectFieldNames: {
      type: Array,
      required: true
    },
    filter: Function,
    foreignFilter: Function,
    tipFunction: Function,
    alwaysOpened: Boolean,
    placeholder: [String, Array],
    allowAdd: Boolean,
    addComponent: Object,
    addProps: Object,
    transitionsList: {
      type: EntityTransitionsList,
      required: true
    }
  },
  computed: {
    parentFieldName() {
      return this.row.getForeignFieldName(this.tableName);
    },
    selectedRows() {
      return this.row
        .getForeignRows(this.tableName, this.transitionsList)
        .filter(this.foreignFilter);
    },
    foreignTableNamesMap() {
      let map = {};
      for (const fieldName of this.selectFieldNames) {
        map[fieldName] = getForeignTableName(this.tableName, fieldName);
      }
      return map;
    },
    foreignTableNames() {
      return this.selectFieldNames.map(
        fieldName => this.foreignTableNamesMap[fieldName]
      );
    },
    foreignValue() {
      return this.selectedRows.map(selectedRow => {
        let result = { original: selectedRow };
        for (const fieldName of this.selectFieldNames) {
          result[this.foreignTableNamesMap[fieldName]] = selectedRow[fieldName];
        }
        return result;
      });
    }
  },
  methods: {
    addRow(ids) {
      let row = {
        [this.parentFieldName]: this.row.id,
        ...this.addProps
      };
      for (const fieldName of this.selectFieldNames) {
        row[fieldName] = ids[this.foreignTableNamesMap[fieldName]];
      }
      this.transitionsList.addRow(new EntityRow(this.tableName, row, true));
    },
    removeRow(ids) {
      this.transitionsList.deleteRow(ids.original);
    }
  }
};
</script>
