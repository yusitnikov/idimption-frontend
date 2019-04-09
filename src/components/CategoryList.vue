<template>
  <div class="category-list">
    <div v-for="row in currentData.rows" :key="row.id">
      <CategoryBlock
        :class="{ irrelevant: !currentData.isMatchingRow(row) }"
        :row="row"
      />
      <CategoryList class="children" :data="filteredData" :parentId="row.id" />
    </div>
    <div v-if="!filteredData.length && !parentId">No rows.</div>
  </div>
</template>

<script>
import { TableData } from "../TableData";
import { getTableData } from "../storeProxy";
import CategoryBlock from "./CategoryBlock";

export default {
  name: "CategoryList",
  components: { CategoryBlock },
  props: {
    data: TableData,
    parentId: {
      type: String,
      default: null
    },
    filter: Function
  },
  computed: {
    filteredData() {
      return (this.data || getTableData("category")).filter(this.filter);
    },
    currentData() {
      return this.filteredData.getRowsByFieldValue("parentId", this.parentId);
    }
  }
};
</script>

<style scoped lang="less">
.children {
  padding-left: 50px;
}
</style>
