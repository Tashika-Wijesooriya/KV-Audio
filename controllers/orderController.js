import Order from "../models/order.js";
import Product from "../models/product.js";

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
