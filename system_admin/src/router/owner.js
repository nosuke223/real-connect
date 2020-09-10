import ownerIndex from "@/components/owners/index";
import ownershow from "@/components/owners/show";

export default [
  {
    path: "/owners/",
    component: ownerIndex,
  },
  {
    path: "/owners/:id/",
    component: ownershow,
  },
];
