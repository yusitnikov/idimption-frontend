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
            <EntityFromAt :row="row" showUser />
            <div class="line multi-line">{{ row.message }}</div>

            <AddIdeaComment
              class="line"
              :transitionsList="transitionsList"
              :ideaId="ideaId"
              :parentId="row.id"
            />
          </div>

          <IdeaComments class="replies" :ideaId="ideaId" :parentId="row.id" />
        </UserAvatarBlock>
      </EntityById>
    </div>
  </div>
</template>

<script>
import EntityTransitionsList from "../EntityTransitionsList";
import Guid from "guid";
import EntityFromAt from "./EntityFromAt";
import EntityById from "./EntityById";
import UserAvatarBlock from "./UserAvatarBlock";
import AddIdeaComment from "./AddIdeaComment";

export default {
  name: "IdeaComments",
  components: {
    AddIdeaComment,
    UserAvatarBlock,
    EntityById,
    EntityFromAt
  },
  props: {
    ideaId: {
      type: [String, Guid],
      required: true
    },
    parentId: {
      type: [String, Guid],
      default: null
    }
  },
  data() {
    return {
      transitionsList: new EntityTransitionsList()
    };
  },
  computed: {
    rows() {
      // noinspection JSUnresolvedVariable
      const rows = this.transitionsList
        .applyToState()
        .ideacomment.filter(
          row => row.ideaId === this.ideaId && row.parentId === this.parentId
        );
      rows.reverse();
      return rows;
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
