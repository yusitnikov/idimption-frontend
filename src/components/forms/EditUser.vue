<template>
  <EditEntity
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    :showHeader="false"
    :focusFirstInput="focusFirstInput"
    @save="passwordConfirmation = ''"
    v-slot="{
      id,
      name,
      avatarUrl,
      passwordHash,
      verifiedEmail,
      isCreating,
      update
    }"
  >
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
          class="remove-avatar no-margin"
          @click="() => update({ avatarUrl: null })"
          v-if="avatarUrl"
        >
          Remove photo
        </Button>
      </UserAvatarBlock>
    </FormRow>

    <FormRow class="next-section-start" label="New password">
      <TextInput
        type="password"
        autocomplete="off"
        :value="passwordHash || ''"
        allowEmpty
        :minLength="8"
        @input="
          passwordHash => update({ passwordHash: passwordHash || undefined })
        "
      />
    </FormRow>
    <FormRow label="Confirm pass">
      <TextInput
        type="password"
        autocomplete="off"
        :allowEmpty="!passwordHash"
        :validationMessage="
          passwordConfirmation !== passwordHash &&
            'Passwords not match, please input again'
        "
        v-model="passwordConfirmation"
      />
    </FormRow>
  </EditEntity>
</template>

<script>
import EditEntity from "./generic/EditEntity";
import FormRow from "./generic/FormRow";
import TextInput from "../inputs/TextInput";
import FileInput from "../inputs/FileInput";
import UserAvatarBlock from "../displayHelpers/UserAvatarBlock";
import Button from "../Button";

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
@import "../../styles/essentials";

.remove-avatar {
  .block-margin-top;
}

.text-input {
  width: 270px;
}
</style>
