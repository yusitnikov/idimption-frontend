<template>
  <div class="ideas">
    <div class="line" v-if="!userId || verifiedEmail">
      <Button @click="showAdd">
        <Icon type="plus" />
        Add new idea
      </Button>

      <AddEntityPopup
        title="Add new idea"
        tableName="idea"
        :defaultValues="{
          projectId: this.filterProject || null
        }"
        @close="hideAdd"
        #default="{ addRow, addTransitionsList }"
        v-if="isAdding"
      >
        <EditIdea :savedRow="addRow" :transitionsList="addTransitionsList" />
      </AddEntityPopup>
    </div>

    <div class="line inline-block-container">
      <span class="inline-item">
        Filters:
      </span>

      <EntitySelect
        class="filter-project"
        v-model="filterProject"
        tableName="idea"
        allowEmpty
        emptyLabel="No project"
        emptyPlaceholder="No project"
        :filter="idea => idea.isProject"
        :tipFunction="getProjectIdeaCount"
      />

      <TextInput
        class="free-text"
        v-model="filterText"
        allowEmpty
        placeholder="Filter by free text..."
      />

      <!--suppress RequiredAttributes value (v-model does it)-->
      <MultipleEntitySelect
        class="filter-tags"
        v-model="filterTags"
        plainValue
        alwaysOpened
        :selectTableNames="['tag']"
        :tipFunction="getTagIdeaCount"
        placeholder="Filter by tags..."
        iconClass="tag"
        iconTitle="Tag"
      />

      <!--suppress RequiredAttributes value (v-model does it)-->
      <MultipleEntitySelect
        class="filter-categories"
        v-model="filterCategories"
        plainValue
        alwaysOpened
        :selectTableNames="['category']"
        :tipFunction="getCategoryIdeaCount"
        placeholder="Filter by categories..."
        iconClass="sitemap"
        iconTitle="Category"
      />

      <!--suppress RequiredAttributes value (v-model does it)-->
      <MultipleEntitySelect
        class="filter-users"
        v-model="filterUsers"
        plainValue
        alwaysOpened
        :selectTableNames="['user']"
        :filter="getUserIdeaCount"
        :tipFunction="getUserIdeaCount"
        placeholder="Filter by users..."
        iconClass="user"
        iconTitle="User"
      />

      from
      <DateInput
        class="filter-from-dt"
        v-model="filterFromDate"
        allowEmpty
        placeholder="Filter by date..."
      />

      to
      <DateInput
        class="filter-to-dt"
        v-model="filterToDate"
        allowEmpty
        placeholder="Filter by date..."
      />

      <!--suppress RequiredAttributes value (handled by v-model)-->
      <CheckboxInput v-model="filterWithComments">
        with comments
      </CheckboxInput>

      <!--suppress RequiredAttributes value (handled by v-model)-->
      <CheckboxInput v-model="filterWithVotes">
        with votes
      </CheckboxInput>
    </div>

    <IdeaPanel
      class="next-section-start"
      :filter="shouldDisplayIdea"
      :idimptionSelection="selection"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { toArray, formatDate, matchesFreeTextSearch } from "../misc";
import { getTableData } from "../storeProxy";
import Icon from "../components/displayHelpers/Icon";
import Button from "../components/Button";
import MultipleEntitySelect from "../components/inputs/MultipleEntitySelect";
import EntitySelect from "../components/inputs/EntitySelect";
import TextInput from "../components/inputs/TextInput";
import DateInput from "../components/inputs/DateInput";
import CheckboxInput from "../components/inputs/CheckboxInput";
import IdeaPanel from "../components/lists/IdeaPanel";
import RouteQueryMixin from "../mixins/RouteQueryMixin";
import AddEntityPopup from "../components/forms/generic/AddEntityPopup";
import EditIdea from "../components/forms/EditIdea";

export default {
  name: "Ideas",
  components: {
    AddEntityPopup,
    EditIdea,
    Icon,
    Button,
    MultipleEntitySelect,
    EntitySelect,
    TextInput,
    DateInput,
    CheckboxInput,
    IdeaPanel
  },
  mixins: [RouteQueryMixin],
  data() {
    return {
      isAdding: false
    };
  },
  computed: {
    ...mapState(["userId"]),
    ...mapGetters(["verifiedEmail"]),
    filterProject: {
      get() {
        return this.routeQuery.project || null;
      },
      set(value) {
        this.routeQuery = {
          ...this.routeQuery,
          project: value || undefined
        };
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
    },
    filterTags: {
      get() {
        return toArray(this.routeQuery.tag);
      },
      set(value) {
        this.routeQuery = {
          ...this.routeQuery,
          tag: value
        };
      }
    },
    filterCategories: {
      get() {
        return toArray(this.routeQuery.cat);
      },
      set(value) {
        this.routeQuery = {
          ...this.routeQuery,
          cat: value
        };
      }
    },
    filterUsers: {
      get() {
        return toArray(this.routeQuery.user);
      },
      set(value) {
        this.routeQuery = {
          ...this.routeQuery,
          user: value
        };
      }
    },
    filterFromStr: {
      get() {
        return this.routeQuery.from;
      },
      set(value) {
        this.routeQuery = {
          ...this.routeQuery,
          from: value || undefined
        };
      }
    },
    filterFromDate: {
      get() {
        return this.filterFromStr ? new Date(this.filterFromStr) : null;
      },
      set(value) {
        this.filterFromStr = formatDate(value);
      }
    },
    filterToStr: {
      get() {
        return this.routeQuery.to;
      },
      set(value) {
        this.routeQuery = {
          ...this.routeQuery,
          to: value || undefined
        };
      }
    },
    filterToDate: {
      get() {
        return this.filterToStr ? new Date(this.filterToStr) : null;
      },
      set(value) {
        this.filterToStr = formatDate(value);
      }
    },
    filterWithComments: {
      get() {
        return !!this.routeQuery.withComments;
      },
      set(value) {
        this.routeQuery = {
          ...this.routeQuery,
          withComments: value || undefined
        };
      }
    },
    filterWithVotes: {
      get() {
        return !!this.routeQuery.withVotes;
      },
      set(value) {
        this.routeQuery = {
          ...this.routeQuery,
          withVotes: value || undefined
        };
      }
    },
    filterTagsSet() {
      return new Set(this.filterTags);
    },
    filterCategoriesSet() {
      return getTableData("category").getAllChildrenIdsSet(
        this.filterCategories
      );
    },
    filterUsersSet() {
      return new Set(this.filterUsers);
    },
    selection() {
      return {
        idea: {
          displayText: this.filterText
        },
        tag: {
          id: this.filterTagsSet
        },
        category: {
          id: this.filterCategoriesSet
        },
        user: {
          id: this.filterUsersSet
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
    shouldDisplayIdeaByForeignIds(
      idea,
      set,
      foreignTableName,
      foreignFieldName
    ) {
      return (
        set.size === 0 ||
        idea
          .getForeignIds(foreignTableName, foreignFieldName)
          .some(id => set.has(id))
      );
    },
    shouldDisplayIdea(idea) {
      return (
        (idea.id === this.filterProject ||
          idea.projectId === this.filterProject) &&
        matchesFreeTextSearch(idea.summary, this.filterText) &&
        this.shouldDisplayIdeaByForeignIds(
          idea,
          this.filterTagsSet,
          "ideatag",
          "tagId"
        ) &&
        this.shouldDisplayIdeaByForeignIds(
          idea,
          this.filterCategoriesSet,
          "ideacategory",
          "categoryId"
        ) &&
        (this.filterUsersSet.size === 0 ||
          this.filterUsersSet.has(idea.userId)) &&
        (!this.filterFromStr ||
          formatDate(idea.createdAtDt) >= this.filterFromStr) &&
        (!this.filterToStr ||
          formatDate(idea.createdAtDt) <= this.filterToStr) &&
        (!this.filterWithComments ||
          idea.getForeignRows("ideacomment").length !== 0) &&
        (!this.filterWithVotes || idea.getForeignRows("ideavote").length !== 0)
      );
    },
    getProjectIdeaCountById(projectId) {
      return getTableData("idea").getRowsByFieldValue("projectId", projectId)
        .length;
    },
    getProjectIdeaCount(project) {
      return this.getProjectIdeaCountById(project ? project.id : null);
    },
    getTagIdeaCount(tag) {
      return tag.getForeignRows("ideatag").length;
    },
    getCategoryIdeaCount(row) {
      return row.getForeignIds("ideacategory", "ideaId", null, true).length;
    },
    getUserIdeaCount(user) {
      return user.getForeignRows("idea").length;
    }
  }
};
</script>

<style lang="less">
@import "../styles/essentials";

.ideas {
  .free-text,
  .filter-tags,
  .filter-users {
    .add-tag-select {
      width: 200px;
    }
  }

  .picker-input {
    width: 125px;
  }
}
</style>
