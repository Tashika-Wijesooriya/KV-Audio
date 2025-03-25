import Cart from "../models/cart.js";
import Product from "../models/product.js";
import { isItCustomer } from "./userController.js"; // Assuming you have this function in your userController.js

export function addToCart(req, res) {
  // Check if the user is a customer
  if (!isItCustomer(req)) {
    return res
      .status(403)
      .json({ message: "Only customers can add items to the cart" });
  }

  // Get the product and quantity from the request body
  const { productId, quantity } = req.body;

  // Check if product exists by 'key'
  Product.findOne({ key: productId })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Find the user's cart
      Cart.findOne({ userId: req.user._id })
        .then((cart) => {
          if (!cart) {
            // If no cart exists, create a new one
            const newCart = new Cart({
              userId: req.user._id, // Ensure userId is set correctly
              items: [{ productId: productId, quantity }],
            });
            newCart
              .save()
              .then(() => {
                res.json({
                  message: "Product added to cart successfully",
                  cart: newCart,
                });
              })
              .catch((err) => {
                res
                  .status(500)
                  .json({ message: "Error saving cart", error: err.message });
              });
          } else {
            // If cart exists, check if the product is already in the cart
            const existingProduct = cart.items.find(
              (item) => item.productId === productId
            );

            if (existingProduct) {
              // If product exists, update the quantity
              existingProduct.quantity += quantity;
              cart
                .save()
                .then(() => {
                  res.json({
                    message: "Product added to cart successfully",
                    cart,
                  });
                })
                .catch((err) => {
                  res
                    .status(500)
                    .json({ message: "Error saving cart", error: err.message });
                });
            } else {
              // Otherwise, add a new item to the cart
              cart.items.push({ productId: productId, quantity });
              cart
                .save()
                .then(() => {
                  res.json({
                    message: "Product added to cart successfully",
                    cart,
                  });
                })
                .catch((err) => {
                  res
                    .status(500)
                    .json({ message: "Error saving cart", error: err.message });
                });
            }
          }
        })
        .catch((err) => {
          res
            .status(500)
            .json({ message: "Error finding cart", error: err.message });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error finding product", error: err.message });
    });
}
