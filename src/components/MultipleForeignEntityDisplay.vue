<template>
  <MultipleEntityDisplay
    class="multiple-foreign-entity-display"
    :value="foreignValue"
    :tableNames="foreignTableNames"
    :iconClass="iconClass"
    :iconTitle="iconTitle"
  >
    <template #before="{ ids }">
      <slot name="before" :linkRow="ids.original" />
    </template>
    <template #default="{ ids, row, displayText }">
      <slot :linkRow="ids.original" v-bind="row" :row="row">
        {{ displayText }}
      </slot>
    </template>
    <template #after="{ ids }">
      <slot name="after" :linkRow="ids.original" />
    </template>
  </MultipleEntityDisplay>
</template>

<script>
import EntityTransitionsList from "../EntityTransitionsList";
import { getForeignTableName } from "../EntityHelper";
import { EntityRow } from "../EntityRow";
import MultipleEntityDisplay from "./MultipleEntityDisplay";
import Tag from "./Tag";

export default {
  name: "MultipleForeignEntityDisplay",
  components: { MultipleEntityDisplay },
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
    fieldNames: {
      type: Array,
      required: true
    },
    transitionsList: {
      type: EntityTransitionsList,
      default: () => new EntityTransitionsList()
    }
  },
  data() {
    return {
      adding: false,
      addField: null,
      addValues: {}
    };
  },
  computed: {
    updatedData() {
      return this.transitionsList.applyToState();
    },
    parentFieldName() {
      return this.row.getForeignFieldName(this.tableName);
    },
    linkRows() {
      return this.updatedData[this.tableName].filter(
        row => row[this.parentFieldName] === this.row.id
      );
    },
    foreignTableNamesMap() {
      let map = {};
      for (const fieldName of this.fieldNames) {
        map[fieldName] = getForeignTableName(this.tableName, fieldName);
      }
      return map;
    },
    foreignTableNames() {
      return this.fieldNames.map(
        fieldName => this.foreignTableNamesMap[fieldName]
      );
    },
    foreignValue() {
      return this.linkRows.map(linkRow => {
        let result = {
          original: linkRow
        };
        for (const fieldName of this.fieldNames) {
          result[this.foreignTableNamesMap[fieldName]] = linkRow[fieldName];
        }
        return result;
      });
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.view-tag {
  margin-right: @button-distance;
}
</style>
