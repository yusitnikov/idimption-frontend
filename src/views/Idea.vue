<template>
  <EditEntityPage
    tableName="idea"
    allowAnonymous
    v-slot="{ row, transitionsList, readOnly }"
  >
    <EditIdea
      :savedRow="row"
      :transitionsList="transitionsList"
      :readOnly="readOnly"
    />
  </EditEntityPage>
</template>

<script>
import EditEntityPage from "./EditEntityPage";
import EditIdea from "../components/forms/EditIdea";

export default {
  name: "Idea",
  components: { EditEntityPage, EditIdea }
};
</script>
