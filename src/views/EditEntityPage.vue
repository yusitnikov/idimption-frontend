<template>
  <div class="edit-entity-page">
    <div v-if="showBack">
      <router-link :to="'/' + tableName">&lt; Back</router-link>
    </div>
    <template v-if="row">
      <slot
        :row="row"
        :transitionsList="transitionsList"
        :readOnly="readOnly"
      />
      <div class="footer" v-if="!readOnly">
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
import { getUserId, isUserVerified } from "../auth";
import { validateAllInputs } from "../misc";
import Button from "../components/Button";
import EntityTransitionsList from "../EntityTransitionsList";
import {
  getTableFieldInfo,
  getRowById,
  resolveGuid,
  deleteRow
} from "../EntityHelper";
import Guid from "guid";

export default {
  name: "EditEntityPage",
  components: { Button },
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
      this.transitionsList.addRow(this.tableName, this.row);
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
        const hasUserField = getTableFieldInfo(this.tableName, "userId");
        if (hasUserField && this.row.userId !== getUserId()) {
          return true;
        }
      }
      return false;
    },
    row() {
      return getRowById(this.tableName, this.id, true);
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
      deleteRow(this.tableName, this.row);
      this.$router.push("/" + this.tableName);
    }
  }
};
</script>
