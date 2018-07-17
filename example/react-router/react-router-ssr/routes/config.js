import Home from "../pages/Home";
import About from "../pages/About";
import Contacts from "../pages/Contacts";
import NotFound from "../pages/NotFound";

export default [
  {
    path: "/",
    exact: true,
    component: Home
  },
  {
    path: "/about",
    component: About
  },
  {
    path: "/contacts",
    component: Contacts
  },
  {
    path: "",
    component: NotFound
  }
];
