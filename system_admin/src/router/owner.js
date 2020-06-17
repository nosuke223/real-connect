import ownerIndex from "@/components/owners/index";
import ownershow from "@/components/owners/show";
import ownerEdit from "@/components/owners/edit";
import ownerCreate from "@/components/owners/create";

export default [
  {
    path: "/owners/",
    component: ownerIndex,
  },
  {
    path: "/owners/create",
    component: ownerCreate,
  },
  {
    path: "/owners/:id/",
    component: ownershow,
  },
  {
    path: "/owners/:id/edit/",
    component: ownerEdit,
  },
];
