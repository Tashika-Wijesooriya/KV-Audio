import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js";
import orderRouter from "./routes/orderRouter.js";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();

let app = express();
app.use(cors());

app.use(bodyParser.json());
app.use((req, res, next) => {
  let token = req.headers["authorization"];

  if (token != null) {
    token = token.replace("Bearer ", "");

    //console.log(token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (!err) {
        req.user = decode;
      }
    });
  }
  next();
});

let mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl);

let connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected successfuly");
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/orders", orderRouter);

app.listen(3500, () => {
  console.log("server is running on port 3500");
});
