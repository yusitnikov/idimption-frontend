<template>
  <div class="edit-user">
    <FormRow label="Login" :text="!isCreating">
      <TextInput
        v-if="isCreating"
        :value="row.id"
        @input="id => update({ id })"
      />
      <template v-else>{{ row.id }}</template>
    </FormRow>
    <FormRow label="Name">
      <TextInput :value="row.name" @input="name => update({ name })" />
    </FormRow>
  </div>
</template>

<script>
import FormRow from "./FormRow";
import TextInput from "./TextInput";
import EntityTransitionsList from "../EntityTransitionsList";
import { isNewRow } from "../EntityHelper";

export default {
  name: "EditUser",
  components: {
    FormRow,
    TextInput
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
      return this.transitionsList.applyToRow("user", this.savedRow);
    },
    isCreating() {
      return isNewRow(this.savedRow, "user");
    }
  },
  methods: {
    update(updates) {
      this.transitionsList.updateRow("user", this.savedRow.id, updates);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
