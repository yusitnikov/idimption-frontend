<template>
  <div class="category">
    <div>
      <router-link to="/category">&lt; Back</router-link>
    </div>
    <template v-if="row">
      <EditCategory :savedRow="row" :transitionsList="transitionsList" />
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
import EditCategory from "../components/EditCategory";
import EntityTransitionsList from "../EntityTransitionsList";
import { getRowById, resolveGuid } from "../EntityHelper";
import Guid from "guid";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Category",
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
      this.transitionsList.addRow("category", this.row);
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
          description: "",
          parentId: null
        };
      } else {
        return getRowById(this.data.category, this.id);
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
        tableName: "category",
        id: this.id
      });
      this.$router.push("/category");
    }
  },
  components: { EditCategory, Button }
};
</script>

<style scoped lang="less"></style>
