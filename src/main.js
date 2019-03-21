import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import Fragment from "vue-fragment";
// noinspection ES6UnusedImports - import it just to register the directives
import {} from "./EntityHelper";

Vue.config.productionTip = false;

Vue.use(Fragment.Plugin);

// noinspection JSUnusedGlobalSymbols
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
