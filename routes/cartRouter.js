import express from "express";
import { addToCart } from "../controllers/cartController.js";

// Create the router
const cartRouter = express.Router();

// Add product to cart (authentication is handled directly in the controller)
cartRouter.post("/add", addToCart);

export default cartRouter;
