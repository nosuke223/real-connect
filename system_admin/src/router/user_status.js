import userStatusIndex from "@/components/user_statuses/index";
import userStatusShow from "@/components/user_statuses/show";
import userStatusEdit from "@/components/user_statuses/edit";
import userStatusCreate from "@/components/user_statuses/create";

export default [
  {
    path: "/user_statuses/",
    component: userStatusIndex,
  },
  {
    path: "/user_statuses/create",
    component: userStatusCreate,
  },
  {
    path: "/user_statuses/:id/",
    component: userStatusShow,
  },
  {
    path: "/user_statuses/:id/edit/",
    component: userStatusEdit,
  },
];
