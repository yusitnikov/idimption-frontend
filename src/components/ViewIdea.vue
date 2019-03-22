<template>
  <ViewEntity tableName="idea" :row="row" showUser>
    <MultipleEntityDisplay
      tableName="ideatag"
      parentFieldName="ideaId"
      :parentId="row.id"
      :fieldNames="['tagId']"
    >
      <template slot="before">
        <i class="fas fa-tag" title="Tag"></i>
      </template>
    </MultipleEntityDisplay>
    <MultipleEntityDisplay
      tableName="ideacategory"
      parentFieldName="ideaId"
      :parentId="row.id"
      :fieldNames="['categoryId']"
    >
      <template slot="before">
        <i class="fas fa-sitemap" title="Category"></i>
      </template>
    </MultipleEntityDisplay>
    <MultipleEntityDisplay
      tableName="idearelation"
      parentFieldName="ideaId"
      :parentId="row.id"
      :fieldNames="['relationId', 'dstIdeaId']"
    >
      <template slot="before">
        <i class="fas fa-link" title="Relation"></i>
      </template>
    </MultipleEntityDisplay>
  </ViewEntity>
</template>

<script>
import ViewEntity from "./ViewEntity";
import MultipleEntityDisplay from "./MultipleEntityDisplay";

export default {
  name: "ViewIdea",
  components: { MultipleEntityDisplay, ViewEntity },
  props: {
    row: {
      type: Object,
      required: true
    }
  }
};
</script>
