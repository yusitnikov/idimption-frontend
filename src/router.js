import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/idea"
    },
    {
      path: "/idea",
      name: "ideas",
      component: () => import(/* webpackChunkName: "Ideas" */ "./views/Ideas")
    },
    {
      path: "/idea/:id",
      name: "idea",
      component: () => import(/* webpackChunkName: "Idea" */ "./views/Idea")
    },
    {
      path: "/category",
      name: "categories",
      component: () =>
        import(/* webpackChunkName: "Categories" */ "./views/Categories")
    },
    {
      path: "/category/:id",
      name: "category",
      component: () =>
        import(/* webpackChunkName: "Category" */ "./views/Category")
    }
  ]
});
