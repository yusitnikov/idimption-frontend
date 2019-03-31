<template>
  <fragment>
    <slot
      v-bind="row"
      :row="row"
      :displayText="displayText"
      :additionalInfoText="additionalInfoText"
    >
      {{ displayText }}
    </slot>
  </fragment>
</template>

<script>
import {
  getRowById,
  getDisplayText,
  getAdditionalInfoText
} from "../EntityHelper";

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
    },
    displayText() {
      return this.row ? getDisplayText(this.row, this.tableName) : null;
    },
    additionalInfoText() {
      return this.row ? getAdditionalInfoText(this.row, this.tableName) : null;
    }
  }
};
</script>
