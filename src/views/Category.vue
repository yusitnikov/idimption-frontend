<template>
  <EditEntityPage
    tableName="category"
    v-slot="{ row, transitionsList, readOnly }"
  >
    <EditCategory
      :savedRow="row"
      :transitionsList="transitionsList"
      :readOnly="readOnly"
    />
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
