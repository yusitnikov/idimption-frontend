<template>
  <EditEntity
    tableName="idea"
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    showUser
    v-slot="{ row, isCreating, update }"
  >
    <EditCommonTextFields
      tableName="idea"
      :row="row"
      :transitionsList="transitionsList"
    />
    <FormRow label="Status">
      <!--suppress JSUnresolvedVariable -->
      <EntitySelect
        :transitionsList="transitionsList"
        :value="row.statusId"
        @change="statusId => update({ statusId })"
        tableName="ideastatus"
        selectFirstOnEmpty
      />
    </FormRow>
    <FormRow label="Tags">
      <MultipleEntitySelect
        tableName="ideatag"
        parentFieldName="ideaId"
        :parentId="row.id"
        :selectFieldNames="['tagId']"
        :transitionsList="transitionsList"
        allowAdd
      />
    </FormRow>
    <FormRow label="Categories">
      <MultipleEntitySelect
        tableName="ideacategory"
        parentFieldName="ideaId"
        :parentId="row.id"
        :selectFieldNames="['categoryId']"
        :transitionsList="transitionsList"
        allowAdd
        :addComponent="editCategoryComponent"
      />
    </FormRow>
    <FormRow label="Relations">
      <MultipleEntitySelect
        tableName="idearelation"
        parentFieldName="ideaId"
        :parentId="row.id"
        :selectFieldNames="['relationId', 'dstIdeaId']"
        :transitionsList="transitionsList"
        allowAdd
      />
    </FormRow>
    <FormRow label="Comments" text v-if="!isCreating">
      <IdeaComments :ideaId="row.id" />
    </FormRow>
  </EditEntity>
</template>

<script>
import EditEntity from "./EditEntity";
import FormRow from "./FormRow";
import EditCommonTextFields from "./EditCommonTextFields";
import EntitySelect from "./EntitySelect";
import MultipleEntitySelect from "./MultipleEntitySelect";
import IdeaComments from "./IdeaComments";
import EditCategory from "./EditCategory";

export default {
  name: "EditIdea",
  components: {
    EditEntity,
    FormRow,
    EditCommonTextFields,
    MultipleEntitySelect,
    EntitySelect,
    IdeaComments
  },
  props: EditEntity.commonProps,
  computed: {
    editCategoryComponent() {
      return EditCategory;
    }
  }
};
</script>
