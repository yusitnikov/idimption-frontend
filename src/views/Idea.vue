<template>
  <EditEntityPage tableName="idea" v-slot="{ row, transitionsList }">
    <EditIdea :savedRow="row" :transitionsList="transitionsList" />
  </EditEntityPage>
</template>

<script>
import EditEntityPage from "./EditEntityPage";
import EditIdea from "../components/EditIdea";

export default {
  name: "Idea",
  components: { EditEntityPage, EditIdea }
};
</script>
