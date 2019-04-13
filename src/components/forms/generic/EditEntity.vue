<template>
  <div class="edit-entity">
    <template v-if="row">
      <template v-if="!isCreating">
        <h1 v-if="showHeader">
          <span class="inline-item">
            [{{ savedRow.id }}] <AutoLink :text="savedDisplayText" />
          </span>
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

          <EntitySubscriptionIcon
            :row="row"
            :transitionsList="transitionsList"
            v-if="showSubscriptions"
          />
        </EntityFromAt>
      </template>
      <slot v-bind="row" :row="row" :isCreating="isCreating" :update="update" />
    </template>
  </div>
</template>

<script>
import EntityTransitionsList from "../../../EntityTransitionsList";
import { focusFirstInput, resetAllInputs } from "../../../misc";
import AutoLink from "../../displayHelpers/AutoLink";
import EntityFromAt from "../../displayHelpers/EntityFromAt";
import EntitySubscriptionIcon from "../../stats/EntitySubscriptionIcon";

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
  },
  focusFirstInput: {
    type: Boolean,
    default: true
  }
};

export default {
  name: "EditEntity",
  components: { AutoLink, EntityFromAt, EntitySubscriptionIcon },
  commonProps,
  props: {
    showUser: Boolean,
    showSubscriptions: Boolean,
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
    if (this.focusFirstInput) {
      focusFirstInput(this);
    }
  },
  methods: {
    update(updates) {
      this.transitionsList.updateRow(this.savedRow, updates);
    }
  }
};
</script>
