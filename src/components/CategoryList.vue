<template>
  <div class="category-list">
    <div v-for="row in tableRows" :key="row.id">
      <ViewCategory :row="row" />
      <CategoryList class="children" :parentId="row.id" :filter="filter" />
    </div>
    <div v-if="!tableRows.length && !parentId">No rows.</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ViewCategory from "./ViewCategory";

export default {
  name: "CategoryList",
  components: { ViewCategory },
  props: {
    parentId: {
      type: String,
      default: null
    },
    filter: Function
  },
  computed: {
    ...mapState(["data"]),
    tableRows() {
      let rows = this.data.category;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.children {
  padding-left: 50px;
}
</style>
