import React, { useContext } from "react";
import { Link,useLocation,useNavigate } from "react-router-dom";
import { SiGmail } from "react-icons/si";
import { FaFacebookF,FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAuth from "../hook/useAuth";
import useAxiosPublic from "../hook/useAxiosPublic";
import Swal from "sweetalert2";

const Modal = ({ name }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const{signUpWithGoogle,login} = useAuth();
  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location?.state?.pathname || "/";

  const onSubmit = (data) => {
    login(data.email, data.password)
      .then((result) => {
        // Signed in
        const user = result.user;
        // console.log(user);
        Swal.fire({
          title: "Account login Successfully",
          icon: "success",
          timer: 1500,
        });
        document.getElementById("login").close();
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const googleSignUp = () => {
    signUpWithGoogle()
      .then((result) => {
        const user = result.user;
            const userInfo = {
                name: result.user?.displayName,
                email: result.user?.email,
                photoURL: result.user?.photoURL,
            }
            axiosPublic.post("/users" , userInfo).then((response)=> {
                console.log(response);
                console.log(user);
                Swal.fire({
                    title:"SignUp google account successfully",
                    icon:"success",
                    timer:1500
                })
                navigate(from, { replace: true })
            })
        
        document.getElementById("login").close();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <dialog id={name} className="modal">
      <div className="modal-box">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Please Login!</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className="input input-bordered"
              required
              {...register("email")}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="password"
              className="input input-bordered"
              required
              {...register("password")}
            />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">
                Forgot password?
              </a>
            </label>
          </div>
          <div className="form-control mt-6">
            <input
              type="submit"
              value="Login"
              className="btn bg-red-700 text-white"
            />
          </div>
          <p className="text-center my-2 ">
            Don't have an account ?{" "}
            <Link to="/signup" className="underline text-red-700 ml-1">
              Sign Up Now
            </Link>
          </p>
          <button
            htmlfor={name}
            className="btn btn-sm btn-cicle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById(name).close()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </form>
        <div className="text-center space-x-3 mb-5 ">
          <button className="btn btn-ghost btn-circle hover:bg-red-700 hover:text-white " onClick={googleSignUp}>
            <SiGmail />
          </button>
          <button className="btn btn-ghost btn-circle hover:bg-red-700 hover:text-white ">
            <FaFacebookF />
          </button>
          <button className="btn btn-ghost btn-circle hover:bg-red-700 hover:text-white ">
            <FaGithub />
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
