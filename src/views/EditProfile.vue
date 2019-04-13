<template>
  <div class="edit-profile">
    <EditEntityPage
      tableName="user"
      :forcedId="userId"
      :showBack="false"
      :allowRemove="false"
      v-slot="{ row, transitionsList }"
    >
      <h1>User profile</h1>

      <EditUser :savedRow="row" :transitionsList="transitionsList" />

      <template v-if="!row.isNew">
        <h2>Subscriptions</h2>

        <EditSubscriptions
          :savedRow="row"
          :transitionsList="transitionsList"
          :focusFirstInput="false"
        />
      </template>
    </EditEntityPage>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EditEntityPage from "./EditEntityPage";
import EditUser from "../components/EditUser";
import EditSubscriptions from "../components/EditSubscriptions";

export default {
  name: "EditProfile",
  components: { EditEntityPage, EditUser, EditSubscriptions },
  created() {
    this.checkAuth();
  },
  computed: {
    ...mapState(["userId"])
  },
  watch: {
    userId() {
      this.checkAuth();
    }
  },
  methods: {
    checkAuth() {
      if (!this.userId) {
        this.$router.push("/");
      }
    }
  }
};
</script>
