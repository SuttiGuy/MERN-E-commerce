import React, { useContext } from "react";
import { Link,useLocation,useNavigate} from "react-router-dom";
import { SiGmail } from "react-icons/si";
import { FaFacebookF } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthProvider";

const Signup = () => {
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm();
  
    const location = useLocation();
    const navigate = useNavigate();

    const from = location?.state?.pathname || "/";

    const { createUser } = useContext(AuthContext);
  
    const onSubmit = (data) => {
        console.log(data);
        createUser(data.email, data.password).then((result) => {
          console.log(result.user);
          alert("Account created Successfully");
          navigate(from, { replace: true });
        }).catch((error) => {
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
              <Link to="/signup" className="underline text-red-700 ml-1">
                Login
              </Link>
            </p>
           
          </form>
          <div className="text-center space-x-3 mb-5 ">
            <button className="btn btn-ghost btn-circle hover:bg-red-700 hover:text-white ">
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

export default Signup