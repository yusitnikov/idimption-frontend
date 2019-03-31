<template>
  <EditEntity
    tableName="idea"
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    showUser
    v-slot="{ row, isCreating, update }"
  >
    <div class="readonly" v-if="readOnly">
      <IdeaPropsLine class="marks" :row="row" />

      <!-- eslint-disable-next-line -->
      <div class="description multi-line">{{ row.description || "No description provided." }}</div>

      <h2>Comments</h2>
      <IdeaComments :ideaId="row.id" key="comments" />
    </div>
    <div class="editable" v-else>
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
          :allowAdd="verifiedEmail"
        />
      </FormRow>
      <FormRow label="Categories">
        <MultipleEntitySelect
          tableName="ideacategory"
          parentFieldName="ideaId"
          :parentId="row.id"
          :selectFieldNames="['categoryId']"
          :transitionsList="transitionsList"
          :allowAdd="verifiedEmail"
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
        />
      </FormRow>

      <FormRow label="Comments" text v-if="!isCreating">
        <IdeaComments :ideaId="row.id" key="comments" />
      </FormRow>
    </div>
  </EditEntity>
</template>

<script>
import { mapGetters } from "vuex";
import EditEntity from "./EditEntity";
import IdeaPropsLine from "./IdeaPropsLine";
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
    IdeaPropsLine,
    FormRow,
    EditCommonTextFields,
    MultipleEntitySelect,
    EntitySelect,
    IdeaComments
  },
  props: {
    ...EditEntity.commonProps,
    readOnly: Boolean
  },
  computed: {
    ...mapGetters(["verifiedEmail"]),
    editCategoryComponent() {
      return EditCategory;
    }
  }
};
</script>

<style scoped lang="less">
.readonly {
  .marks {
    margin: 10px 0;
  }

  .description {
    margin: 20px 0;
    font-size: 120%;
  }
}
</style>
