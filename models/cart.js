import mongoose from "mongoose";
import User from "./user.js";

// Cart Schema Definition
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Assuming you have a Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
          },
     
    },
  ],
});

// Cart Model Definition
const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
