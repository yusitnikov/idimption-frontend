<template>
  <EditEntity
    tableName="category"
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    v-slot="{ row, update }"
  >
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
  </EditEntity>
</template>

<script>
import EditEntity from "./EditEntity";
import FormRow from "./FormRow";
import EditCommonTextFields from "./EditCommonTextFields";
import EntitySelect from "./EntitySelect";
import { isChild } from "../EntityHelper";

export default {
  name: "EditCategory",
  components: {
    EditEntity,
    FormRow,
    EditCommonTextFields,
    EntitySelect
  },
  props: EditEntity.commonProps,
  methods: {
    isAllowedParent(category) {
      return !isChild(category, this.savedRow, "category");
    }
  }
};
</script>
