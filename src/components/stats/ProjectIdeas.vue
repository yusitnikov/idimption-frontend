<template>
  <ButtonLink
    class="project-ideas"
    :href="'/idea?project=' + row.id"
    @click.stop
  >
    <Icon type="lightbulb" title="Ideas" />
    <span>{{ ideaCount }}</span>
  </ButtonLink>
</template>

<script>
import { EntityRow } from "../../EntityRow";
import ButtonLink from "../ButtonLink";
import Icon from "../displayHelpers/Icon";

export default {
  name: "ProjectIdeas",
  components: { ButtonLink, Icon },
  props: {
    row: {
      type: EntityRow,
      required: true
    }
  },
  computed: {
    ideaCount() {
      return this.row.getForeignRows("idea").length;
    }
  }
};
</script>
