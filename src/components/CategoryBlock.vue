<template>
  <EntityBlock tableName="category" :row="row" :readOnly="!verifiedEmail" />
</template>

<script>
import { mapGetters } from "vuex";
import EntityBlock from "./EntityBlock";

export default {
  name: "CategoryBlock",
  components: { EntityBlock },
  computed: {
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
