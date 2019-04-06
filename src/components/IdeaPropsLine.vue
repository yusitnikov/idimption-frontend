<template>
  <div class="idea-props-line">
    <Tag iconClass="tasks" iconTitle="Status" v-if="showStatus">
      <EntityById tableName="ideastatus" :id="row.statusId" />
    </Tag>

    <MultipleForeignEntityDisplay
      tableName="ideatag"
      :row="row"
      :fieldNames="['tagId']"
      iconClass="tag"
      iconTitle="Tag"
    />

    <MultipleForeignEntityDisplay
      tableName="ideacategory"
      :row="row"
      :fieldNames="['categoryId']"
      iconClass="sitemap"
      iconTitle="Category"
    />

    <MultipleForeignEntityDisplay
      tableName="idearelation"
      :row="row"
      :fieldNames="['relationId', 'dstIdeaId']"
      iconClass="link"
      iconTitle="Relation"
    />
  </div>
</template>

<script>
import Tag from "./Tag";
import EntityById from "./EntityById";
import MultipleForeignEntityDisplay from "./MultipleForeignEntityDisplay";

export default {
  name: "IdeaPropsLine",
  components: { Tag, EntityById, MultipleForeignEntityDisplay },
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
