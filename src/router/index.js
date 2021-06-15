import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import game from "../views/Play.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/create",
    name: "Create",
    component: () => import("../views/Create.vue"),
  },
  {
    path: "/play",
    name: "Play",
    component: () => import("../views/Play.vue"),
  },
  // router
  {
    path: "/play/:password",
    component: game,
    props: (route) => ({ password: Number(route.params.password) }),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
