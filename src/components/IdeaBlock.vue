<template>
  <EntityBlock
    tableName="idea"
    :row="row"
    showUser
    :readOnly="!canEditUsersData(row.userId)"
  >
    <template slot="additionalInfo">
      <IdeaPropsLine :row="row" />
    </template>

    <template #details="{ transitionsList, readOnly }">
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
import { mapGetters } from "vuex";
import EntityBlock from "./EntityBlock";
import IdeaPropsLine from "./IdeaPropsLine";
import EditIdea from "./EditIdea";

export default {
  name: "IdeaBlock",
  components: { EntityBlock, IdeaPropsLine, EditIdea },
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
