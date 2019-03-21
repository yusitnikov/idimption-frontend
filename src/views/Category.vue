<template>
  <EditEntityPage tableName="category" v-slot="{ row, transitionsList }">
    <EditCategory :savedRow="row" :transitionsList="transitionsList" />
  </EditEntityPage>
</template>

<script>
import EditEntityPage from "./EditEntityPage";
import EditCategory from "../components/EditCategory";

export default {
  name: "Category",
  components: { EditEntityPage, EditCategory }
};
</script>
