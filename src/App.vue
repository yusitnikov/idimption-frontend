<template>
  <div id="app">
    <div id="loader" v-if="loading">Loading...</div>
    <div v-if="ready">
      <div id="nav">
        <router-link to="/idea">Ideas</router-link> |
        <router-link to="/category">Categories</router-link>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState(["loaders"]),
    ...mapGetters(["loading", "ready"])
  }
};
</script>

<style lang="less">
@import "styles/essentials";

* {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: @font-size;
  line-height: @line-height;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-active {
      color: #42b983;
    }
  }
}

h2 {
  margin: 0;
  font-size: @button-full-height / @line-height;
}

h3 {
  margin-top: @block-margin;
  margin-bottom: 0;
  font-size: 19px;
}

.block {
  .basic-block(@block-padding);
  .block-margin;
}

.input {
  .basic-block(@input-padding);

  outline: none;
}

.single-line {
  white-space: nowrap;
}

.multi-line {
  white-space: pre-wrap;
}
</style>
