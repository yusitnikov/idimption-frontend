<template>
  <div class="category-list">
    <div v-for="{ row, irrelevant } in tableRows" :key="row.id">
      <CategoryBlock :class="{ irrelevant }" :row="row" />
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
      let matchingIds = new Set();
      let matchingChildrenIds = new Set();
      for (const row of rows) {
        if (!this.filter || this.filter(row)) {
          matchingIds.add(row.id);
          for (let parent = row; parent; parent = parent.getParent()) {
            if (matchingChildrenIds.has(parent.id)) {
              break;
            } else {
              matchingChildrenIds.add(parent.id);
            }
          }
        }
      }
      rows = rows.filter(
        row => row.parentId === this.parentId && matchingChildrenIds.has(row.id)
      );
      return rows.map(row => ({
        row,
        irrelevant: !matchingIds.has(row.id)
      }));
    }
  }
};
</script>

<style scoped lang="less">
.children {
  padding-left: 50px;
}
</style>
