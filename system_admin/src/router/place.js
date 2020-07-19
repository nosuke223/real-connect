import placeIndex from "@/components/places/index";
import placeshow from "@/components/places/show";
import placeEdit from "@/components/places/edit";
import placeCreate from "@/components/places/create";

export default [
  {
    path: "/places/",
    component: placeIndex,
  },
  {
    path: "/places/create",
    component: placeCreate,
  },
  {
    path: "/places/:id/",
    component: placeshow,
  },
  {
    path: "/places/:id/edit/",
    component: placeEdit,
  },
];
