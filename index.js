import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import reviewRouter from "./routes/reviewRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js";
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

app.listen(3600, () => {
  console.log("server is running on port 3600");
});
