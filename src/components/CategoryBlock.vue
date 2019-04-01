<template>
  <EntityBlock
    tableName="category"
    :row="row"
    :readOnly="readOnly"
    :expandable="!readOnly"
  >
    <template #details="{ transitionsList }">
      <EditCategory
        :savedRow="row"
        :transitionsList="transitionsList"
        :readOnly="readOnly"
        :showHeader="false"
      />
    </template>
  </EntityBlock>
</template>

<script>
import { mapGetters } from "vuex";
import EntityBlock from "./EntityBlock";
import EditCategory from "./EditCategory";

export default {
  name: "CategoryBlock",
  components: { EntityBlock, EditCategory },
  computed: {
    ...mapGetters(["verifiedEmail"]),
    readOnly() {
      return !this.verifiedEmail;
    }
  },
  props: {
    row: {
      type: Object,
      required: true
    }
  }
};
</script>
