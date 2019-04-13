<template>
  <div class="idea-comments">
    <div class="line no-rows" v-if="!rows.length && !parentId">
      No comments.
    </div>

    <AddIdeaComment
      class="line"
      :transitionsList="transitionsList"
      :ideaId="ideaId"
      v-if="!parentId"
    />

    <div v-for="row in rows" class="line" :key="row.id.toString()">
      <!-- TODO: remove, edit -->
      <!-- TODO: shortcut to reply -->
      <!-- TODO: collapse replies when too much -->
      <EntityById tableName="user" :id="row.userId" v-slot="{ avatarUrl }">
        <UserAvatarBlock :userId="row.userId" :avatarUrl="avatarUrl">
          <div class="header">
            <EntityFromAt :row="row" showUser>
              <template slot="user" v-if="getReplyToLabel(row)">
                to {{ getReplyToLabel(row) }}
              </template>
            </EntityFromAt>
            <!-- eslint-disable-next-line -->
            <div class="line multi-line"><AutoLink :text="row.message" /></div>

            <AddIdeaComment
              class="line"
              :transitionsList="transitionsList"
              :ideaId="ideaId"
              :parentId="row.id"
            />
          </div>

          <IdeaComments
            class="replies"
            :transitionsList="transitionsList"
            :ideaId="ideaId"
            :parentId="row.id"
          />
        </UserAvatarBlock>
      </EntityById>
    </div>
  </div>
</template>

<script>
import EntityTransitionsList from "../EntityTransitionsList";
import { getRowById } from "../EntityHelper";
import Guid from "guid";
import EntityFromAt from "./EntityFromAt";
import EntityById from "./EntityById";
import UserAvatarBlock from "./UserAvatarBlock";
import AddIdeaComment from "./AddIdeaComment";
import AutoLink from "./AutoLink";

export default {
  name: "IdeaComments",
  components: {
    AddIdeaComment,
    UserAvatarBlock,
    EntityById,
    EntityFromAt,
    AutoLink
  },
  props: {
    transitionsList: {
      type: EntityTransitionsList,
      default: () => new EntityTransitionsList()
    },
    ideaId: {
      type: [String, Guid],
      required: true
    },
    parentId: {
      type: [String, Guid],
      default: null
    }
  },
  computed: {
    rows() {
      return this.transitionsList
        .getTableData("ideacomment")
        .reverse()
        .getRowsByFieldValue("ideaId", this.ideaId)
        .getRowsByFieldValue("parentId", this.parentId).rows;
    },
    parentComment() {
      return this.parentId
        ? this.transitionsList
            .getTableData("ideacomment")
            .getRowById(this.parentId)
        : null;
    },
    replyUserId() {
      return this.parentId ? this.parentComment.userId : null;
    }
  },
  methods: {
    getReplyToLabel(row) {
      let userIds = [];
      if (this.parentId) {
        userIds.push(this.parentComment.userId);
      }
      userIds.push(
        ...row.getForeignIds(
          "ideacommentmention",
          "userId",
          this.transitionsList
        )
      );
      return userIds
        .map(userId =>
          userId ? getRowById("user", userId).displayText : "Guest"
        )
        .join(", ");
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.no-rows {
  padding-top: @form-label-padding;
}

.header {
  min-height: @avatar-size;
}

.replies {
  border-left: 1px solid @block-border-color;
  padding-left: @button-distance;
}
</style>
