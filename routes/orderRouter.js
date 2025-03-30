import express from "express";
import { createOrder, getQuote } from "../controllers/orderController.js";

const orderRouter = express.Router();

// POST request to create a new order
orderRouter.post("/", createOrder);
orderRouter.post("/quote",getQuote); 

export default orderRouter;
