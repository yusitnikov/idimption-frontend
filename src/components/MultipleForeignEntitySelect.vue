<template>
  <MultipleEntitySelect
    class="multiple-foreign-entity-select"
    :value="foreignValue"
    :selectTableNames="foreignTableNames"
    :alwaysOpened="alwaysOpened"
    :placeholder="placeholder"
    :allowAdd="allowAdd"
    :addComponent="addComponent"
    :transitionsList="transitionsList"
    :iconClass="iconClass"
    :iconTitle="iconTitle"
    @add="addRow"
    @remove="removeRow"
  />
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
    alwaysOpened: Boolean,
    placeholder: [String, Array],
    allowAdd: Boolean,
    addComponent: Object,
    transitionsList: {
      type: EntityTransitionsList,
      required: true
    }
  },
  computed: {
    updatedData() {
      return this.transitionsList.applyToState();
    },
    parentFieldName() {
      return this.row.getForeignFieldName(this.tableName);
    },
    selectedRows() {
      return this.updatedData[this.tableName].filter(
        row => row[this.parentFieldName] === this.row.id
      );
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
        [this.parentFieldName]: this.row.id
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
