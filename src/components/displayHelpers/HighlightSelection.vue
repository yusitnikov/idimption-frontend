<template>
  <span class="highlight-selection">
    <span
      v-for="(row, index) in parts"
      :key="index"
      :class="{ highlighted: row.highlighted }"
      v-text="row.text"
    />
  </span>
</template>

<script>
import { highlightFreeTextSearch } from "../../misc";

export default {
  name: "HighlightSelection",
  props: {
    text: {
      type: String,
      default: ""
    },
    selection: {
      type: String,
      default: ""
    }
  },
  computed: {
    parts() {
      return highlightFreeTextSearch(
        this.text,
        this.selection || this.computedIdimptionSelection.global
      );
    }
  }
};
</script>
