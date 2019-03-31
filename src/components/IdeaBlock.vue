<template>
  <EntityBlock
    tableName="idea"
    :row="row"
    showUser
    :readOnly="!verifiedEmail || row.userId !== userId"
  >
    <IdeaPropsLine :row="row" />
  </EntityBlock>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import EntityBlock from "./EntityBlock";
import IdeaPropsLine from "./IdeaPropsLine";

export default {
  name: "IdeaBlock",
  components: { IdeaPropsLine, EntityBlock },
  computed: {
    ...mapState(["userId"]),
    ...mapGetters(["verifiedEmail"])
  },
  props: {
    row: {
      type: Object,
      required: true
    }
  }
};
</script>
