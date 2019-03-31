import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import Fragment from "vue-fragment";
import PortalVue from "portal-vue";

Vue.config.devtools = true;
Vue.config.productionTip = false;

Vue.use(Fragment.Plugin);
Vue.use(PortalVue);

// noinspection JSUnusedGlobalSymbols
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
