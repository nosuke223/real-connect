import userIndex from "@/components/users/index";
import userShow from "@/components/users/show";
import userEdit from "@/components/users/edit";
import userCreate from "@/components/users/create";

export default [
  {
    path: "/users/",
    component: userIndex,
  },
  {
    path: "/users/create",
    component: userCreate,
  },
  {
    path: "/users/:id/",
    component: userShow,
  },
  {
    path: "/users/:id/edit/",
    component: userEdit,
  },
];
