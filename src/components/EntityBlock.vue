<template>
  <div
    :class="{ 'entity-block': true, block: true, expandable }"
    @click="showDetails"
  >
    <ButtonLink align="right" plain @click="remove" v-if="!readOnly">
      <Icon type="trash-alt" />
    </ButtonLink>
    <ButtonLink align="right" :href="pageUrl" @click="stopPropagation">
      <Icon type="external-link-alt" />
    </ButtonLink>

    <div class="line summary">[{{ row.id }}] {{ displayText }}</div>

    <EntityFromAt :row="row" :showUser="showUser" />

    <div class="line additional-info">
      <slot name="additionalInfo" />
    </div>

    <PopupForm
      :title="displayText"
      @save="save"
      @close="hideDetails"
      v-if="expanded"
    >
      <slot
        name="details"
        :transitionsList="transitionsList"
        :readOnly="readOnly"
      />
    </PopupForm>
  </div>
</template>

<script>
import { validateAllInputs } from "../misc";
import ButtonLink from "./ButtonLink";
import PopupForm from "./PopupForm";
import Icon from "./Icon";
import EntityFromAt from "./EntityFromAt";
import EntityTransitionsList from "../EntityTransitionsList";
import { getDisplayText, deleteRow } from "../EntityHelper";

export default {
  name: "EntityBlock",
  components: { ButtonLink, PopupForm, Icon, EntityFromAt },
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
    expandable: {
      type: Boolean,
      default: true
    },
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
    showDetails() {
      if (this.expandable) {
        this.expanded = true;
      }
    },
    hideDetails() {
      this.expanded = false;
    },
    stopPropagation(event) {
      event.stopPropagation();
    },
    async save() {
      if (!validateAllInputs(this)) {
        return;
      }
      await this.transitionsList.save();
      this.hideDetails();
    },
    remove(event) {
      this.stopPropagation(event);
      deleteRow(this.tableName, this.row);
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.entity-block.block {
  padding-bottom: @block-vertical-padding - @paragraph-margin;

  &.expandable {
    cursor: pointer;
  }
}

.summary {
  font-size: 120%;
  font-weight: bold;
}
</style>
