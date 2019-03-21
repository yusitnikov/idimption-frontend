<template>
  <ViewEntity tableName="category" :row="row" />
</template>

<script>
import ViewEntity from "./ViewEntity";

export default {
  name: "ViewCategory",
  components: { ViewEntity },
  props: {
    row: {
      type: Object,
      required: true
    }
  }
};
</script>
