import React from "react";
import useAxiosSecure from "../../../hook/useAxiosSecure";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineDelete } from "react-icons/ai";

const User = () => {
  const axiosSecure = useAxiosSecure();
  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users`);
      console.log(res.data);
      return res.data;
    },
  });
  console.log(users);

  const handleCheckRole = (user) => {
    if (user.role === "admin") {
      axiosSecure.patch(`/users/user/${user._id}`).then(() => {
        refetch();
        Swal.fire({
          title: "Change role admin to user",
          icon: "success",
        });
      });
    }
    axiosSecure.patch(`/users/admin/${user._id}`).then(() => {
      refetch();
      Swal.fire({
        title: "Change role user to admin",
        icon: "success",
      });
    });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/users/${id}`);
          refetch();
          Swal.fire({
            title: "Deleted!",
            text: `${res.data.name} has been deleted.!` ,
            icon: "success",
          });
        } catch (error) {
          console.log(error);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // ถ้าผู้ใช้คลิก "No" หรือปิดกล่องข้อความคำเตือน
        Swal.fire("Cancelled", "Your file is safe :)", "error");
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between mx-4 my-4">
        <h2 className=" text-2xl">All users</h2>
        <h2 className=" text-2xl">Total Users: {users.length}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra md:w-[870px]">
          {/* head */}
          <thead className="bg-red-800 text-white text-center">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="text-center">
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={user.photoURL}
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td className="flex justify-center items-center space-x-2">
                  <p>User</p>
                  <input
                    type="checkbox"
                    className="toggle toggle-success flex flex-col justify-items-center"
                    onClick={() => handleCheckRole(user)}
                    checked={user.role === "admin"}
                  />
                  <p>Admin</p>
                </td>
                <th>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => handleDelete(user._id)}
                  >
                    <AiOutlineDelete />
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
