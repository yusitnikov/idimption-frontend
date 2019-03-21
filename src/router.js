import Vue from "vue";
import Router from "vue-router";
import Ideas from "./views/Ideas";
import Idea from "./views/Idea";
import Categories from "./views/Categories";
import Category from "./views/Category";

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
      component: Ideas
    },
    {
      path: "/idea/:id",
      name: "idea",
      component: Idea
    },
    {
      path: "/category",
      name: "categories",
      component: Categories
    },
    {
      path: "/category/:id",
      name: "category",
      component: Category
    }
  ]
});
