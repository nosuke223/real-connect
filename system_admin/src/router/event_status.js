import eventStatusIndex from "@/components/event_statuses/index";
import eventStatusShow from "@/components/event_statuses/show";
import eventStatusEdit from "@/components/event_statuses/edit";
import eventStatusCreate from "@/components/event_statuses/create";

export default [
  {
    path: "/event_statuses/",
    component: eventStatusIndex,
  },
  {
    path: "/event_statuses/create",
    component: eventStatusCreate,
  },
  {
    path: "/event_statuses/:id/",
    component: eventStatusShow,
  },
  {
    path: "/event_statuses/:id/edit/",
    component: eventStatusEdit,
  },
];
