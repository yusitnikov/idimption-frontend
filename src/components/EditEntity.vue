<template>
  <div class="edit-entity">
    <template v-if="!isCreating">
      <h1>[{{ savedRow.id }}] {{ savedDisplayText }}</h1>
      <h3><EntityFromAt :row="row" :showUser="showUser" /></h3>
    </template>
    <slot :row="row" :isCreating="isCreating" :update="update" />
  </div>
</template>

<script>
import EntityFromAt from "./EntityFromAt";
import EntityTransitionsList from "../EntityTransitionsList";
import { getDisplayText, isNewRow } from "../EntityHelper";

const commonProps = {
  transitionsList: {
    type: EntityTransitionsList,
    required: true
  },
  savedRow: {
    type: Object,
    required: true
  }
};

export default {
  name: "EditEntity",
  components: { EntityFromAt },
  commonProps,
  props: {
    tableName: {
      type: String,
      required: true
    },
    showUser: Boolean,
    ...commonProps
  },
  computed: {
    row() {
      return this.transitionsList.applyToRow(this.tableName, this.savedRow);
    },
    savedDisplayText() {
      return getDisplayText(this.savedRow, this.tableName);
    },
    isCreating() {
      return isNewRow(this.savedRow, this.tableName);
    }
  },
  methods: {
    update(updates) {
      this.transitionsList.updateRow(this.tableName, this.savedRow.id, updates);
    }
  }
};
</script>
