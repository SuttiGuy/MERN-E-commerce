import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import ProductList from "../pages/shop/ProductList";
import Signup from "../components/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children:[
      {
        path:"/",
        element:<Home />,
      },
      {
        path:"/shop",
        element:<ProductList />
      },
    ],
  },
  {
    path:"/signup",
    element:<Signup />
  }
]);

export default router;
