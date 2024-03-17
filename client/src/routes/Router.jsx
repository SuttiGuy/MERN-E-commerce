import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import ProductList from "../pages/shop/ProductList";
import Signup from "../components/Signup";
import UpdateProfile from "../pages/dashboard/UpdateProfile";
import PrivateRouter from "../pages/PrivateRouter/PrivateRouter";
import Signin from "../components/signin";
import Cart from "../pages/shop/Cart";
import Admin from "../admin/admin";

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
        element:<PrivateRouter>
          <ProductList />
          </PrivateRouter>
      },
      {
        path:"/cart",
        element:<PrivateRouter>
          <Cart />
          </PrivateRouter>
      },
      {
        path:"/update-profile",
        element:<UpdateProfile />
      },
    ],
  },
  {
    path:"/signup",
    element:<Signup />
  },
  {
    path:"/signin",
    element:<Signin />
  },
  {
    path:"/admin",
    element:<Admin />
  }
]);

export default router;
