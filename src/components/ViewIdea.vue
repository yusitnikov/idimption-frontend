<template>
  <ViewEntity tableName="idea" :row="row" showUser />
</template>

<script>
import ViewEntity from "./ViewEntity";

export default {
  name: "ViewIdea",
  components: { ViewEntity },
  props: {
    row: {
      type: Object,
      required: true
    }
  }
};
</script>
