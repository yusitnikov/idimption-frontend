<template>
  <div
    :class="{ 'entity-block': true, block: true, expandable }"
    @click="showPopup"
  >
    <div class="actions pull-right">
      <slot name="actions" />
      <EntitySubscriptionIcon
        :row="updatedRow"
        :transitionsList="transitionsList"
      />
      <ButtonLink :href="pageUrl" @click="stopPropagation">
        <Icon type="external-link-alt" />
      </ButtonLink>
      <ButtonLink plain @click="remove" v-if="!readOnly">
        <Icon type="trash-alt" />
      </ButtonLink>
    </div>

    <div class="line summary">
      [{{ row.id }}]
      <HighlightRowPropSelection
        class="summary-text"
        :row="row"
        fieldName="displayText"
      />
    </div>

    <EntityFromAt :row="row" :showUser="showUser" />

    <div class="line additional-info">
      <slot name="additionalInfo" />
    </div>

    <PopupForm
      :title="row.displayText"
      @save="savePopup"
      @close="hidePopup"
      v-if="expanded"
    >
      <slot name="details" :popupTransitionsList="popupTransitionsList" />
    </PopupForm>
  </div>
</template>

<script>
import EntityTransitionsList from "../../../EntityTransitionsList";
import { EntityRow } from "../../../EntityRow";
import { validateAllInputs } from "../../../misc";
import EntitySubscriptionIcon from "../../stats/EntitySubscriptionIcon";
import ButtonLink from "../../ButtonLink";
import PopupForm from "../../forms/generic/PopupForm";
import Icon from "../../displayHelpers/Icon";
import EntityFromAt from "../../displayHelpers/EntityFromAt";
import HighlightRowPropSelection from "../../displayHelpers/HighlightRowPropSelection";
import RouteQueryMixin from "../../../mixins/RouteQueryMixin";

export default {
  name: "EntityBlock",
  components: {
    EntitySubscriptionIcon,
    ButtonLink,
    PopupForm,
    Icon,
    EntityFromAt,
    HighlightRowPropSelection
  },
  mixins: [RouteQueryMixin],
  props: {
    row: {
      type: EntityRow,
      required: true
    },
    transitionsList: {
      type: EntityTransitionsList,
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
      popupTransitionsList: new EntityTransitionsList()
    };
  },
  computed: {
    expanded: {
      get() {
        return this.routeQuery.expanded === this.row.id;
      },
      set(value) {
        this.routeQuery = {
          ...this.routeQuery,
          expanded: value ? this.row.id : undefined
        };
      }
    },
    updatedRow() {
      return this.transitionsList.applyToRow(this.row);
    },
    pageUrl() {
      return "/" + this.row.tableName + "/" + this.row.id;
    }
  },
  methods: {
    showPopup() {
      if (this.expandable) {
        this.popupTransitionsList.reset();
        // noinspection JSUnusedGlobalSymbols
        this.expanded = true;
      }
    },
    hidePopup() {
      // noinspection JSUnusedGlobalSymbols
      this.expanded = false;
    },
    stopPropagation(event) {
      event.stopPropagation();
    },
    async savePopup() {
      if (!validateAllInputs(this)) {
        return;
      }
      await this.popupTransitionsList.save();
      this.hidePopup();
    },
    remove(event) {
      this.stopPropagation(event);
      this.row.deleteNow();
    }
  }
};
</script>

<style scoped lang="less">
@import "../../../styles/essentials";

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
