<template>
  <div class="edit-category">
    <template v-if="!isCreating">
      <FormRow label="ID" text>{{ row.id }}</FormRow>
      <!--suppress JSUnresolvedVariable -->
      <FormRow v-if="row.referenceId" label="Reference ID" text>
        {{ row.referenceId }}
      </FormRow>
    </template>
    <FormRow label="Summary">
      <TextInput v-model="row.summary" />
    </FormRow>
    <FormRow label="Description">
      <TextAreaInput v-model="row.description" />
    </FormRow>
    <FormRow label="Parent">
      <!--suppress JSUnresolvedVariable -->
      <EntitySelect
        :transitionsList="transitionsList"
        v-model="row.parentId"
        :filter="isAllowedParent"
        tableName="category"
        allowEmpty
      />
    </FormRow>
  </div>
</template>

<script>
import FormRow from "./FormRow";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import EntitySelect from "./EntitySelect";
import EntityTransitionsList from "../EntityTransitionsList";
import { isChild, cloneRow } from "../EntityHelper";
import Guid from "guid";

export default {
  name: "EditCategory",
  components: {
    FormRow,
    TextInput,
    TextAreaInput,
    EntitySelect
  },
  data: function() {
    return {
      row: cloneRow(this.savedRow)
    };
  },
  created() {
    const method = this.isCreating ? "addRow" : "updateRow";
    this.transitionsList[method]("category", this.row);
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
  methods: {
    isAllowedParent(category) {
      return !isChild(category, this.savedRow, "category");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
