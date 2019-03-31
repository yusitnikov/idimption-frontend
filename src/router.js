import Vue from "vue";
import Router from "vue-router";
import Ideas from "./views/Ideas";
import Idea from "./views/Idea";
import Categories from "./views/Categories";
import Category from "./views/Category";
import AuthByCode from "./views/AuthByCode";
import EditProfile from "./views/EditProfile";

Vue.use(Router);

const routes = [
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
  },
  {
    path: "/auth/verify/:code/:resetPassword",
    name: "authVerify",
    component: AuthByCode,
    allowAnonymous: true
  },
  {
    path: "/profile",
    name: "editProfile",
    component: EditProfile
  }
];

let routesByName = {};
for (const route of routes) {
  routesByName[route.name] = route;
}

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
export default router;

export function getCurrentRoute() {
  return routesByName[router.currentRoute.name];
}
