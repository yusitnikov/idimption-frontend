<template>
  <div class="idea-props-line">
    <Tag iconClass="tasks" iconTitle="Status">
      <EntityById tableName="ideastatus" :id="row.statusId" />
    </Tag>

    <MultipleEntityDisplay
      tableName="ideatag"
      parentFieldName="ideaId"
      :parentId="row.id"
      :fieldNames="['tagId']"
      iconClass="tag"
      iconTitle="Tag"
    />

    <MultipleEntityDisplay
      tableName="ideacategory"
      parentFieldName="ideaId"
      :parentId="row.id"
      :fieldNames="['categoryId']"
      iconClass="sitemap"
      iconTitle="Category"
    />

    <MultipleEntityDisplay
      tableName="idearelation"
      parentFieldName="ideaId"
      :parentId="row.id"
      :fieldNames="['relationId', 'dstIdeaId']"
      iconClass="link"
      iconTitle="Relation"
    />
  </div>
</template>

<script>
import Tag from "./Tag";
import EntityById from "./EntityById";
import MultipleEntityDisplay from "./MultipleEntityDisplay";

export default {
  name: "IdeaPropsLine",
  components: { Tag, EntityById, MultipleEntityDisplay },
  props: {
    row: {
      type: Object,
      required: true
    }
  }
};
</script>
