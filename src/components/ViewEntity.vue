<template>
  <div class="view-entity block">
    <Button align="right" @click="remove">Remove</Button>
    <Button align="right" @click="edit">Edit</Button>
    <div class="summary">
      [{{ row.id }}] {{ displayText }}
      <span class="summary-from-at">
        <EntityFromAt :row="row" :showUser="showUser" />
      </span>
    </div>
    <!-- eslint-disable-next-line -->
    <div v-if="additionalInfoText" class="description multi-line">{{ additionalInfoText }}</div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { DELETE_ROW_ACTION } from "../store";
import Button from "./Button";
import EntityFromAt from "./EntityFromAt";
import { getDisplayText, getAdditionalInfoText } from "../EntityHelper";

export default {
  name: "ViewEntity",
  components: { Button, EntityFromAt },
  props: {
    tableName: {
      type: String,
      required: true
    },
    row: {
      type: Object,
      required: true
    },
    showUser: Boolean
  },
  computed: {
    displayText() {
      return getDisplayText(this.row, this.tableName);
    },
    additionalInfoText() {
      return getAdditionalInfoText(this.row, this.tableName);
    }
  },
  methods: {
    ...mapActions([DELETE_ROW_ACTION]),
    edit() {
      this.$router.push("/" + this.tableName + "/" + this.row.id);
    },
    remove() {
      this[DELETE_ROW_ACTION]({
        tableName: this.tableName,
        id: this.row.id
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../styles/essentials";

.summary {
  font-size: @button-full-height / @line-height;

  .summary-from-at {
    font-size: @font-size;
  }
}

.description {
  margin-top: @paragraph-margin;
  font-size: 19px;
}
</style>
