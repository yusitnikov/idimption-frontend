<template>
  <div class="categories">
    <div>
      <Button @click="add">Add new category</Button>
    </div>
    <CategoryList />
  </div>
</template>

<script>
import CategoryList from "../components/CategoryList";
import Button from "../components/Button";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Categories",
  components: {
    CategoryList,
    Button
  },
  methods: {
    add() {
      this.$router.push("/category/add");
    }
  }
};
</script>
