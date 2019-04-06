import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import Fragment from "vue-fragment";
import PortalVue from "portal-vue";
import SelectionMixin from "./mixins/SelectionMixin";

Vue.config.devtools = true;
Vue.config.productionTip = false;

Vue.use(Fragment.Plugin);
Vue.use(PortalVue);

Vue.mixin(SelectionMixin);

// noinspection JSUnusedGlobalSymbols
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
