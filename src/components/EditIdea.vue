<template>
  <fragment>
    <template v-if="!isCreating">
      <FormRow label="ID" text>{{ row.id }}</FormRow>
      <!--suppress JSUnresolvedVariable -->
      <FormRow v-if="row.referenceId" label="Reference ID" text>
        {{ row.referenceId }}
      </FormRow>
      <!--suppress JSUnresolvedVariable -->
      <FormRow label="Created by" text>
        {{ row.userId }}
        at
        <!--suppress JSUnresolvedVariable -->
        <DateTime :value="row.createdAt" />
        <!--suppress JSUnresolvedVariable -->
        <template v-if="row.updatedAt !== row.createdAt">
          updated at
          <!--suppress JSUnresolvedVariable -->
          <DateTime :value="row.updatedAt" />
        </template>
      </FormRow>
    </template>
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
  </fragment>
</template>

<script>
import FormRow from "./FormRow";
import EditCommonTextFields from "./EditCommonTextFields";
import EntitySelect from "./EntitySelect";
import MultipleEntitySelect from "./MultipleEntitySelect";
import IdeaComments from "./IdeaComments";
import DateTime from "./DateTime";
import EntityTransitionsList from "../EntityTransitionsList";
import EditCategory from "./EditCategory";
import { isNewRow } from "../EntityHelper";

export default {
  name: "EditIdea",
  components: {
    DateTime,
    FormRow,
    EditCommonTextFields,
    MultipleEntitySelect,
    EntitySelect,
    IdeaComments
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
      return this.transitionsList.applyToRow("idea", this.savedRow);
    },
    isCreating() {
      return isNewRow(this.savedRow, "idea");
    },
    editCategoryComponent() {
      return EditCategory;
    }
  },
  methods: {
    update(updates) {
      this.transitionsList.updateRow("idea", this.savedRow.id, updates);
    }
  }
};
</script>
