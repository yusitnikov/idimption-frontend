<template>
  <div class="idea-comments">
    <div v-for="row in rows" class="comment" :key="row.id">
      <!-- TODO: userId, createdAt, updatedAt -->
      <!-- TODO: remove, edit -->
      <!-- TODO: shortcut to reply -->
      <!-- TODO: collapse replies when too much -->
      {{ row.message }}
      <div class="replies">
        <IdeaComments :ideaId="ideaId" :parentId="row.id" />
      </div>
    </div>
    <div class="comment" v-if="!rows.length && !parentId">No comments.</div>
    <TextAreaInput
      class="comment"
      placeholder="Start writing the comment..."
      v-model="addCommentText"
    />
    <Button :disabled="addCommentText.trim() === ''" @click="addComment">
      {{ parentId ? "Reply" : "Add comment" }}
    </Button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { ADD_ROW_ACTION } from "../store";
import TextAreaInput from "./TextAreaInput";
import Button from "./Button";

export default {
  name: "IdeaComments",
  components: { TextAreaInput, Button },
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
  data: function() {
    return {
      addCommentText: ""
    };
  },
  computed: {
    ...mapState(["data"]),
    rows() {
      // noinspection JSUnresolvedVariable
      return this.data.ideacomment.filter(
        row => row.ideaId === this.ideaId && row.parentId === this.parentId
      );
    }
  },
  methods: {
    ...mapActions([ADD_ROW_ACTION]),
    addComment() {
      this[ADD_ROW_ACTION]({
        tableName: "ideacomment",
        row: {
          ideaId: this.ideaId,
          parentId: this.parentId,
          message: this.addCommentText.trim()
        }
      });
      this.addCommentText = "";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../styles/essentials";

.replies {
  padding-left: 100px;
}

.comment {
  margin-bottom: @block-margin;
}
</style>
