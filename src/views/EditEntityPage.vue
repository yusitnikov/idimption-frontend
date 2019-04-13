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
        <Button @click="remove" v-if="allowRemove && !isCreating">
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
import { showNotification } from "../storeProxy";
import { getUserId, isUserVerified, canUserEditUsersData } from "../auth";
import { validateAllInputs } from "../misc";
import Button from "../components/Button";
import ButtonLink from "../components/ButtonLink";
import Icon from "../components/Icon";
import EntityTransitionsList from "../EntityTransitionsList";
import { getOrCreateRowById, resolveGuid } from "../EntityHelper";
import Guid from "guid";

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
      id: this.forcedId,
      transitionsList: new EntityTransitionsList()
    };
  },
  created() {
    if (this.forcedId) {
      return;
    }

    // noinspection JSUnresolvedVariable
    this.id = this.$route.params.id;
    if (this.id === "add") {
      this.id = Guid.create();
      if (this.readOnly) {
        showNotification("Access denied.", "error");
        this.$router.push("/" + this.tableName);
        return;
      }
      this.transitionsList.addRow(this.row);
    }
  },
  computed: {
    isCreating() {
      return Guid.isGuid(this.id);
    },
    readOnly() {
      if (!this.allowAnonymous && !getUserId()) {
        return true;
      }
      if (getUserId() && !isUserVerified()) {
        return true;
      }
      if (!this.isCreating) {
        if (!isUserVerified()) {
          return true;
        }
        if ("userId" in this.row && !canUserEditUsersData(this.row.userId)) {
          return true;
        }
      }
      return false;
    },
    row() {
      return getOrCreateRowById(this.tableName, this.id);
    }
  },
  methods: {
    async save() {
      if (!validateAllInputs(this)) {
        return;
      }
      await this.transitionsList.save();
      await this.$nextTick();
      this.id = resolveGuid(this.id);
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
