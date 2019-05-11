<template>
  <div class="categories">
    <div class="line" v-if="verifiedEmail">
      <Button @click="showAdd">
        <Icon type="plus" />
        Add new category
      </Button>

      <PopupForm
        title="Add new category"
        @save="saveAdd"
        @close="hideAdd"
        v-if="isAdding"
      >
        <EditCategory
          :savedRow="addFormRow"
          :transitionsList="popupTransitionsList"
        />
      </PopupForm>
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
import { matchesFreeTextSearch, validateAllInputs } from "../misc";
import EntityTransitionsList from "../EntityTransitionsList";
import { EntityRow } from "../EntityRow";
import Icon from "../components/displayHelpers/Icon";
import Button from "../components/Button";
import TextInput from "../components/inputs/TextInput";
import CategoryList from "../components/lists/CategoryList";
import RouteQueryMixin from "../mixins/RouteQueryMixin";
import PopupForm from "../components/forms/generic/PopupForm";
import EditCategory from "../components/forms/EditCategory";

export default {
  name: "Categories",
  components: {
    PopupForm,
    EditCategory,
    Icon,
    Button,
    TextInput,
    CategoryList
  },
  mixins: [RouteQueryMixin],
  data() {
    return {
      isAdding: false,
      popupTransitionsList: new EntityTransitionsList(),
      addFormRow: null
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
      this.addFormRow = new EntityRow("category", {}, true);
      this.popupTransitionsList.reset();
      this.popupTransitionsList.addRow(this.addFormRow);
      this.isAdding = true;
    },
    hideAdd() {
      this.isAdding = false;
    },
    async saveAdd() {
      if (!validateAllInputs(this)) {
        return;
      }
      await this.popupTransitionsList.save();
      this.hideAdd();
    },
    shouldDisplayCategory(category) {
      return matchesFreeTextSearch(category.summary, this.filterText);
    }
  }
};
</script>
