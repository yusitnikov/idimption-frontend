<template>
  <div class="idea">
    <div>
      <router-link to="/idea">&lt; Back</router-link>
    </div>
    <template v-if="row">
      <EditIdea :savedRow="row" :transitionsList="transitionsList" />
      <div class="footer">
        <Button @click="save">Save</Button>
        <Button @click="remove" v-if="!isCreating">Remove</Button>
      </div>
    </template>
    <template v-else>
      <div>Row not found</div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { APPLY_TRANSITIONS_ACTION, DELETE_ROW_ACTION } from "../store";
import Button from "../components/Button";
import EditIdea from "../components/EditIdea";
import EntityTransitionsList from "../EntityTransitionsList";
import { getRowById, cloneRow } from "../EntityHelper";
import Guid from "guid";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Idea",
  data() {
    return {
      row: null,
      transitionsList: new EntityTransitionsList()
    };
  },
  created() {
    if (this.isCreating) {
      this.row = {
        id: Guid.create()
      };
      this.transitionsList.addRow("idea", this.row);
    } else if (this.savedRow) {
      this.row = cloneRow(this.savedRow);
      this.transitionsList.updateRow("idea", this.row);
    }
  },
  computed: {
    ...mapState(["data"]),
    id() {
      // noinspection JSUnresolvedVariable
      const id = this.$route.params.id;
      return id === "add" ? null : id;
    },
    isCreating() {
      return this.id === null;
    },
    savedRow() {
      if (this.isCreating) {
        return null;
      } else {
        // noinspection JSUnresolvedVariable
        return getRowById(this.data.idea, this.id);
      }
    }
  },
  methods: {
    ...mapActions([APPLY_TRANSITIONS_ACTION, DELETE_ROW_ACTION]),
    save() {
      this[APPLY_TRANSITIONS_ACTION](this.transitionsList);
    },
    remove() {
      this[DELETE_ROW_ACTION]({
        tableName: "idea",
        row: this.row
      });
    }
  },
  components: {
    Button,
    EditIdea
  }
};
</script>

<style scoped lang="less"></style>
