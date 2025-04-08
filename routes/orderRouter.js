import express from "express";
import {
  approveORRejectOrder,
  createOrder,
  getOrders,
  getQuotes,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.post("/quote", getQuotes);
orderRouter.get("/", getOrders);
orderRouter.put("/status/:orderId", approveORRejectOrder);

export default orderRouter;
