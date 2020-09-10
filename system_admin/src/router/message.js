import messageIndex from "@/components/messages/index";
import messageshow from "@/components/messages/show";

export default [
  {
    path: "/messages/",
    component: messageIndex,
  },
  {
    path: "/messages/:id/",
    component: messageshow,
  },
];
