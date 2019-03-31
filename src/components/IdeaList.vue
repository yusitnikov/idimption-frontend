<template>
  <div class="idea-list">
    <IdeaBlock v-for="row in tableRows" :row="row" :key="row.id" />
    <div v-if="!tableRows.length">No rows.</div>
  </div>
</template>

<script>
import { getTableData } from "../storeProxy";
import IdeaBlock from "./IdeaBlock";

export default {
  name: "IdeaList",
  components: { IdeaBlock },
  props: {
    filter: Function
  },
  computed: {
    tableRows() {
      let rows = getTableData("idea");
      if (this.filter) {
        rows = rows.filter(this.filter);
      }
      return rows;
    }
  }
};
</script>
