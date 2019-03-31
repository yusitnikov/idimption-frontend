<template>
  <div class="ideas">
    <div v-if="!userId || verifiedEmail">
      <Button @click="add">
        <Icon type="plus" />
        Add new idea
      </Button>
    </div>
    <IdeaPanel />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Icon from "../components/Icon";
import Button from "../components/Button";
import IdeaPanel from "../components/IdeaPanel";

export default {
  name: "Ideas",
  components: { Icon, Button, IdeaPanel },
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
