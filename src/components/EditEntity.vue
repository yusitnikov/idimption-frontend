<template>
  <div class="edit-entity">
    <template v-if="!isCreating">
      <h1 v-if="showHeader">[{{ savedRow.id }}] {{ savedDisplayText }}</h1>
      <EntityFromAt :row="row" :showUser="showUser">
        <slot
          name="entity-from-at"
          v-bind="row"
          :row="row"
          :isCreating="isCreating"
        />
      </EntityFromAt>
    </template>
    <slot v-bind="row" :row="row" :isCreating="isCreating" :update="update" />
  </div>
</template>

<script>
import EntityFromAt from "./EntityFromAt";
import EntityTransitionsList from "../EntityTransitionsList";
import { focusFirstInput, resetAllInputs } from "../misc";
import { getRowFullName, isNewRow } from "../EntityHelper";

const commonProps = {
  transitionsList: {
    type: EntityTransitionsList,
    required: true
  },
  savedRow: {
    type: Object,
    required: true
  },
  showHeader: {
    type: Boolean,
    default: true
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
    saved() {
      return this.transitionsList.isEmpty();
    },
    row() {
      return this.transitionsList.applyToRow(this.tableName, this.savedRow);
    },
    savedDisplayText() {
      return getRowFullName(this.savedRow, this.tableName).join(" > ");
    },
    isCreating() {
      return isNewRow(this.savedRow, this.tableName);
    }
  },
  watch: {
    saved() {
      if (this.saved) {
        resetAllInputs(this);
        this.$emit("save");
      }
    }
  },
  mounted() {
    focusFirstInput(this);
  },
  methods: {
    update(updates) {
      this.transitionsList.updateRow(this.tableName, this.savedRow.id, updates);
    }
  }
};
</script>
