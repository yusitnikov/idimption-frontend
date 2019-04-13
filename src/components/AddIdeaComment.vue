<template>
  <div class="add-idea-comment line">
    <TextAreaInput
      placeholder="Start writing the comment..."
      v-model="text"
      allowEmpty
      ref="input"
      v-if="expanded"
    />
    <div class="line" v-if="expanded">
      to
      <EntityById
        tableName="user"
        :id="replyUserId"
        v-slot="{ displayText }"
        v-if="parentId"
      >
        {{ displayText || "Guest" }}
      </EntityById>
      <!--suppress RequiredAttributes value (handled by v-model)-->
      <MultipleEntitySelect
        class="mention-users-select"
        tableName="ideacommentmention"
        v-model="mentionUserIds"
        plainValue
        :selectTableNames="['user']"
        :filter="user => user.id !== replyUserId && user.id !== userId"
      />
    </div>
    <Button
      class="add-idea-comment-button"
      :disabled="expanded && text.trim() === ''"
      @click="submit"
    >
      {{ parentId ? "Reply" : "Add comment" }}
    </Button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { timeout } from "../misc";
import { recommendLogin } from "../storeProxy";
import EntityTransitionsList from "../EntityTransitionsList";
import { EntityRow } from "../EntityRow";
import Guid from "guid";
import TextAreaInput from "./TextAreaInput";
import EntityById from "./EntityById";
import MultipleEntitySelect from "./MultipleEntitySelect";
import Button from "./Button";
import GlobalEventsMixin from "../mixins/GlobalEventsMixin";

export default {
  name: "AddIdeaComment",
  components: {
    TextAreaInput,
    EntityById,
    MultipleEntitySelect,
    Button
  },
  mixins: [GlobalEventsMixin],
  props: {
    transitionsList: {
      type: EntityTransitionsList,
      required: true
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
  data: function() {
    return {
      expanded: false,
      text: "",
      mentionUserIds: []
    };
  },
  computed: {
    ...mapState(["userId"]),
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
    async submit() {
      if (!this.expanded) {
        this.expanded = true;
        await timeout();
        this.$refs.input.focus();
        return;
      }

      await recommendLogin();

      // Remove the current user from mentions after login
      this.mentionUserIds = this.mentionUserIds.filter(
        userId => userId !== this.userId
      );

      const comment = new EntityRow(
        "ideacomment",
        {
          ideaId: this.ideaId,
          parentId: this.parentId,
          message: this.text.trim()
        },
        true
      );
      this.transitionsList.addRow(comment);
      for (const userId of this.mentionUserIds) {
        this.transitionsList.addRow(
          new EntityRow(
            "ideacommentmention",
            {
              ideaCommentId: comment.id,
              userId
            },
            true
          )
        );
      }
      this.transitionsList.save();

      this.text = "";
      this.mentionUserIds = [];
      this.expanded = false;
    },
    onOuterClick() {
      if (!this.text && !this.mentionUserIds.length) {
        this.expanded = false;
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.add-idea-comment-input {
  .block-margin-bottom;
}

.mention-users-select {
  display: inline;
}
</style>
