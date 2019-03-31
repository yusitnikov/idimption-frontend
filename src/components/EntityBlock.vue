<template>
  <div class="view-entity block">
    <div class="summary-actions">
      <!-- eslint-disable-next-line -->
      <router-link :to="pageUrl">Open</router-link>
      <Button align="right" @click="remove" v-if="!readOnly">
        Remove
      </Button>
    </div>

    <div class="summary" @click="toggleExpanded">
      <Icon class="square" :type="expanded ? 'caret-down' : 'caret-right'" />
      [{{ row.id }}] {{ displayText }}
      <span class="summary-from-at">
        <EntityFromAt :row="row" :showUser="showUser" />
      </span>
    </div>

    <div class="additional-info" v-if="!expanded">
      <slot name="additionalInfo" />
    </div>

    <div class="details" v-if="expanded">
      <slot
        name="details"
        :transitionsList="transitionsList"
        :readOnly="readOnly"
      />

      <div class="details-footer" v-if="!readOnly">
        <Button @click="save">Save</Button>

        <Button @click="remove">Remove</Button>

        <!-- eslint-disable-next-line -->
        <router-link :to="pageUrl">Open</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { validateAllInputs } from "../misc";
import Button from "./Button";
import Icon from "./Icon";
import EntityFromAt from "./EntityFromAt";
import EntityTransitionsList from "../EntityTransitionsList";
import { getDisplayText, deleteRow } from "../EntityHelper";

export default {
  name: "EntityBlock",
  components: { Button, Icon, EntityFromAt },
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
  data() {
    return {
      transitionsList: new EntityTransitionsList(),
      expanded: false
    };
  },
  computed: {
    pageUrl() {
      return "/" + this.tableName + "/" + this.row.id;
    },
    displayText() {
      return getDisplayText(this.row, this.tableName);
    }
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
    save() {
      if (!validateAllInputs(this)) {
        return;
      }
      this.transitionsList.save();
    },
    remove() {
      deleteRow(this.tableName, this.row);
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.summary-actions {
  float: right;
  line-height: @button-full-height;
}

.summary {
  cursor: pointer;
  font-size: @button-full-height / @line-height;

  .summary-from-at {
    font-size: @font-size;
  }
}

.additional-info,
.details,
.details-footer {
  margin-top: @paragraph-margin;
}

.description {
  font-size: 120%;
}
</style>
