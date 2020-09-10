import areaIndex from "@/components/areas/index";
import areaShow from "@/components/areas/show";
import areaEdit from "@/components/areas/edit";

export default [
  {
    path: "/areas/",
    component: areaIndex,
  },
  {
    path: "/areas/:id/",
    component: areaShow,
  },
  {
    path: "/areas/:id/edit/",
    component: areaEdit,
  },
];
