import Vue from "vue";
import VueRouter from "vue-router";
import ApiRequest from "@/api/base";
import VueCookie from "vue-cookie";
import HelloWorld from "./components/HelloWorld";
import Login from "./components/login";
import areaRouter from "./router/area";
import eventStatusRouter from "./router/event_status";
import userStatusRouter from "./router/user_status";
import billingManagementRouter from "./router/billing_management";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: HelloWorld },
  { path: "/login", component: Login },
  ...areaRouter,
  ...eventStatusRouter,
  ...userStatusRouter,
  ...billingManagementRouter,
];

const router = new VueRouter({
  routes,
  mode: "history",
});

/* eslint no-unused-vars: 0 */
// クッキーに認証情報がない・あるが正常なクッキー情報でない場合は、login画面へリダイレクト
router.beforeEach(async (to, _from, next) => {
  const result = await isLogin();
  if (result && to.path !== "/login") {
    next();
  } else if (result && to.path === "/login") {
    next({ path: "/" });
  } else if (!result && to.path === "/login") {
    next();
  } else {
    next({ path: "/login" });
    alert("認証に失敗しました。お手数ですがログインし直してください。");
  }
});

async function isLogin() {
  const cookie = VueCookie.get("Authorization");
  if (!cookie) {
    return false;
  }
  const request = new ApiRequest("users", VueCookie);
  const { error } = await request.index();
  if (!error) {
    return true;
  } else {
    return false;
  }
}

export default router;
