<template>
  <div class="edit-common-text-fields">
    <FormRow label="Summary">
      <TextInput :value="row.summary" @input="summary => update({ summary })" />
    </FormRow>
    <FormRow label="Description">
      <TextAreaInput
        :value="row.description"
        @input="description => update({ description })"
        allowEmpty
      />
    </FormRow>
  </div>
</template>

<script>
import FormRow from "./FormRow";
import TextInput from "../../inputs/TextInput";
import TextAreaInput from "../../inputs/TextAreaInput";
import EntityTransitionsList from "../../../EntityTransitionsList";

export default {
  name: "EditCommonTextFields",
  components: {
    FormRow,
    TextInput,
    TextAreaInput
  },
  props: {
    row: {
      type: Object,
      required: true
    },
    transitionsList: {
      type: EntityTransitionsList,
      required: true
    }
  },
  methods: {
    update(updates) {
      this.transitionsList.updateRow(this.row, updates);
    }
  }
};
</script>
