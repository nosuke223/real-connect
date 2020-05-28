import Vue from "vue";
import Router from "vue-router";

import index from "../components/system_admin/index.vue";
import eventStatusIndex from "../components/system_admin/event_statuses/index.vue";
import eventStatusCreate from "../components/system_admin/event_statuses/create.vue";
import eventStatusEdit from "../components/system_admin/event_statuses/edit.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/system_admin",
      component: index,
    },
    {
      path: "/system_admin/event_statuses",
      component: eventStatusIndex,
      props: true,
    },
    {
      path: "/system_admin/event_statuses/create",
      component: eventStatusCreate,
    },
    {
      path: "/system_admin/event_statuses/edit/:id",
      component: eventStatusEdit,
    },
  ],
});
