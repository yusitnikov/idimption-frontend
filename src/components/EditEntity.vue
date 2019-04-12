<template>
  <div class="edit-entity">
    <template v-if="row">
      <template v-if="!isCreating">
        <h1 v-if="showHeader">
          [{{ savedRow.id }}] <AutoLink :text="savedDisplayText" />
          <slot
            name="title"
            v-bind="row"
            :row="row"
            :isCreating="isCreating"
            :update="update"
          />
        </h1>
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
    </template>
  </div>
</template>

<script>
import AutoLink from "./AutoLink";
import EntityFromAt from "./EntityFromAt";
import EntityTransitionsList from "../EntityTransitionsList";
import { focusFirstInput, resetAllInputs } from "../misc";

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
  components: { AutoLink, EntityFromAt },
  commonProps,
  props: {
    showUser: Boolean,
    ...commonProps
  },
  computed: {
    saved() {
      return this.transitionsList.isEmpty();
    },
    row() {
      return this.transitionsList.applyToRow(this.savedRow);
    },
    savedDisplayText() {
      return this.savedRow.getFullName().join(" > ");
    },
    isCreating() {
      return this.savedRow.isNew;
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
      this.transitionsList.updateRow(this.savedRow, updates);
    }
  }
};
</script>
