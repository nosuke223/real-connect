import tempPlaceIndex from "@/components/temp_places/index";
import tempPlaceshow from "@/components/temp_places/show";

export default [
  {
    path: "/temp_places/",
    component: tempPlaceIndex,
  },
  {
    path: "/temp_places/:id/",
    component: tempPlaceshow,
  },
];
