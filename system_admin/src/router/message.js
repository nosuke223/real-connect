import messageIndex from "@/components/messages/index";
import messageshow from "@/components/messages/show";
import messageEdit from "@/components/messages/edit";
import messageCreate from "@/components/messages/create";

export default [
  {
    path: "/messages/",
    component: messageIndex,
  },
  {
    path: "/messages/create",
    component: messageCreate,
  },
  {
    path: "/messages/:id/",
    component: messageshow,
  },
  {
    path: "/messages/:id/edit/",
    component: messageEdit,
  },
];
