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
import User from "../pages/dashboard/admin/User";
import Dashboard from "../pages/dashboard/admin/Dashboard";

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
    path:"/dashboard",
    element: <PrivateRouter> <Admin /></PrivateRouter>,
    children:[
      {path:"users",element:<User />},
      {path:"",element:<Dashboard/>}
    ]
  },
  {
    path:"/signup",
    element:<Signup />
  },
  {
    path:"/signin",
    element:<Signin />
  },
]);

export default router;
