<template>
  <div class="ideas">
    <div class="line" v-if="!userId || verifiedEmail">
      <Button @click="add">
        <Icon type="plus" />
        Add new idea
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

      <!--suppress RequiredAttributes value (v-model does it)-->
      <MultipleEntitySelect
        class="filter-tags inline inline-left"
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
        class="filter-categories inline inline-left"
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
        class="filter-users inline inline-left"
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
        class="filter-from-dt inline-block inline-block-left"
        v-model="filterFromDate"
        allowEmpty
        placeholder="Filter by date..."
      />

      to
      <DateInput
        class="filter-to-dt inline-block inline-block-left"
        v-model="filterToDate"
        allowEmpty
        placeholder="Filter by date..."
      />

      <!--suppress RequiredAttributes value (handled by v-model)-->
      <CheckboxInput
        class="filter-with-comments inline-block inline-block-left"
        v-model="filterWithComments"
      >
        with comments
      </CheckboxInput>

      <!--suppress RequiredAttributes value (handled by v-model)-->
      <CheckboxInput
        class="filter-with-votes inline-block inline-block-left"
        v-model="filterWithVotes"
      >
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
import Icon from "../components/Icon";
import Button from "../components/Button";
import MultipleEntitySelect from "../components/MultipleEntitySelect";
import TextInput from "../components/TextInput";
import DateInput from "../components/DateInput";
import CheckboxInput from "../components/CheckboxInput";
import IdeaPanel from "../components/IdeaPanel";

export default {
  name: "Ideas",
  components: {
    Icon,
    Button,
    MultipleEntitySelect,
    TextInput,
    DateInput,
    CheckboxInput,
    IdeaPanel
  },
  computed: {
    ...mapState(["userId"]),
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
    add() {
      this.$router.push("/idea/add");
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
