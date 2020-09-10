import userIndex from "@/components/users/index";
import userShow from "@/components/users/show";

export default [
  {
    path: "/users/",
    component: userIndex,
  },
  {
    path: "/users/:id/",
    component: userShow,
  },
];
