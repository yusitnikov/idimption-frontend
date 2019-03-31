<template>
  <div class="categories">
    <div v-if="verifiedEmail">
      <Button @click="add">
        <Icon type="plus" />
        Add new category
      </Button>
    </div>
    <CategoryList />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Icon from "../components/Icon";
import Button from "../components/Button";
import CategoryList from "../components/CategoryList";

export default {
  name: "Categories",
  components: { Icon, Button, CategoryList },
  computed: {
    ...mapGetters(["verifiedEmail"])
  },
  methods: {
    add() {
      this.$router.push("/category/add");
    }
  }
};
</script>
