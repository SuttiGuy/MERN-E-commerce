import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import useCart from "../../hook/useCart";
import Swal from "sweetalert2";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import useAxiosPublic from "../../hook/useAxiosPublic";

const Cart = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [cart, refetch] = useCart();
  const [totalQuantity, setTotalQuantity] = useState(0); // เพิ่ม state สำหรับจำนวนรวมของสินค้า
  const [reload, setReload] = useState(false); // เพิ่ม state สำหรับรีโหลดข้อมูลหลังจากการลบสินค้า

  // ฟังก์ชั่นการคำนวณราคารวม
  const calculateTotalPrice = (item) => item.price * item.quantity;

  // ฟังก์ชั่นการคำนวณราคารวมทั้งหมดของสินค้าในตะกร้า
  const calculateTotal = () =>
    cart.reduce((total, item) => total + calculateTotalPrice(item), 0);

  // ฟังก์ชั่นลดจำนวนสินค้าในตะกร้า
  const handleDecreaseQuantity = async (cartItem) => {
    const DecreaseQuantity = cartItem.quantity - 1;
    const cartObjects = {
      productId: cartItem.productId,
      email: cartItem.email,
      price: cartItem.price,
      name: cartItem.name,
      image: cartItem.image,
      quantity: DecreaseQuantity,
    };
    try {
      if (cartItem.quantity !== 1) {
        await axiosPublic.put(
          `/carts/${cartItem._id}`,
          cartObjects
        );
        refetch();
      } else {
        console.log("Cannot DecreaseQuantity");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ฟังก์ชั่นเพิ่มจำนวนสินค้าในตะกร้า
  const handleIncreaseQuantity = async (cartItem) => {
    const cartObjects = {
      productId: cartItem.productId,
      email: cartItem.email,
      price: cartItem.price,
      name: cartItem.name,
      image: cartItem.image,
      quantity: 1,
    };
    try {
      await axiosPublic.post(`/carts`, cartObjects);
      refetch();
    } catch (error) {
      console.log("error");
    }
  };

  // ฟังก์ชั่นลบสินค้าในตะกร้า
  const handleDelete = async (cartItem) => {
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
          await axiosPublic.delete(`/carts/${cartItem._id}`);
          const total = totalQuantity - cartItem.quantity;
          setTotalQuantity(total);
          setReload(true);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
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

  // ฟังก์ชั่นล้างสินค้าในตะกร้าทั้งหมด
  const handleClearAll = async (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will clear all items from your cart!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPublic.delete(`/carts/clear/${user.email}`);
          setTotalQuantity(0);
          setReload(true);
          Swal.fire("Cleared!", "Your cart has been cleared.", "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div className="section-container bg-gradient-to-r from-[#FAFAFA] to-[#FCFCFC]">
      <div className="py-24 items-center">
        <div className="space-y-7 px-4 mt-6">
          <h2 className="md:text-4xl text-4xl font-bold md:leading-snug leading-snug text-center py-10">
            Items Added to The <span className="text-red-600">Cart</span>
          </h2>

          {cart.length > 0 ? (
            <div className="py-8 overflow-x-auto">
              <table className="w-full border-collapse border border-white">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Item Name</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Price Per Unit</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* items*/}
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg"
                        />
                      </td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2 flex justify-center space-x-2">
                        <button
                          className="btn btn-xs"
                          onClick={() => handleDecreaseQuantity(item)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="btn btn-xs"
                          onClick={() => handleIncreaseQuantity(item)}
                        >
                          +
                        </button>
                      </td>
                      <td className="px-4 py-2">{item.price}</td>
                      <td className="px-4 py-2">{calculateTotalPrice(item)}</td>
                      <td className="px-4 py-2">
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(item)}
                        >
                          <AiOutlineDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3">
                      <h4 className="font-semibold text-xl">
                        Customer Details
                      </h4>
                      <p>Name: {user.displayName}</p>
                      <p>Email: {user.email}</p>
                      <p>User ID: {user.uid}</p>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h4 className="font-semibold text-xl">
                        Shopping Details
                      </h4>
                      <p>Total Items: {cart.length}</p>
                      <p>Total Prices: {calculateTotal()}฿</p>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-xs"
                        onClick={() => handleClearAll(user)}
                      >
                        <AiOutlineDelete />
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="flex justify-center mt-4">
              <p>No items in the cart</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
