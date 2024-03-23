import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SiGmail } from "react-icons/si";
import { FaFacebookF,FaGithub} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthProvider";
import useAuth from "../hook/useAuth";
import useAxiosPublic from "../hook/useAxiosPublic";
import Swal from "sweetalert2";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const{createUser, updateUserProfile, signUpWithGoogle} = useAuth();
  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location?.state?.pathname || "/";

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then((result) => {
        // Signed up
        const user = result.user;
        console.log(user);
        updateUserProfile(data.name, data.photoURL).then(() => {
          const userInfo = {
            name: data.name,
            email: data.email,
          };
          axiosPublic.post("/users", userInfo).then((response) => {
            console.log(response);
            console.log(user);
            Swal.fire({
              title: "Account created Successfully",
              icon: "success",
              timer: 1500,
            });
            navigate(from, { replace: true });
          });
        });
        // alert("Account created Successfully")
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
        };
        axiosPublic.post("/users", userInfo).then((response) => {
          console.log(response);
          console.log(user);
          Swal.fire({
            title: "SignUp google account successfully",
            icon: "success",
            timer: 1500,
          });
        });
        navigate(from, { replace: true });

        // document.getElementById("login").close()
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
      <div className="modal-box action mt-0 flex flex-col justify-center">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Create An Account</h3>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="name"
              placeholder="name"
              className="input input-bordered"
              required
              {...register("name")}
            />
          </div>
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
          </div>
          <div className="form-control mt-6">
            <input
              type="submit"
              value="Sign up"
              className="btn bg-red-700 text-white"
            />
          </div>

          <p className="text-center my-2 ">
            Have an account ?{" "}
            <Link to="/signin" className="underline text-red-700 ml-1">
              Login
            </Link>
          </p>
        </form>
        <div className="text-center space-x-3 mb-5 ">
            <button
              className="btn btn-ghost btn-circle hover:bg-red-700 hover:text-white "
              onClick={googleSignUp}
            >
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
    </div>
  );
};

export default Signup;
