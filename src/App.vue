<template>
  <div id="app">
    <div id="loader" v-if="loading">Loading...</div>
    <div v-if="ready">
      <div id="nav">
        <div id="auth">
          <EntitySelect
            tableName="user"
            allowEmpty
            emptyLabel="Anonymous"
            emptyPlaceholder="Anonymous"
            allowAdd
            addField="name"
            addLabel="Register"
            :addComponent="editUserComponent"
            :value="userId"
            @change="setUser"
          />
        </div>

        <router-link to="/idea">Ideas</router-link> |
        <router-link to="/category">Categories</router-link>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { SET_USER_ACTION } from "./store";
import EntitySelect from "./components/EntitySelect";
import EditUser from "./components/EditUser";

export default {
  name: "App",
  components: { EntitySelect },
  computed: {
    ...mapState(["loaders", "userId"]),
    ...mapGetters(["loading", "ready"]),
    editUserComponent() {
      return EditUser;
    }
  },
  methods: {
    ...mapActions({ setUser: SET_USER_ACTION })
  }
};
</script>

<style lang="less">
@import "assets/fontawesome/less/fontawesome";
@import "assets/fontawesome/less/regular";
@import "assets/fontawesome/less/solid";
@import "assets/fontawesome/less/brands";
@import "styles/essentials";

body,
input,
textarea,
select,
button {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: @font-size;
  line-height: @line-height;
}

#nav {
  padding: 30px;

  #auth {
    float: right;
    width: 200px;
  }

  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-active {
      color: #42b983;
    }
  }
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
