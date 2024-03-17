import React, { useContext, useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai";
import { FiPlus, FiMinus } from "react-icons/fi";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

const Model = ({ name, reload, totalQuantity, setTotalQuantity }) => {
  const { user, setReload } = useContext(AuthContext);
  const [dataCart, setDataCart] = useState([]);
  const [productData, setProductData] = useState([]);
  const [nodata, setNodata] = useState(false);
  const [randomOneCary, setRandomOneCart] = useState([]);
  const [totalCash, setTotalCash] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/carts/${user.email}`,
          {}
        );
        const data = await response.data;
        setDataCart(data);
          
        const productDataPromises = data.map(async (cartItem) => {
          if (cartItem.productId) {
            console.log("h1");
            const Product = await axios.get(
              `http://localhost:4000/products/${cartItem.productId}`
            );
            return Product.data;
          }
        });
        const productDataResults = await Promise.all(productDataPromises);
        setProductData(productDataResults.filter(Boolean));
  
        const randomOne = data[0];
        setRandomOneCart(randomOne);
  
        const totalCashInCart = data.reduce(
          (Bath, item) => Bath + item.price * item.quantity,
          0
        );
        setTotalCash(totalCashInCart);
  
        if (response.status === 200) {
          setNodata(false);
        }
      } catch (error) {
        setNodata(true);
      }
    };
    fetchData();
  }, [user, reload, totalCash]);

  const closeModal = () => {
    const modal = document.getElementById(name);
    modal.close();
  };

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
      await axios.post(`http://localhost:4000/carts`, cartObjects);
      setReload(true);
    } catch (error) {
      console.log("h1");
    }
  };

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
        await axios.put(
          `http://localhost:4000/carts/${cartItem._id}`,
          cartObjects
        );
        setReload(true);
      } else {
        console.log("Cannot DecreaseQuantity");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (cartItem) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:4000/carts/${cartItem._id}`);
          const total = totalQuantity - cartItem.quantity;
          setTotalQuantity(total);
          setReload(true);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
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

const handleClearAll = async (user) => {
  Swal.fire({
      title: 'Are you sure?',
      text: "This action will clear all items from your cart!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
  }).then(async (result) => {
      if (result.isConfirmed) {
          try {
              await axios.delete(`http://localhost:4000/carts/clear/${user.email}`);
              setTotalQuantity(0);
              setReload(true);
              Swal.fire(
                  'Cleared!',
                  'Your cart has been cleared.',
                  'success'
              )
          } catch (error) {
              console.log(error);
          }
      }
  })
};

  return (
    <dialog id={name} className="modal">
  <div className="modal-box flex flex-col">
    <button className="close-button self-end mr-4" onClick={closeModal}>
      <AiOutlineClose />
    </button>
    {/* เนื้อหา Modal */}
    {nodata ? (
      <div className="items-center justify-center ml-auto mr-auto mt-[100px] mb-[100px]">
        <h1>No product in carts</h1>
      </div>
    ) : (
      <>
        {dataCart.map((cartItem, index) => (
          <div key={index} className="modal-content flex p-4 items-center">
            {/* รูปสินค้า */}
            <img src={cartItem.image} alt="Product" className="w-12 h-12 mr-4" />

            {/* ชื่อสินค้า */}
            <div>
              <p className="text-sm font-semibold">
                {productData[index]?.name}
              </p>
              <p className="text-gray-500">
                {productData[index]?.description}
              </p>
            </div>

            {/* จำนวนสินค้า */}
            <div className="flex items-center ml-auto">
              <button
                className="quantity-button"
                onClick={() => handleDecreaseQuantity(cartItem)}
              >
                <FiMinus />
              </button>
              <span className="mx-2">{cartItem.quantity}</span>
              <button
                className="quantity-button"
                onClick={() => handleIncreaseQuantity(cartItem)}
              >
                <FiPlus />
              </button>
            </div>

            {/* ถังขยะ */}
            <button
              className="delete-button ml-[30px]"
              onClick={() => handleDelete(cartItem)}
            >
              <AiOutlineDelete />
            </button>
          </div>
        ))}

        {/* ข้อมูลรายละเอียดเพิ่มเติม */}
        <div className="flex p-4 items-center">
          <p>Name : {randomOneCary.name}</p>
          <p className="ml-auto">{totalQuantity} รายการ</p>
        </div>
        <div className="flex p-4 items-center">
          <p>Email : {randomOneCary.email}</p>
          <p className="ml-auto">รวม {totalCash} บาท</p>
        </div>
        <div className="flex p-4 items-center">
          <p>PhoneNumber : 086-251-0754</p>
        </div>

      {/* // ปุ่ม Clear All และ Buy Now  */}
          <div className="flex">
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-lg ml-2 "
            onClick={() => handleClearAll(user)}
          >
            Clear All
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded ml-[10px]">
            Buy Now
          </button>
        </div>
      </>
    )}
  </div>
</dialog>

  );
};

export default Model;