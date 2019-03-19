<template>
  <div class="edit-category">
    <template v-if="!isCreating">
      <FormRow label="ID" text>{{ row.id }}</FormRow>
      <!--suppress JSUnresolvedVariable -->
      <FormRow v-if="row.referenceId" label="Reference ID" text>
        {{ row.referenceId }}
      </FormRow>
    </template>
    <EditCommonTextFields
      tableName="category"
      :row="row"
      :transitionsList="transitionsList"
    />
    <FormRow label="Parent">
      <!--suppress JSUnresolvedVariable -->
      <EntitySelect
        :transitionsList="transitionsList"
        :value="row.parentId"
        @change="parentId => update({ parentId })"
        :filter="isAllowedParent"
        tableName="category"
        allowEmpty
      />
    </FormRow>
  </div>
</template>

<script>
import FormRow from "./FormRow";
import EditCommonTextFields from "./EditCommonTextFields";
import EntitySelect from "./EntitySelect";
import EntityTransitionsList from "../EntityTransitionsList";
import { isChild } from "../EntityHelper";
import Guid from "guid";

export default {
  name: "EditCategory",
  components: {
    FormRow,
    EditCommonTextFields,
    EntitySelect
  },
  props: {
    transitionsList: {
      type: EntityTransitionsList,
      required: true
    },
    savedRow: {
      type: Object,
      required: true
    }
  },
  computed: {
    row() {
      return this.transitionsList.applyToRow("category", this.savedRow);
    },
    isCreating() {
      return Guid.isGuid(this.row.id);
    }
  },
  methods: {
    isAllowedParent(category) {
      return !isChild(category, this.savedRow, "category");
    },
    update(updates) {
      this.transitionsList.updateRow("category", this.savedRow.id, updates);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
