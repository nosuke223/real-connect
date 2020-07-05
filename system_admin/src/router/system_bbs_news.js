import systemBbsNewsIndex from "@/components/system_bbs_news/index";
import systemBbsNewsShow from "@/components/system_bbs_news/show";
import systemBbsNewsEdit from "@/components/system_bbs_news/edit";
import systemBbsNewsCreate from "@/components/system_bbs_news/create";

export default [
  {
    path: "/system_bbs_news/",
    component: systemBbsNewsIndex,
  },
  {
    path: "/system_bbs_news/create",
    component: systemBbsNewsCreate,
  },
  {
    path: "/system_bbs_news/:id/",
    component: systemBbsNewsShow,
  },
  {
    path: "/system_bbs_news/:id/edit/",
    component: systemBbsNewsEdit,
  },
];
