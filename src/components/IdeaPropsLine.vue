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
      v-slot="{ id, displayText }"
    >
      <ButtonLink :href="'/category/' + id" align="none">{{
        displayText
      }}</ButtonLink>
    </MultipleForeignEntityDisplay>

    <MultipleForeignEntityDisplay
      tableName="idearelation"
      :row="row"
      :fieldNames="['relationId', 'dstIdeaId']"
      iconClass="link"
      iconTitle="Relation"
      v-slot="{ tableName, id, displayText }"
    >
      <template v-if="tableName === 'idea'">
        <ButtonLink :href="'/idea/' + id" align="none">{{
          displayText
        }}</ButtonLink>
      </template>
      <template v-else>
        {{ displayText }}
      </template>
    </MultipleForeignEntityDisplay>
  </div>
</template>

<script>
import Tag from "./Tag";
import EntityById from "./EntityById";
import MultipleForeignEntityDisplay from "./MultipleForeignEntityDisplay";
import ButtonLink from "./ButtonLink";

export default {
  name: "IdeaPropsLine",
  components: { Tag, EntityById, MultipleForeignEntityDisplay, ButtonLink },
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
