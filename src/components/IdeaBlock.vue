<template>
  <EntityBlock :row="row" showUser :readOnly="readOnly">
    <template slot="actions">
      <span class="comments-count" v-if="commentsCount">
        <Icon type="comment" iconTitle="Comments" />
        {{ commentsCount }}
      </span>

      <IdeaVote :ideaId="row.id" />
    </template>

    <template slot="additionalInfo">
      <IdeaPropsLine :row="row" :showStatus="showStatus" showComments />
    </template>

    <template #details="{ transitionsList }">
      <EditIdea
        :savedRow="row"
        :transitionsList="transitionsList"
        :readOnly="readOnly"
        :showHeader="false"
      />
    </template>
  </EntityBlock>
</template>

<script>
import { canUserEditUsersData } from "../auth";
import EntityBlock from "./EntityBlock";
import Icon from "./Icon";
import IdeaVote from "./IdeaVote";
import IdeaPropsLine from "./IdeaPropsLine";
import EditIdea from "./EditIdea";

export default {
  name: "IdeaBlock",
  components: { EntityBlock, Icon, IdeaVote, IdeaPropsLine, EditIdea },
  computed: {
    readOnly() {
      return !canUserEditUsersData(this.row.userId);
    },
    commentsCount() {
      return this.row.getForeignRows("ideacomment").length;
    }
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
@import "../styles/essentials";

.comments-count {
  margin-right: @button-distance;
}
</style>
