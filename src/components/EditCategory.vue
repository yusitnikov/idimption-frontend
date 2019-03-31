<template>
  <EditEntity
    tableName="category"
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    v-slot="{ row, update }"
  >
    <div class="readonly" v-if="readOnly">
      <!-- eslint-disable-next-line -->
      <div class="description multi-line">{{ row.description || "No description provided." }}</div>
    </div>
    <div class="editable" v-else>
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
  props: {
    ...EditEntity.commonProps,
    readOnly: Boolean
  },
  methods: {
    isAllowedParent(category) {
      return !isChild(category, this.savedRow, "category");
    }
  }
};
</script>
