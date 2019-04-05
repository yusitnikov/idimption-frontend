<template>
  <fragment>
    <slot v-bind="row" :row="row">
      <template v-if="row">{{ row.displayText }}</template>
    </slot>
  </fragment>
</template>

<script>
import { getRowById } from "../EntityHelper";

export default {
  name: "EntityById",
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
    }
  }
};
</script>
