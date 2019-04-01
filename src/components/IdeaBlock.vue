<template>
  <EntityBlock tableName="idea" :row="row" showUser :readOnly="readOnly">
    <template slot="additionalInfo">
      <IdeaPropsLine :row="row" :showStatus="showStatus" />
    </template>

    <template #details="{ transitionsList }">
      <EditIdea
        :savedRow="row"
        :transitionsList="transitionsList"
        :readOnly="readOnly"
        :showHeader="false"
      />
    </template>
  </EntityBlock>
</template>

<script>
import { canUserEditUsersData } from "../auth";
import EntityBlock from "./EntityBlock";
import IdeaPropsLine from "./IdeaPropsLine";
import EditIdea from "./EditIdea";

export default {
  name: "IdeaBlock",
  components: { EntityBlock, IdeaPropsLine, EditIdea },
  computed: {
    readOnly() {
      return !canUserEditUsersData(this.row.userId);
    }
  },
  props: {
    row: {
      type: Object,
      required: true
    },
    showStatus: {
      type: Boolean,
      default: true
    }
  }
};
</script>
