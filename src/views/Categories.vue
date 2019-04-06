<template>
  <div class="categories">
    <div class="line" v-if="verifiedEmail">
      <Button @click="add">
        <Icon type="plus" />
        Add new category
      </Button>
    </div>

    <div class="line">
      <span class="inline inline-left">
        Filters:
      </span>

      <TextInput
        class="free-text inline-block inline-block-left"
        v-model="filterText"
        allowEmpty
        placeholder="Filter by free text..."
      />
    </div>

    <CategoryList class="next-section-start" :filter="shouldDisplayCategory" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { matchesFreeTextSearch } from "../misc";
import Icon from "../components/Icon";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import CategoryList from "../components/CategoryList";

export default {
  name: "Categories",
  components: { Icon, Button, TextInput, CategoryList },
  computed: {
    ...mapGetters(["verifiedEmail"]),
    routeQuery: {
      get() {
        return this.$route.query;
      },
      set(value) {
        this.$router.replace({ query: value });
      }
    },
    filterText: {
      get() {
        return this.routeQuery.text || null;
      },
      set(value) {
        this.routeQuery = {
          ...this.routeQuery,
          text: value || undefined
        };
      }
    }
  },
  methods: {
    add() {
      this.$router.push("/category/add");
    },
    shouldDisplayCategory(category) {
      return matchesFreeTextSearch(category.summary, this.filterText);
    }
  }
};
</script>
