<template>
  <div class="ideas">
    <div v-if="!userId || verifiedEmail">
      <Button @click="add">
        <Icon type="plus" />
        Add new idea
      </Button>
    </div>
    <IdeaList />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Icon from "../components/Icon";
import Button from "../components/Button";
import IdeaList from "../components/IdeaList";

export default {
  name: "Ideas",
  components: { Icon, Button, IdeaList },
  computed: {
    ...mapState(["userId"]),
    ...mapGetters(["verifiedEmail"])
  },
  methods: {
    add() {
      this.$router.push("/idea/add");
    }
  }
};
</script>
