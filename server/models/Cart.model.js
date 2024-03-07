const mongoose = require("mongoose");
const { Schema, model } = mongoose; 
const CartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref:"Product", required: true }, 
    email: { type: String, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const CartItemModel = model("CartItem", CartItemSchema);
module.exports = CartItemModel;
