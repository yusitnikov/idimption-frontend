<template>
  <ViewEntity tableName="category" :row="row" :readOnly="!verifiedEmail" />
</template>

<script>
import { mapGetters } from "vuex";
import ViewEntity from "./ViewEntity";

export default {
  name: "ViewCategory",
  components: { ViewEntity },
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
