import Order from "../models/order.js";
import Product from "../models/product.js";
import { isItCustomer, isItAdmin } from "./userController.js";

export async function createOrder(req, res) {
  const data = req.body;
  const orderInfo = {
    orderedItems: [],
  };

  if (req.user == null) {
    res.status(401).json({
      message: "Please login and try again",
    });
    return;
  }
  orderInfo.email = req.user.email;

  // Fetch the last order to generate the new orderId
  const lastOrder = await Order.find().sort({ orderDate: -1 }).limit(1);

  // Set the orderId based on the last order or initialize from "ORD0001"
  if (lastOrder.length === 0) {
    orderInfo.orderId = "ORD0001";
  } else {
    const lastOrderId = lastOrder[0].orderId;
    const lastOrderNumberInString = lastOrderId.replace("ORD", "");
    const lastOrderNumber = parseInt(lastOrderNumberInString);
    const currentOrderNumber = lastOrderNumber + 1;
    const formattedNumber = String(currentOrderNumber).padStart(4, "0");
    orderInfo.orderId = "ORD" + formattedNumber;
  }

  let oneDayCost = 0;

  // Process ordered items and check product availability
  for (let i = 0; i < data.orderedItems.length; i++) {
    try {
      const product = await Product.findOne({ key: data.orderedItems[i].key });

      if (!product) {
        res.status(404).json({
          message: `Product with key ${data.orderedItems[i].key} not found`,
        });
        return;
      }

      if (product.availability === false) {
        res.status(400).json({
          message: `Product with key ${data.orderedItems[i].key} is not available`,
        });
        return;
      }

      orderInfo.orderedItems.push({
        product: {
          key: product.key,
          name: product.name,
          image: product.image[0],
          price: product.price,
        },
        quantity: data.orderedItems[i].qty,
      });

      oneDayCost += product.price * data.orderedItems[i].qty;
    } catch (e) {
      console.error("Error processing ordered item:", e); // Log the error for debugging
      res.status(500).json({
        message: `Failed to process item with key ${data.orderedItems[i].key}`,
        error: e.message || e,
      });
      return;
    }
  }

  // Set additional order details
  orderInfo.days = data.days;
  orderInfo.startingDate = data.startingDate;
  orderInfo.endingDate = data.endingDate;
  orderInfo.totalAmount = oneDayCost * data.days;

  // Create the new order and save it to the database
  try {
    const newOrder = new Order(orderInfo);
    const result = await newOrder.save();
    res.json({
      message: "Order created successfully",
      order: result,
    });
  } catch (e) {
    console.error("Error saving order:", e); // Log the error for debugging
    res.status(500).json({
      message: "Failed to create order",
      error: e.message || e,
    });
  }
}

export async function getQuotes(req, res) {
  const data = req.body;
  const orderInfo = {
    orderedItems: [],
  };

  let oneDayCost = 0;

  for (let i = 0; i < data.orderedItems.length; i++) {
    try {
      const product = await Product.findOne({ key: data.orderedItems[i].key });

      if (!product) {
        res.status(404).json({
          message: `Product with key ${data.orderedItems[i].key} not found`,
        });
        return;
      }

      if (product.availability === false) {
        res.status(400).json({
          message: `Product with key ${data.orderedItems[i].key} is not available`,
        });
        return;
      }

      orderInfo.orderedItems.push({
        product: {
          key: product.key,
          name: product.name,
          image: product.image[0],
          price: product.price,
        },
        quantity: data.orderedItems[i].qty,
      });

      oneDayCost += product.price * data.orderedItems[i].qty;
    } catch (e) {
      console.error("Error processing ordered item:", e); // Log the error for debugging
      res.status(500).json({
        message: `Failed to process item with key ${data.orderedItems[i].key}`,
        error: e.message || e,
      });
      return;
    }
  }

  // Set additional order details
  orderInfo.days = data.days;
  orderInfo.startingDate = data.startingDate;
  orderInfo.endingDate = data.endingDate;
  orderInfo.totalAmount = oneDayCost * data.days;

  // Create the new order and save it to the database
  try {
    res.json({
      message: "Order quotetion  successfully",
      total: orderInfo.totalAmount,
    });
  } catch (e) {
    console.error("Error saving order:", e); // Log the error for debugging
    res.status(500).json({
      message: "Failed to create order",
      error: e.message || e,
    });
  }
}

export async function getOrders(req, res) {
  try {
    if (isItCustomer(req)) {
      const orders = await Order.find({ email: req.user.email });
      res.json(orders);
    } else if (isItAdmin(req)) {
      const orders = await Order.find();
      res.json(orders);
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  } catch (e) {
    console.error("Error fetching orders:", e); // Log the error for debugging
    res.status(500).json({
      message: "Failed to fetch orders",
      error: e.message || e,
    });
  }
}

export async function approveORRejectOrder(req, res) {
  const orderId = req.params.id;
  const { status } = req.body; // Expecting status to be either "Approved" or "Rejected"

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { isApproved: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: `Order ${status} successfully`,
      order: updatedOrder,
    });
  } catch (e) {
    console.error("Error updating order:", e); // Log the error for debugging
    res.status(500).json({
      message: "Failed to update order",
      error: e.message || e,
    });
  }
}
