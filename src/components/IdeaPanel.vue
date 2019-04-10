<template>
  <div class="idea-panel">
    <table>
      <thead>
        <tr>
          <th v-for="status in statuses" :key="status.id">
            {{ status.summary }} ({{ getTableRowsByStatus(status.id).length }})
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
              :getChildPayload="index => getTableRowsByStatus(status.id)[index]"
              :animationDuration="250"
              dragClass="dragging"
              dropClass="dropping"
              @drop="ev => drop(ev, status.id, false)"
            >
              <Draggable
                :class="{ readonly: !canEditUsersData(row) }"
                v-for="row in getTableRowsByStatus(status.id)"
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
    statuses() {
      return getTableData("ideastatus").rows;
    },
    tableData() {
      return this.dragTransitionsList.getTableData("idea");
    },
    sortedTableData() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.tableData.sort((a, b) => b.priority - a.priority);
    },
    filteredTableData() {
      return this.sortedTableData.filter(this.filter);
    }
  },
  methods: {
    getTableRowsByStatus(statusId) {
      return this.filteredTableData.getRowsByFieldValue("statusId", statusId)
        .rows;
    },
    drop(
      { removedIndex, addedIndex, payload: row },
      statusId,
      isFallbackContainer
    ) {
      // The Container component triggers the event for all elements, so need to filter the ones that really have info
      if (typeof addedIndex === "number") {
        const statusTasks = this.getTableRowsByStatus(statusId);
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
        let prevPriority = Number(prevRow && prevRow.priority);
        const nextRow = statusTasks[addedIndex];
        let nextPriority = Number(nextRow && nextRow.priority);
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
          while (
            this.tableData.getRowByFieldValue("priority", updates.priority)
          ) {
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
