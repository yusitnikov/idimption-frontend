<template>
  <EntityBlock
    class="idea-block"
    :row="row"
    showUser
    :readOnly="readOnly"
    :transitionsList="transitionsList"
  >
    <template slot="actions">
      <span
        class="comments-count inline-item"
        :title="commentUsers.join('\n')"
        v-if="comments.length"
      >
        <Icon type="comment" iconTitle="Comments" />
        {{ comments.length }}
      </span>

      <EntityVote :row="row" />
    </template>

    <template slot="additionalInfo">
      <IdeaPropsLine :row="row" :showStatus="showStatus" showComments />
    </template>

    <template #details="{ popupTransitionsList }">
      <EditIdea
        :savedRow="row"
        :transitionsList="popupTransitionsList"
        :readOnly="readOnly"
        :showHeader="false"
      />
    </template>
  </EntityBlock>
</template>

<script>
import { canUserEditUsersData } from "../../../auth";
import EntityTransitionsList from "../../../EntityTransitionsList";
import { getRowById } from "../../../EntityHelper";
import EntityBlock from "./EntityBlock";
import Icon from "../../displayHelpers/Icon";
import EntityVote from "../../stats/EntityVote";
import IdeaPropsLine from "../../IdeaPropsLine";
import EditIdea from "../../forms/EditIdea";

export default {
  name: "IdeaBlock",
  components: { EntityBlock, Icon, EntityVote, IdeaPropsLine, EditIdea },
  computed: {
    readOnly() {
      return !canUserEditUsersData(this.row.userId);
    },
    comments() {
      return this.row.getForeignRows("ideacomment");
    },
    commentUsers() {
      return [
        ...new Set(
          this.comments.map(({ userId }) =>
            userId ? getRowById("user", userId).displayText : "Guest"
          )
        )
      ];
    }
  },
  props: {
    row: {
      type: Object,
      required: true
    },
    transitionsList: {
      type: EntityTransitionsList,
      required: true
    },
    showStatus: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="less">
@import "../../../styles/essentials";

.idea-block {
  .actions {
    // .line
    margin-bottom: @paragraph-margin;
  }

  .summary-text {
    display: block;
    clear: both;
  }
}
</style>
