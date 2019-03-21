<template>
  <EditEntity
    tableName="user"
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    v-slot="{ row, isCreating, update }"
  >
    <FormRow label="Login" v-if="isCreating">
      <TextInput :value="row.id" @input="id => update({ id })" />
    </FormRow>
    <FormRow label="Name">
      <TextInput :value="row.name" @input="name => update({ name })" />
    </FormRow>
  </EditEntity>
</template>

<script>
import EditEntity from "./EditEntity";
import FormRow from "./FormRow";
import TextInput from "./TextInput";

export default {
  name: "EditUser",
  components: {
    EditEntity,
    FormRow,
    TextInput
  },
  props: EditEntity.commonProps
};
</script>
