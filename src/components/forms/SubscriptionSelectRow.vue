<template>
  <div class="subscription-select-row">
    <FormRow label="include" :labelWidth="60">
      <MultipleForeignEntitySelect
        :tableName="linkTableName"
        :selectFieldNames="[selectFieldName]"
        :transitionsList="transitionsList"
        :row="row"
        :foreignFilter="linkRow => linkRow.included"
        :filter="filterForeignRow"
        :addProps="{ included: true }"
      />
    </FormRow>
    <FormRow label="exclude" :labelWidth="60">
      <MultipleForeignEntitySelect
        :tableName="linkTableName"
        :selectFieldNames="[selectFieldName]"
        :transitionsList="transitionsList"
        :row="row"
        :foreignFilter="linkRow => !linkRow.included"
        :filter="filterForeignRow"
        :addProps="{ included: false }"
      />
    </FormRow>
  </div>
</template>

<script>
import { EntityRow } from "../../EntityRow";
import FormRow from "./generic/FormRow";
import MultipleForeignEntitySelect from "../inputs/MultipleForeignEntitySelect";
import EntityTransitionsList from "../../EntityTransitionsList";

export default {
  name: "SubscriptionSelectRow",
  components: {
    FormRow,
    MultipleForeignEntitySelect
  },
  props: {
    row: {
      type: EntityRow,
      required: true
    },
    transitionsList: {
      type: EntityTransitionsList,
      required: true
    },
    linkTableName: {
      type: String,
      required: true
    },
    selectFieldName: {
      type: String,
      required: true
    },
    filter: Function
  },
  methods: {
    filterForeignRow(foreignRow) {
      // Apply filter from props
      if (this.filter && !this.filter(foreignRow)) {
        return false;
      }

      // Filter out selected rows
      return !this.row
        .getForeignIds(
          this.linkTableName,
          this.selectFieldName,
          this.transitionsList
        )
        .includes(foreignRow.id);
    }
  }
};
</script>

<style lang="less">
.subscription-select-row {
  .form-row .label {
    font-style: italic;
  }
}
</style>
