<template>
  <span :class="{ 'entity-by-id': true, highlighted }">
    <slot v-bind="row" :row="row">
      <HighlightRowPropSelection :row="row" fieldName="displayText" />
    </slot>
  </span>
</template>

<script>
import { getRowById } from "../EntityHelper";
import HighlightRowPropSelection from "./HighlightRowPropSelection";

export default {
  name: "EntityById",
  components: { HighlightRowPropSelection },
  props: {
    tableName: {
      type: String,
      required: true
    },
    id: String
  },
  computed: {
    row() {
      return getRowById(this.tableName, this.id);
    },
    highlighted() {
      const { id } = this.getIdimptionSelectionForRow(this.row);
      return id && id.size && id.has(this.id);
    }
  }
};
</script>
