<template>
  <div class="add-idea-comment">
    <TextAreaInput
      placeholder="Start writing the comment..."
      v-model="text"
      allowEmpty
      @blur="onBlur"
      ref="input"
      v-if="expanded"
    />
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
import { timeout } from "../misc";
import EntityTransitionsList from "../EntityTransitionsList";
import { EntityRow } from "../EntityRow";
import Guid from "guid";
import TextAreaInput from "./TextAreaInput";
import Button from "./Button";

export default {
  name: "AddIdeaComment",
  components: { TextAreaInput, Button },
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
      text: ""
    };
  },
  methods: {
    async submit() {
      if (!this.expanded) {
        this.expanded = true;
        await timeout();
        this.$refs.input.focus();
        return;
      }

      this.transitionsList
        .addRow(
          new EntityRow(
            "ideacomment",
            {
              ideaId: this.ideaId,
              parentId: this.parentId,
              message: this.text.trim()
            },
            true
          )
        )
        .save();
      this.text = "";
      this.expanded = false;
    },
    onBlur() {
      if (!this.text) {
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
</style>
