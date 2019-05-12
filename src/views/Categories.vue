<template>
  <div class="categories">
    <div class="line" v-if="verifiedEmail">
      <Button @click="showAdd">
        <Icon type="plus" />
        Add new category
      </Button>

      <AddEntityPopup
        title="Add new category"
        tableName="category"
        @close="hideAdd"
        #default="{ addRow, addTransitionsList }"
        v-if="isAdding"
      >
        <EditCategory
          :savedRow="addRow"
          :transitionsList="addTransitionsList"
        />
      </AddEntityPopup>
    </div>

    <div class="line inline-block-container">
      <span class="inline-item">
        Filters:
      </span>

      <TextInput
        class="free-text"
        v-model="filterText"
        allowEmpty
        placeholder="Filter by free text..."
      />
    </div>

    <CategoryList
      class="next-section-start"
      :filter="shouldDisplayCategory"
      :idimptionSelection="selection"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { matchesFreeTextSearch } from "../misc";
import Icon from "../components/displayHelpers/Icon";
import Button from "../components/Button";
import TextInput from "../components/inputs/TextInput";
import CategoryList from "../components/lists/CategoryList";
import RouteQueryMixin from "../mixins/RouteQueryMixin";
import AddEntityPopup from "../components/forms/generic/AddEntityPopup";
import EditCategory from "../components/forms/EditCategory";

export default {
  name: "Categories",
  components: {
    AddEntityPopup,
    EditCategory,
    Icon,
    Button,
    TextInput,
    CategoryList
  },
  mixins: [RouteQueryMixin],
  data() {
    return {
      isAdding: false
    };
  },
  computed: {
    ...mapGetters(["verifiedEmail"]),
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
    },
    selection() {
      return {
        category: {
          displayText: this.filterText
        }
      };
    }
  },
  methods: {
    showAdd() {
      this.isAdding = true;
    },
    hideAdd() {
      this.isAdding = false;
    },
    shouldDisplayCategory(category) {
      return matchesFreeTextSearch(category.summary, this.filterText);
    }
  }
};
</script>
