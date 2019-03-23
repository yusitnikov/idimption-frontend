<template>
  <fragment>
    <div>
      <router-link :to="'/' + tableName">&lt; Back</router-link>
    </div>
    <template v-if="row">
      <slot :row="row" :transitionsList="transitionsList" />
      <div class="footer">
        <Button @click="save">Save</Button>
        <Button @click="remove" v-if="!isCreating">Remove</Button>
      </div>
    </template>
    <template v-else>
      <div>Row not found</div>
    </template>
  </fragment>
</template>

<script>
import { mapActions } from "vuex";
import { DELETE_ROW_ACTION } from "../store";
import Button from "../components/Button";
import EntityTransitionsList from "../EntityTransitionsList";
import { getRowById, resolveGuid } from "../EntityHelper";
import Guid from "guid";

export default {
  name: "EditEntityPage",
  components: { Button },
  props: {
    tableName: {
      type: String,
      required: true
    }
  },
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
      this.transitionsList.addRow(this.tableName, this.row);
    }
  },
  computed: {
    isCreating() {
      return Guid.isGuid(this.id);
    },
    row() {
      return getRowById(this.tableName, this.id, true);
    }
  },
  methods: {
    ...mapActions([DELETE_ROW_ACTION]),
    async save() {
      await this.transitionsList.save();
      await this.$nextTick();
      this.id = resolveGuid(this.id);
    },
    remove() {
      this[DELETE_ROW_ACTION]({
        tableName: this.tableName,
        row: this.row
      });
      this.$router.push("/" + this.tableName);
    }
  }
};
</script>
