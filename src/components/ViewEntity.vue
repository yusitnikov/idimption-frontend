<template>
  <div class="view-entity block">
    <Button align="right" @click="remove" v-if="!readOnly">
      Remove
    </Button>
    <Button align="right" @click="navigate">
      {{ readOnly ? "View" : "Edit" }}
    </Button>

    <div class="summary">
      [{{ row.id }}] {{ displayText }}
      <span class="summary-from-at">
        <EntityFromAt :row="row" :showUser="showUser" />
      </span>
    </div>
    <div class="additional-info"><slot /></div>
    <!-- eslint-disable-next-line -->
    <div v-if="additionalInfoText" class="description additional-info multi-line">{{ additionalInfoText }}</div>
  </div>
</template>

<script>
import Button from "./Button";
import EntityFromAt from "./EntityFromAt";
import {
  getDisplayText,
  getAdditionalInfoText,
  deleteRow
} from "../EntityHelper";

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
    readOnly: Boolean,
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
    navigate() {
      this.$router.push("/" + this.tableName + "/" + this.row.id);
    },
    remove() {
      deleteRow(this.tableName, this.row);
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.summary {
  font-size: @button-full-height / @line-height;

  .summary-from-at {
    font-size: @font-size;
  }
}

.additional-info {
  margin-top: @paragraph-margin;
}

.description {
  font-size: 120%;
}
</style>
