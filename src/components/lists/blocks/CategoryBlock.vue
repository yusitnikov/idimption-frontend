<template>
  <EntityBlock
    :row="row"
    :readOnly="readOnly"
    :expandable="!readOnly"
    :transitionsList="transitionsList"
  >
    <template slot="details">
      <EditCategory
        :savedRow="row"
        :transitionsList="transitionsList"
        :readOnly="readOnly"
        :showHeader="false"
      />
    </template>
  </EntityBlock>
</template>

<script>
import { mapGetters } from "vuex";
import EntityTransitionsList from "../../../EntityTransitionsList";
import EntityBlock from "./EntityBlock";
import EditCategory from "../../forms/EditCategory";

export default {
  name: "CategoryBlock",
  components: { EntityBlock, EditCategory },
  computed: {
    ...mapGetters(["verifiedEmail"]),
    readOnly() {
      return !this.verifiedEmail;
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
    }
  }
};
</script>
