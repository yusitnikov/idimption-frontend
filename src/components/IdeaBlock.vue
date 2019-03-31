<template>
  <EntityBlock
    tableName="idea"
    :row="row"
    showUser
    :readOnly="!canEditUsersData(row.userId)"
  >
    <IdeaPropsLine :row="row" />
  </EntityBlock>
</template>

<script>
import { mapGetters } from "vuex";
import EntityBlock from "./EntityBlock";
import IdeaPropsLine from "./IdeaPropsLine";

export default {
  name: "IdeaBlock",
  components: { IdeaPropsLine, EntityBlock },
  computed: {
    ...mapGetters(["canEditUsersData"])
  },
  props: {
    row: {
      type: Object,
      required: true
    }
  }
};
</script>
