import systemBbsInfoIndex from "@/components/system_bbs_infos/index";
import systemBbsInfoShow from "@/components/system_bbs_infos/show";
import systemBbsInfoEdit from "@/components/system_bbs_infos/edit";
import systemBbsInfoCreate from "@/components/system_bbs_infos/create";

export default [
  {
    path: "/system_bbs_infos/",
    component: systemBbsInfoIndex,
  },
  {
    path: "/system_bbs_infos/create",
    component: systemBbsInfoCreate,
  },
  {
    path: "/system_bbs_infos/:id/",
    component: systemBbsInfoShow,
  },
  {
    path: "/system_bbs_infos/:id/edit/",
    component: systemBbsInfoEdit,
  },
];
