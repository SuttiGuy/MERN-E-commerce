const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const ProductSchema = new Schema(
  {
    name: {type : String,required:true},
    description: {type : String,required:true},
    price: {type : Number,required:true},
    image: {type : String,required:true},
    category: {type : String,required:true},
  },
  {
    timestamps: true,
  }
);
const ProductModel = model("Product", ProductSchema);
module.exports = ProductModel;

 /*{
      "_id": "1",
      "name": "Trendy T-Shirt",
      "description": "A stylish and comfortable t-shirt suitable for everyday wear.",
      "price": 19.99,
      "image": "https://cdn02.pinkoi.com/product/pw3J345G/0/1/640x530.jpg",
      "category": "popular"
    },*/