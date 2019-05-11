<template>
  <div class="edit-entity-page">
    <div class="back-button" v-if="showBack">
      <ButtonLink :href="'/' + tableName">
        <Icon type="chevron-left" />
        <span>Back</span>
      </ButtonLink>
    </div>
    <template v-if="row">
      <slot
        :row="row"
        :transitionsList="transitionsList"
        :readOnly="readOnly"
      />
      <div class="footer next-section-start" v-if="!readOnly">
        <Button @click="save">Save</Button>
        <Button @click="remove" v-if="allowRemove">
          Remove
        </Button>
      </div>
    </template>
    <template v-else>
      <div>Row not found</div>
    </template>
  </div>
</template>

<script>
import { getUserId, isUserVerified, canUserEditUsersData } from "../auth";
import { validateAllInputs } from "../misc";
import Button from "../components/Button";
import ButtonLink from "../components/ButtonLink";
import Icon from "../components/displayHelpers/Icon";
import EntityTransitionsList from "../EntityTransitionsList";
import { getRowById } from "../EntityHelper";

export default {
  name: "EditEntityPage",
  components: { Button, ButtonLink, Icon },
  props: {
    tableName: {
      type: String,
      required: true
    },
    allowAnonymous: Boolean,
    allowRemove: {
      type: Boolean,
      default: true
    },
    forcedId: [Number, String],
    showBack: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      transitionsList: new EntityTransitionsList()
    };
  },
  computed: {
    readOnly() {
      if (!this.allowAnonymous && !getUserId()) {
        return true;
      }
      if (!isUserVerified()) {
        return true;
      }
      // noinspection RedundantIfStatementJS
      if ("userId" in this.row && !canUserEditUsersData(this.row.userId)) {
        return true;
      }
      return false;
    },
    id() {
      // noinspection JSUnresolvedVariable
      return this.forcedId || this.$route.params.id;
    },
    row() {
      return getRowById(this.tableName, this.id);
    }
  },
  methods: {
    save() {
      if (validateAllInputs(this)) {
        this.transitionsList.save();
      }
    },
    remove() {
      if (!confirm("Are you sure?")) {
        return;
      }
      this.row.deleteNow();
      this.$router.push("/" + this.tableName);
    }
  }
};
</script>

<style scoped lang="less">
.back-button {
  margin-bottom: 15px;
}
</style>
