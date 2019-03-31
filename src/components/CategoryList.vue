<template>
  <div class="category-list">
    <div v-for="row in tableRows" :key="row.id">
      <CategoryBlock :row="row" />
      <CategoryList class="children" :parentId="row.id" :filter="filter" />
    </div>
    <div v-if="!tableRows.length && !parentId">No rows.</div>
  </div>
</template>

<script>
import { getTableData } from "../storeProxy";
import CategoryBlock from "./CategoryBlock";

export default {
  name: "CategoryList",
  components: { CategoryBlock },
  props: {
    parentId: {
      type: String,
      default: null
    },
    filter: Function
  },
  computed: {
    tableRows() {
      let rows = getTableData("category");
      rows = rows.filter(row => row.parentId === this.parentId);
      if (this.filter) {
        // TODO: filter by child levels - should keep the current level
        rows = rows.filter(this.filter);
      }
      return rows;
    }
  }
};
</script>

<style scoped lang="less">
.children {
  padding-left: 50px;
}
</style>
