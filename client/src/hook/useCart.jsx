import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";

const useCart = () => {
  const { user } = useContext(AuthContext);
  const { refetch, data: cart = [] } = useQuery({
    queryKey: ["carts", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:4000/carts/${user.email}`
      );
      console.log(res.data);
      return res.data;
    },
  });
  return [cart, refetch];
};

export default useCart;



