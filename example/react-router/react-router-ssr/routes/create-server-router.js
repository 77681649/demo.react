import { StaticRouter } from "react-router";
import createRouter from "./create-router";

export default function createClientRouter() {
  return createRouter(StaticRouter);
}
