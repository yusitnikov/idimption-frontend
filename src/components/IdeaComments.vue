<template>
  <div class="idea-comments">
    <div class="line no-rows" v-if="!rows.length && !parentId">
      No comments.
    </div>

    <AddIdeaComment class="line" :ideaId="ideaId" v-if="!parentId" />

    <div v-for="row in rows" class="line" :key="row.id">
      <!-- TODO: remove, edit -->
      <!-- TODO: shortcut to reply -->
      <!-- TODO: collapse replies when too much -->
      <EntityById tableName="user" :id="row.userId" v-slot="{ avatarUrl }">
        <UserAvatarBlock :userId="row.userId" :avatarUrl="avatarUrl">
          <div class="header">
            <EntityFromAt :row="row" showUser />
            <div class="line multi-line">{{ row.message }}</div>

            <AddIdeaComment class="line" :ideaId="ideaId" :parentId="row.id" />
          </div>

          <IdeaComments class="replies" :ideaId="ideaId" :parentId="row.id" />
        </UserAvatarBlock>
      </EntityById>
    </div>
  </div>
</template>

<script>
import { getTableData } from "../storeProxy";
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
      type: String,
      required: true
    },
    parentId: {
      type: String,
      default: null
    }
  },
  computed: {
    rows() {
      const rows = getTableData("ideacomment").filter(
        row => row.ideaId === this.ideaId && row.parentId === this.parentId
      );
      rows.sort((a, b) => b.id - a.id);
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
