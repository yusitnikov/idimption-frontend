<template>
  <div class="idea-panel">
    <table>
      <thead>
        <tr>
          <th v-for="status in statuses" :key="status.id">
            {{ status.summary }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            v-for="status in statuses"
            :key="status.id"
            :width="100 / statuses.length + '%'"
          >
            <IdeaBlock
              v-for="row in tableRowsByStatus[status.id]"
              :key="row.id"
              :row="row"
              :showStatus="false"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getTableData } from "../storeProxy";
import IdeaBlock from "./IdeaBlock";

export default {
  name: "IdeaPanel",
  components: { IdeaBlock },
  props: {
    filter: Function
  },
  computed: {
    statuses() {
      return getTableData("ideastatus");
    },
    tableRowsByStatus() {
      let rows = getTableData("idea");
      // Important! This action will clone the array.
      // We need it to prevent from sorting the initial array.
      rows = rows.filter(this.filter || (() => true));
      rows.sort((a, b) => b.id - a.id);
      let rowsByStatus = {};
      for (const { id } of this.statuses) {
        rowsByStatus[id] = [];
      }
      for (const row of rows) {
        rowsByStatus[row.statusId].push(row);
      }
      return rowsByStatus;
    }
  }
};
</script>

<style scoped lang="less">
table {
  border-collapse: separate;
  border-spacing: 10px;

  th {
    font-size: 130%;
  }

  td {
    vertical-align: top;
  }
}
</style>
