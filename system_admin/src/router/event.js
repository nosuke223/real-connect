import eventIndex from "@/components/events/index";
import eventshow from "@/components/events/show";
import eventEdit from "@/components/events/edit";
import eventCreate from "@/components/events/create";

export default [
  {
    path: "/events/",
    component: eventIndex,
  },
  {
    path: "/events/create",
    component: eventCreate,
  },
  {
    path: "/events/:id/",
    component: eventshow,
  },
  {
    path: "/events/:id/edit/",
    component: eventEdit,
  },
];
