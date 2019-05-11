<template>
  <div class="idea-props-line">
    <Tag
      iconClass="folder-open"
      iconTitle="Project"
      v-if="row.isProject || row.projectId"
    >
      <template v-if="row.isProject">
        it's a project
      </template>
      <template v-else>
        <EntityById
          tableName="idea"
          :id="row.projectId"
          #default="{ displayText }"
        >
          <ButtonLink :href="'/idea/' + row.projectId">{{
            displayText
          }}</ButtonLink>
        </EntityById>
      </template>
    </Tag>

    <ProjectIdeas :row="row" v-if="row.isProject" />

    <Tag iconClass="tasks" iconTitle="Status" v-if="showStatus">
      <EntityById tableName="ideastatus" :id="row.statusId" />
    </Tag>

    <MultipleForeignEntityDisplay
      tableName="ideatag"
      :row="row"
      :fieldNames="['tagId']"
      iconClass="tag"
      iconTitle="Tag"
      v-if="row.getForeignRows('ideatag').length"
    />

    <MultipleForeignEntityDisplay
      tableName="ideacategory"
      :row="row"
      :fieldNames="['categoryId']"
      iconClass="sitemap"
      iconTitle="Category"
      v-slot="{ id, displayText }"
      v-if="row.getForeignRows('ideacategory').length"
    >
      <ButtonLink :href="'/category/' + id">{{ displayText }}</ButtonLink>
    </MultipleForeignEntityDisplay>

    <MultipleForeignEntityDisplay
      tableName="idearelation"
      :row="row"
      :fieldNames="['relationId', 'dstIdeaId']"
      iconClass="link"
      iconTitle="Relation"
      v-slot="{ tableName, id, displayText }"
      v-if="row.getForeignRows('idearelation').length"
    >
      <template v-if="tableName === 'idea'">
        <ButtonLink :href="'/idea/' + id">{{ displayText }}</ButtonLink>
      </template>
      <template v-else>
        {{ displayText }}
      </template>
    </MultipleForeignEntityDisplay>
  </div>
</template>

<script>
import Tag from "./displayHelpers/Tag";
import EntityById from "./displayHelpers/EntityById";
import MultipleForeignEntityDisplay from "./displayHelpers/MultipleForeignEntityDisplay";
import ButtonLink from "./ButtonLink";
import ProjectIdeas from "./stats/ProjectIdeas";

export default {
  name: "IdeaPropsLine",
  components: {
    ProjectIdeas,
    Tag,
    EntityById,
    MultipleForeignEntityDisplay,
    ButtonLink
  },
  props: {
    row: {
      type: Object,
      required: true
    },
    showStatus: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped lang="less">
.idea-props-line {
  margin: 10px 0;
}
</style>
