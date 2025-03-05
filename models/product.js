import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: "uncategorized",
  },
  dimension: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
    default: true,
  },
  image: {
    type: [String],
    required: true,
    default:
      ["https://i.pinimg.com/474x/8c/60/98/8c609895a1b9783451cac96f3ee5af0a.jpg"],
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
