import express from "express";
import { createOrder, getOrders, getQuotes } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.post("/quote", getQuotes);
orderRouter.get("/", getOrders);

export default orderRouter;
