import tempAreaIndex from "@/components/temp_areas/index";
import tempAreashow from "@/components/temp_areas/show";

export default [
  {
    path: "/temp_areas/",
    component: tempAreaIndex,
  },
  {
    path: "/temp_areas/:id/",
    component: tempAreashow,
  },
];
