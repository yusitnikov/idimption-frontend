<template>
  <EditEntity
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    :showHeader="showHeader"
    showUser
  >
    <template #entity-from-at="{ row, isCreating }">
      <IdeaVote class="header-vote" :ideaId="row.id" v-if="!isCreating" />
    </template>
    <template #default="{ row, isCreating, update }">
      <div
        :class="{ readonly: true, 'next-section-start': !isCreating }"
        v-if="readOnly"
      >
        <IdeaPropsLine :row="row" />

        <!-- eslint-disable-next-line -->
        <div class="description multi-line">{{ row.description || "No description provided." }}</div>

        <h2 class="next-section-start">Comments</h2>
        <IdeaComments :ideaId="row.id" key="comments" />
      </div>
      <div
        :class="{ editable: true, 'next-section-start': !isCreating }"
        v-else
      >
        <EditCommonTextFields :row="row" :transitionsList="transitionsList" />

        <FormRow label="Status">
          <!--suppress JSUnresolvedVariable -->
          <EntitySelect
            :transitionsList="transitionsList"
            :value="row.statusId"
            @change="statusId => update({ statusId })"
            tableName="ideastatus"
            selectFirstOnEmpty
          />
        </FormRow>

        <FormRow class="next-section-start" label="Tags">
          <MultipleForeignEntitySelect
            tableName="ideatag"
            :row="row"
            :selectFieldNames="['tagId']"
            :transitionsList="transitionsList"
            :allowAdd="verifiedEmail"
          />
        </FormRow>
        <FormRow label="Categories">
          <MultipleForeignEntitySelect
            tableName="ideacategory"
            :row="row"
            :selectFieldNames="['categoryId']"
            :transitionsList="transitionsList"
            :allowAdd="verifiedEmail"
            :addComponent="editCategoryComponent"
          />
        </FormRow>
        <FormRow label="Relations">
          <MultipleForeignEntitySelect
            tableName="idearelation"
            :row="row"
            :selectFieldNames="['relationId', 'dstIdeaId']"
            :transitionsList="transitionsList"
          />
        </FormRow>

        <FormRow class="next-section-start" label="Comments" v-if="!isCreating">
          <IdeaComments :ideaId="row.id" key="comments" />
        </FormRow>
      </div>
    </template>
  </EditEntity>
</template>

<script>
import { mapGetters } from "vuex";
import EditEntity from "./EditEntity";
import IdeaVote from "./IdeaVote";
import IdeaPropsLine from "./IdeaPropsLine";
import FormRow from "./FormRow";
import EditCommonTextFields from "./EditCommonTextFields";
import EntitySelect from "./EntitySelect";
import MultipleForeignEntitySelect from "./MultipleForeignEntitySelect";
import IdeaComments from "./IdeaComments";
import EditCategory from "./EditCategory";

export default {
  name: "EditIdea",
  components: {
    EditEntity,
    IdeaVote,
    IdeaPropsLine,
    FormRow,
    EditCommonTextFields,
    MultipleForeignEntitySelect,
    EntitySelect,
    IdeaComments
  },
  props: {
    ...EditEntity.commonProps,
    readOnly: Boolean
  },
  computed: {
    ...mapGetters(["verifiedEmail"]),
    editCategoryComponent() {
      return EditCategory;
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.header-vote {
  margin-left: @button-distance;
}

.readonly {
  .description {
    margin: 20px 0;
    font-size: 120%;
  }
}
</style>
