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
import { addRow } from "../EntityHelper";
import TextAreaInput from "./TextAreaInput";
import Button from "./Button";

export default {
  name: "AddIdeaComment",
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

      await addRow("ideacomment", {
        ideaId: this.ideaId,
        parentId: this.parentId,
        message: this.text.trim()
      });
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
