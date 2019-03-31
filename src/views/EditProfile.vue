<template>
  <div class="edit-profile">
    <h1>User profile</h1>

    <EditEntityPage
      class="next-section-start"
      tableName="user"
      :forcedId="userId"
      :showBack="false"
      :allowRemove="false"
      v-slot="{ row, transitionsList }"
    >
      <EditUser :savedRow="row" :transitionsList="transitionsList" />
    </EditEntityPage>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EditEntityPage from "./EditEntityPage";
import EditUser from "../components/EditUser";

export default {
  name: "EditProfile",
  components: { EditEntityPage, EditUser },
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
