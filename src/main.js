import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
// noinspection ES6UnusedImports - import it just to register the directives
import {} from "./EntityHelper";

Vue.config.productionTip = false;

// noinspection JSUnusedGlobalSymbols
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
