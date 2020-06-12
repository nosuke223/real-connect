import areaIndex from "@/components/areas/index";
import areaShow from "@/components/areas/show";
import areaEdit from "@/components/areas/edit";
import areaCreate from "@/components/areas/create";

export default [
  {
    path: "/areas/",
    component: areaIndex,
  },
  {
    path: "/areas/create",
    component: areaCreate,
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
