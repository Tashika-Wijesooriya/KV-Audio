import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
  try {
    const data = req.body;
    const orderInfo = {
      orderItems: [],
    };

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Login first" });
    }
    orderInfo.email = req.user.email;

    // Find the last order based on orderId in descending order
    const lastOrder = await Order.find().sort({ orderId: -1 }).limit(1);

    if (lastOrder.length === 0) {
      orderInfo.orderId = "ORD0001";
    } else {
      const lastOrderId = lastOrder[0].orderId; // e.g., "ORD0023"
      const lastOrderNumber = parseInt(lastOrderId.replace("ORD", ""), 10); // Extract numeric part

      const currentOrderNumber = lastOrderNumber + 1;
      const formattedNumber = currentOrderNumber.toString().padStart(4, "0"); // Ensure 4 digits

      orderInfo.orderId = "ORD" + formattedNumber;
    }

    let oneDayCost = 0;

    for (let i = 0; i < data.orderItems.length; i++) {
      try {
        const product = await Product.findOne({ key: data.orderItems[i].product.key });

        if (!product) {
          return res.status(400).json({
            message: `Product with key ${data.orderItems[i].product.key} not found`,
          });
        }

        orderInfo.orderItems.push({
          product: {
            key: product.key,
            name: product.name,
            image: product.image[0],
            price: product.price,
          },
          quantity: data.orderItems[i].quantity,
        });

        oneDayCost += product.price * data.orderItems[i].quantity;
      } catch (error) {
        console.error("Error finding product:", error);
        return res.status(500).json({ message: "Failed to retrieve product details" });
      }
    }

    orderInfo.days = data.days;
    orderInfo.startingDate = data.startingDate;
    orderInfo.endingDate = data.endingDate;
    orderInfo.totalAmount = oneDayCost * data.days; // Calculate total amount

    // Create a new order instance
    const newOrder = new Order(orderInfo);
    await newOrder.save(); // Save to the database

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
