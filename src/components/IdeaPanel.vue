<template>
  <div class="idea-panel">
    <table>
      <thead>
        <tr>
          <th v-for="status in statuses" :key="status.id">
            {{ status.summary }} ({{ tableRowsByStatus[status.id].length }})
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
            <!-- This container expands to the whole cell height -->
            <Container
              class="drag-container-fallback"
              groupName="shared"
              :shouldAnimateDrop="() => false"
              :animationDuration="250"
              dragClass="dragging"
              dropClass="dropping"
              @drop="ev => drop(ev, status.id, true)"
            />
            <!-- This container expands only to the height of the elements in it -->
            <Container
              groupName="shared"
              nonDragAreaSelector=".readonly"
              :getChildPayload="index => tableRowsByStatus[status.id][index]"
              :animationDuration="250"
              dragClass="dragging"
              dropClass="dropping"
              @drop="ev => drop(ev, status.id, false)"
            >
              <Draggable
                :class="{ readonly: !canEditUsersData(row) }"
                v-for="row in tableRowsByStatus[status.id]"
                :key="row.id"
              >
                <IdeaBlock
                  class="draggable-block"
                  :row="row"
                  :showStatus="false"
                />
              </Draggable>
            </Container>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTableData } from "../storeProxy";
import IdeaBlock from "./IdeaBlock";
import { Container, Draggable } from "vue-smooth-dnd";
import EntityTransitionsList from "../EntityTransitionsList";

export default {
  name: "IdeaPanel",
  components: { IdeaBlock, Container, Draggable },
  props: {
    filter: Function
  },
  data() {
    return {
      dragTransitionsList: new EntityTransitionsList()
    };
  },
  computed: {
    ...mapGetters(["canEditUsersData"]),
    data() {
      return this.dragTransitionsList.applyToState();
    },
    statuses() {
      return getTableData("ideastatus");
    },
    tableRows() {
      // noinspection JSUnresolvedVariable
      return this.data.idea;
    },
    tableRowsByStatus() {
      let rows = this.tableRows;
      // Important! This action will clone the array.
      // We need it to prevent from sorting the initial array.
      rows = rows.filter(this.filter || (() => true));
      rows.sort((a, b) => (b.priority || b.id) - (a.priority || a.id));
      let rowsByStatus = {};
      for (const { id } of this.statuses) {
        rowsByStatus[id] = [];
      }
      for (const row of rows) {
        rowsByStatus[row.statusId].push(row);
      }
      return rowsByStatus;
    }
  },
  methods: {
    drop(
      { removedIndex, addedIndex, payload: row },
      statusId,
      isFallbackContainer
    ) {
      // The Container component triggers the event for all elements, so need to filter the ones that really have info
      if (typeof addedIndex === "number") {
        const statusTasks = this.tableRowsByStatus[statusId];
        if (isFallbackContainer) {
          addedIndex = statusTasks.length;
          if (statusTasks[addedIndex - 1] === row) {
            // Nothing changed, skip
            return;
          }
        }

        // Set the status
        let updates = {};
        if (row.statusId !== statusId) {
          updates.statusId = statusId;
        } else {
          if (statusTasks[addedIndex] === row) {
            // Nothing changed, skip
            return;
          }
          if (!isFallbackContainer && addedIndex > removedIndex) {
            ++addedIndex;
          }
        }

        // Calculate the new priority based on items that it is inserted between
        const prevRow = statusTasks[addedIndex - 1];
        let prevPriority = Number(prevRow && (prevRow.priority || prevRow.id));
        const nextRow = statusTasks[addedIndex];
        let nextPriority = Number(nextRow && (nextRow.priority || nextRow.id));
        if (prevRow || nextRow) {
          // Inserting to the top - take a priority a little bit higher then the first item
          if (!prevRow) {
            prevPriority = Math.ceil(nextPriority);
            if (prevPriority === nextPriority) {
              prevPriority += 0.5;
            }
          }
          // Inserting to the bottom - take a priority a little bit higher then the last item
          if (!nextRow) {
            nextPriority = Math.floor(prevPriority);
            if (nextPriority === nextPriority) {
              nextPriority -= 0.5;
            }
          }
          updates.priority = (prevPriority + nextPriority) / 2;

          // Ensure that the new priority is unique
          let rowsByPriority = {};
          for (const row of this.tableRows) {
            rowsByPriority[(row.priority || row.id).toString()] = row;
          }
          while (rowsByPriority[updates.priority.toString()]) {
            updates.priority = (prevPriority + updates.priority) / 2;
          }
        }

        // Send the API request
        this.dragTransitionsList.updateRow(row, updates).save();
      }
    }
  }
};
</script>

<style scoped lang="less">
table {
  border-collapse: separate;
  border-spacing: 10px;
  // Cancel outer spacing
  margin: -10px;

  th {
    font-size: 130%;
  }

  td {
    position: relative;
    vertical-align: top;
  }
}

.drag-container-fallback {
  position: absolute;
  width: 100%;
  height: 100%;
}

@draggable-shadow-length: 30px;
@draggable-shadow-color: rgba(0, 0, 0, 0.5);

.draggable-block {
  // Explicitly set the color to white instead of transparent
  background: white;

  .smooth-dnd-ghost & {
    transition: box-shadow 250ms;
    box-shadow: 0 0 0 0 @draggable-shadow-color;

    &.dragging:not(.dropping) {
      box-shadow: @draggable-shadow-length @draggable-shadow-length
        @draggable-shadow-length 0 @draggable-shadow-color;
    }
  }
}
</style>
