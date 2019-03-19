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
import { getRowById, resolveGuid } from "../EntityHelper";
import Guid from "guid";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Idea",
  data() {
    return {
      id: null,
      transitionsList: new EntityTransitionsList()
    };
  },
  created() {
    // noinspection JSUnresolvedVariable
    this.id = this.$route.params.id;
    if (this.id === "add") {
      this.id = Guid.create();
      this.transitionsList.addRow("idea", this.row);
    }
  },
  computed: {
    ...mapState(["data"]),
    isCreating() {
      return Guid.isGuid(this.id);
    },
    row() {
      if (this.isCreating) {
        return {
          id: this.id,
          summary: "",
          description: ""
        };
      } else {
        // noinspection JSUnresolvedVariable
        return getRowById(this.data.idea, this.id);
      }
    }
  },
  methods: {
    ...mapActions([APPLY_TRANSITIONS_ACTION, DELETE_ROW_ACTION]),
    async save() {
      await this[APPLY_TRANSITIONS_ACTION](this.transitionsList);
      await this.$nextTick();
      this.id = resolveGuid(this.id);
    },
    remove() {
      this[DELETE_ROW_ACTION]({
        tableName: "idea",
        id: this.id
      });
      this.$router.push("/idea");
    }
  },
  components: {
    Button,
    EditIdea
  }
};
</script>

<style scoped lang="less"></style>
