<template>
  <ViewEntity
    tableName="idea"
    :row="row"
    showUser
    :readOnly="!verifiedEmail || row.userId !== userId"
  >
    <IdeaPropsLine :row="row" />
  </ViewEntity>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ViewEntity from "./ViewEntity";
import IdeaPropsLine from "./IdeaPropsLine";

export default {
  name: "ViewIdea",
  components: { IdeaPropsLine, ViewEntity },
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
