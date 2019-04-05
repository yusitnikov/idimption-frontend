<template>
  <div
    :class="{ 'entity-block': true, block: true, expandable }"
    @click="showDetails"
  >
    <div class="pull-right">
      <ButtonLink align="right" plain @click="remove" v-if="!readOnly">
        <Icon type="trash-alt" />
      </ButtonLink>
      <ButtonLink align="right" :href="pageUrl" @click="stopPropagation">
        <Icon type="external-link-alt" />
      </ButtonLink>
      <div class="pull-right">
        <slot name="actions" />
      </div>
    </div>

    <div class="line summary">[{{ row.id }}] {{ row.displayText }}</div>

    <EntityFromAt :row="row" :showUser="showUser" />

    <div class="line additional-info">
      <slot name="additionalInfo" />
    </div>

    <PopupForm
      :title="row.displayText"
      @save="save"
      @close="hideDetails"
      v-if="expanded"
    >
      <slot name="details" :transitionsList="transitionsList" />
    </PopupForm>
  </div>
</template>

<script>
import EntityTransitionsList from "../EntityTransitionsList";
import { EntityRow } from "../EntityRow";
import { validateAllInputs } from "../misc";
import ButtonLink from "./ButtonLink";
import PopupForm from "./PopupForm";
import Icon from "./Icon";
import EntityFromAt from "./EntityFromAt";

export default {
  name: "EntityBlock",
  components: { ButtonLink, PopupForm, Icon, EntityFromAt },
  props: {
    row: {
      type: EntityRow,
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
      return "/" + this.row.tableName + "/" + this.row.id;
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
      this.row.deleteNow();
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

.pull-right {
  float: right;
  margin-left: @button-distance;
}

.summary {
  font-size: 120%;
  font-weight: bold;
}
</style>
