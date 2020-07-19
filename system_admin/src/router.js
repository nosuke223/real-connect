import Vue from "vue";
import VueRouter from "vue-router";
import ApiRequest from "@/api/base";
import VueCookie from "vue-cookie";
import HelloWorld from "./components/HelloWorld";
import Login from "./components/login";
import userRouter from "./router/user";
import ownerRouter from "./router/owner";
import eventRouter from "./router/event";
import messageRouter from "./router/message";
import placeRouter from "./router/place";
import areaRouter from "./router/area";
import eventStatusRouter from "./router/event_status";
import userStatusRouter from "./router/user_status";
import tempAreaRouter from "./router/temp_area";
import tempPlaceRouter from "./router/temp_place";
import systemBbsInfoRouter from "./router/system_bbs_info";
import systemBbsNewsRouter from "./router/system_bbs_news";
import billingManagementRouter from "./router/billing_management";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: HelloWorld },
  { path: "/login", component: Login },
  ...userRouter,
  ...ownerRouter,
  ...eventRouter,
  ...messageRouter,
  ...placeRouter,
  ...areaRouter,
  ...eventStatusRouter,
  ...userStatusRouter,
  ...tempAreaRouter,
  ...tempPlaceRouter,
  ...systemBbsInfoRouter,
  ...systemBbsNewsRouter,
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
