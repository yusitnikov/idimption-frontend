<template>
  <div class="idea-list">
    <ViewIdea v-for="row in tableRows" :row="row" :key="row.id" />
    <div v-if="!tableRows.length">No rows.</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ViewIdea from "./ViewIdea";

export default {
  name: "IdeaList",
  components: { ViewIdea },
  props: {
    filter: Function
  },
  computed: {
    ...mapState(["data"]),
    tableRows() {
      // noinspection JSUnresolvedVariable
      let rows = this.data.idea;
      if (this.filter) {
        rows = rows.filter(this.filter);
      }
      return rows;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
