import React from "react";
import { Link } from "react-router-dom";
import { FaBorderAll, FaCartShopping } from "react-icons/fa6";
import { IoBagHandleSharp } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { HiTemplate } from "react-icons/hi";
import { FaUserEdit, FaHome } from "react-icons/fa";
import { BiNavigation } from "react-icons/bi";
import { MdContactSupport } from "react-icons/md";
import { Outlet } from "react-router-dom";
import useAdmin from "../hook/useAdmin";

const Dialog = () => {
  const [isAdmin, isAdminLoading] = useAdmin();
  // const isAdmin = true
  return (
    <div>
      {isAdmin ? (
        <div className="flex">
            <div className="drawer lg:drawer-open">
              <input
                id="my-drawer-2"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="drawer-content flex flex-col items-center justify-center">
                {/* Page content here */}
                <div>
                  <label
                    htmlFor="my-drawer-2"
                    className="btn btn-primary drawer-button lg:hidden"
                  >
                    <FaBorderAll />
                  </label>
                  <button className="btn btn-error sm:hidden  flex  items-center gap-2">
                    <FaUserEdit /> Logout
                  </button>
                </div>
                <div className="mt-5 md:mt-2 mx-4">
                  <Outlet />
                </div>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="my-drawer-2"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                  <div className="flex flex-row items-center ">
                    <img src="/logo.png" alt="" className="h-20 mx-0" />
                    <Link to="/dashboard" className="flex justify-start mb-3">
                      <button className="btn btn-sm bg-blue-600 text-white rounded-full">
                        Admin
                      </button>
                    </Link>
                  </div>
                  {/* Sidebar content here */}
                  <hr className="h-px my-4 bg-gray-400 border-0 dark:bg-gray-300"></hr>
                  <li className="border-0">
                    <Link to="/dashboard">
                      <FaBorderAll />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <a>
                      <IoBagHandleSharp />
                      Manage Orders
                    </a>
                  </li>
                  <li>
                    <a>
                      <IoMdAddCircle />
                      Add Product
                    </a>
                  </li>
                  <li>
                    <a>
                      <HiTemplate />
                      Manage Item
                    </a>
                  </li>
                  <li className="border-0">
                    <Link to="/dashboard/users">
                      <FaUserEdit />
                      All users
                    </Link>
                  </li>
                  <hr className="h-px my-4 bg-gray-400 border-0 dark:bg-gray-300"></hr>
                  <li>
                    <Link to="/">
                      <FaHome />
                      Home
                    </Link>
                  </li>
                  <li>
                    <a>
                      <FaCartShopping />
                      Product
                    </a>
                  </li>
                  <li>
                    <a>
                      <BiNavigation />
                      Order Tracking
                    </a>
                  </li>
                  <li>
                    <a>
                      <MdContactSupport />
                      Customer Support
                    </a>
                  </li>
                </ul>
              </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <Link
            to="/"
            className="btn btn-sx btn-error sm:btn-sm md:btn-md lg:btn-lg"
          >
            You are not an admin !_! Back to Home or Use Account Admin
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dialog;
