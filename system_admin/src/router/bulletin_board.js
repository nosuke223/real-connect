import bulletinBoard from "@/components/bulletin_board/index";
import bulletinBoardShow from "@/components/bulletin_board/show";

export default [
  {
    path: "/bulletin_board/",
    component: bulletinBoard,
  },
  {
    path: "/bulletin_board/:id/",
    component: bulletinBoardShow,
  },
];
