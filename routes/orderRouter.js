import express from "express";
import { createOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

// POST request to create a new order
orderRouter.post("/", createOrder);

export default orderRouter;
