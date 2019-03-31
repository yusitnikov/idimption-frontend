<template>
  <EditEntity
    tableName="user"
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    :showHeader="false"
    @save="passwordConfirmation = ''"
    v-slot="{
      id,
      name,
      avatarUrl,
      password,
      verifiedEmail,
      isCreating,
      update
    }"
  >
    <FormRow label="Login (email)" v-if="isCreating">
      <TextInput :value="id" isEmail @input="id => update({ id })" />
    </FormRow>

    <FormRow label="Name">
      <TextInput :value="name" @input="name => update({ name })" />
    </FormRow>

    <FormRow label="Photo" v-if="verifiedEmail">
      <UserAvatarBlock :userId="id" :avatarUrl="avatarUrl">
        <FileInput
          :value="avatarUrl"
          @input="avatarUrl => update({ avatarUrl })"
        >
          Upload photo
        </FileInput>

        <Button
          class="remove-avatar"
          @click="() => update({ avatarUrl: null })"
          v-if="avatarUrl"
        >
          Remove photo
        </Button>
      </UserAvatarBlock>
    </FormRow>

    <TextInput
      type="hidden"
      name="username"
      :value="id"
      noValidation
      v-if="!isCreating"
    />
    <FormRow label="New password">
      <TextInput
        type="password"
        autocomplete="off"
        :value="password || ''"
        allowEmpty
        :minLength="8"
        @input="password => update({ password })"
      />
    </FormRow>
    <FormRow label="Confirm password">
      <TextInput
        type="password"
        autocomplete="off"
        :allowEmpty="!password"
        :validationMessage="
          passwordConfirmation !== password &&
            'Passwords not match, please input again'
        "
        v-model="passwordConfirmation"
      />
    </FormRow>
  </EditEntity>
</template>

<script>
import EditEntity from "./EditEntity";
import FormRow from "./FormRow";
import TextInput from "./TextInput";
import FileInput from "./FileInput";
import UserAvatarBlock from "./UserAvatarBlock";
import Button from "./Button";

export default {
  name: "EditUser",
  components: {
    Button,
    UserAvatarBlock,
    EditEntity,
    FormRow,
    TextInput,
    FileInput
  },
  props: EditEntity.commonProps,
  data() {
    return {
      passwordConfirmation: ""
    };
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.remove-avatar {
  .block-margin-top;
}
</style>
