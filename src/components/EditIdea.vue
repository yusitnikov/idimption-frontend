<template>
  <div class="edit-idea">
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
    <FormRow label="Summary">
      <TextInput v-model="row.summary" />
    </FormRow>
    <FormRow label="Description">
      <TextAreaInput v-model="row.description" />
    </FormRow>
    <FormRow label="Status">
      <!--suppress JSUnresolvedVariable -->
      <EntitySelect
        :transitionsList="transitionsList"
        v-model="row.statusId"
        tableName="ideastatus"
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
  </div>
</template>

<script>
import FormRow from "./FormRow";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import EntitySelect from "./EntitySelect";
import MultipleEntitySelect from "./MultipleEntitySelect";
import EntityTransitionsList from "../EntityTransitionsList";
import IdeaComments from "./IdeaComments";
import { cloneRow } from "../EntityHelper";
import Guid from "guid";
import DateTime from "./DateTime";

export default {
  name: "EditIdea",
  data: function() {
    return {
      row: cloneRow(this.savedRow)
    };
  },
  created() {
    const method = this.isCreating ? "addRow" : "updateRow";
    this.transitionsList[method]("idea", this.row);
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
    isCreating() {
      return Guid.isGuid(this.row.id);
    }
  },
  components: {
    DateTime,
    FormRow,
    TextInput,
    TextAreaInput,
    MultipleEntitySelect,
    EntitySelect,
    IdeaComments
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
