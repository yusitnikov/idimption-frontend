<template>
  <EditEntity
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    :showHeader="showHeader"
    :focusFirstInput="focusFirstInput"
    showUser
    showSubscriptions
  >
    <template #entity-from-at="{ row, isCreating }">
      <EntityVote :row="row" v-if="!isCreating" />
    </template>
    <template #default="{ row, isCreating, update }">
      <div
        :class="{ readonly: true, 'next-section-start': !isCreating }"
        v-if="readOnly"
      >
        <IdeaPropsLine :row="row" />

        <!-- eslint-disable-next-line -->
        <div class="description multi-line"><AutoLink :text="row.description || 'No description provided.'" /></div>

        <h2 class="next-section-start">Comments</h2>
        <IdeaComments :ideaId="row.id" key="comments" />
      </div>
      <div
        :class="{ editable: true, 'next-section-start': !isCreating }"
        v-else
      >
        <EditCommonTextFields :row="row" :transitionsList="transitionsList" />

        <FormRow label="Project" :text="row.isProject">
          <template v-if="row.isProject">
            This idea is a project.
            <ProjectIdeas :row="row" v-if="!isCreating" />
          </template>
          <template v-else>
            <table class="project-row">
              <tbody>
                <tr>
                  <td>
                    <EntitySelect
                      :transitionsList="transitionsList"
                      :value="row.projectId"
                      @change="projectId => update({ projectId })"
                      tableName="idea"
                      allowEmpty
                      emptyLabel="No project"
                      emptyPlaceholder="No project"
                      allowAdd
                      allowAddEmpty
                      :addDefaultValues="{ isProject: true }"
                      :addComponent="editIdeaComponent"
                      :filter="idea => idea.id !== row.id && !idea.projectId"
                      sort
                      sortField="isProject"
                      :sortFunction="
                        (a, b) => {
                          return (
                            (b.isProject ? 1 : 0) - (a.isProject ? 1 : 0) ||
                            a.displayText.localeCompare(b.displayText)
                          );
                        }
                      "
                    />
                  </td>
                  <td class="convert-to-project">
                    <Button
                      @click="
                        () => update({ isProject: true, projectId: null })
                      "
                    >
                      Convert to a project
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </FormRow>

        <FormRow label="Status">
          <EntitySelect
            :transitionsList="transitionsList"
            :value="row.statusId"
            @change="statusId => update({ statusId })"
            tableName="ideastatus"
            :sort="false"
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
            v-slot="{ id, displayText }"
          >
            <ButtonLink :href="'/category/' + id">{{ displayText }}</ButtonLink>
          </MultipleForeignEntitySelect>
        </FormRow>
        <FormRow label="Relations">
          <MultipleForeignEntitySelect
            tableName="idearelation"
            :row="row"
            :selectFieldNames="['relationId', 'dstIdeaId']"
            :transitionsList="transitionsList"
            v-slot="{ tableName, id, displayText }"
          >
            <template v-if="tableName === 'idea'">
              <ButtonLink :href="'/idea/' + id">{{ displayText }}</ButtonLink>
            </template>
            <template v-else>
              {{ displayText }}
            </template>
          </MultipleForeignEntitySelect>
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
import EditEntity from "./generic/EditEntity";
import EntityVote from "../stats/EntityVote";
import IdeaPropsLine from "../IdeaPropsLine";
import FormRow from "./generic/FormRow";
import EditCommonTextFields from "./generic/EditCommonTextFields";
import EntitySelect from "../inputs/EntitySelect";
import MultipleForeignEntitySelect from "../inputs/MultipleForeignEntitySelect";
import ButtonLink from "../ButtonLink";
import AutoLink from "../displayHelpers/AutoLink";
import IdeaComments from "../lists/IdeaComments";
import EditCategory from "./EditCategory";
import Button from "../Button";
import ProjectIdeas from "../stats/ProjectIdeas";

const EditIdea = {
  name: "EditIdea",
  components: {
    ProjectIdeas,
    Button,
    EditEntity,
    EntityVote,
    IdeaPropsLine,
    FormRow,
    EditCommonTextFields,
    MultipleForeignEntitySelect,
    ButtonLink,
    EntitySelect,
    AutoLink,
    IdeaComments
  },
  props: {
    ...EditEntity.commonProps,
    readOnly: Boolean
  },
  computed: {
    ...mapGetters(["verifiedEmail"]),
    editIdeaComponent() {
      return EditIdea;
    },
    editCategoryComponent() {
      return EditCategory;
    }
  }
};

export default EditIdea;
</script>

<style scoped lang="less">
@import "../../styles/essentials";

.readonly {
  .description {
    margin: 20px 0;
    font-size: 120%;
  }
}

table.project-row {
  border-collapse: collapse;
  width: 100%;

  &,
  tbody,
  tr,
  td {
    padding: 0;
  }

  .convert-to-project {
    width: 1px;
    white-space: nowrap;

    .button {
      margin-left: @button-distance;
    }
  }
}
</style>
