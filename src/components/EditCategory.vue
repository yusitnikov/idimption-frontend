<template>
  <EditEntity
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    :showHeader="showHeader"
    v-slot="{ row, isCreating, update }"
  >
    <div
      :class="{
        readonly: true,
        'next-section-start': showHeader && !isCreating
      }"
      v-if="readOnly"
    >
      <!-- eslint-disable-next-line -->
      <div class="description multi-line">{{ row.description || "No description provided." }}</div>
    </div>
    <div
      :class="{
        editable: true,
        'next-section-start': showHeader && !isCreating
      }"
      v-else
    >
      <EditCommonTextFields :row="row" :transitionsList="transitionsList" />

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
      return !category.isChild(this.savedRow);
    }
  }
};
</script>
