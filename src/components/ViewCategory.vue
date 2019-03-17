<template>
  <div class="view-category block">
    <Button align="right" @click="remove">Remove</Button>
    <Button align="right" @click="edit">Edit</Button>
    <h2>#{{ row.id }} {{ row.summary }}</h2>
    <h3 v-if="row.description" class="multi-line">{{ row.description }}</h3>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { DELETE_ROW_ACTION } from "../store";
import Button from "./Button";

export default {
  name: "ViewCategory",
  components: { Button },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions([DELETE_ROW_ACTION]),
    edit() {
      this.$router.push("/category/" + this.row.id);
    },
    remove() {
      this[DELETE_ROW_ACTION]({
        tableName: "category",
        row: this.row
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
