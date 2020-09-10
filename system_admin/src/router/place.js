import placeIndex from "@/components/places/index";
import placeshow from "@/components/places/show";

export default [
  {
    path: "/places/",
    component: placeIndex,
  },
  {
    path: "/places/:id/",
    component: placeshow,
  },
];
