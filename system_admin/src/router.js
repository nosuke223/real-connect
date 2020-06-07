import Vue from "vue";
import VueRouter from "vue-router";
import HelloWorld from "./components/HelloWorld";
import Login from "./components/login";
import eventStatusRouter from "./router/event_status";
import userStatusRouter from "./router/user_status";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: HelloWorld },
  { path: "/login", component: Login },
  ...eventStatusRouter,
  ...userStatusRouter,
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;
