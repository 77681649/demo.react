import { BrowserRouter } from "react-router-dom";
import createRouter from "./create-router";

export default function createClientRouter() {
  return createRouter(BrowserRouter);
}
