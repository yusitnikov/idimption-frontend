<template>
  <div class="ideas">
    <div>
      <Button @click="add">Add new idea</Button>
    </div>
    <IdeaList />
  </div>
</template>

<script>
import IdeaList from "../components/IdeaList";
import Button from "../components/Button";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "Ideas",
  components: {
    IdeaList,
    Button
  },
  methods: {
    add() {
      this.$router.push("/idea/add");
    }
  }
};
</script>
