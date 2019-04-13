<template>
  <HighlightSelection
    :text="row ? row[fieldName] : null"
    :selection="getIdimptionSelectionForRow(row)[fieldName]"
  />
</template>

<script>
import { EntityRow } from "../../EntityRow";
import HighlightSelection from "./HighlightSelection";

export default {
  name: "HighlightRowPropSelection",
  components: { HighlightSelection },
  props: {
    row: EntityRow,
    fieldName: {
      type: String,
      required: true
    }
  }
};
</script>
