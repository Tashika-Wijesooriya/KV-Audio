import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";

let app = express();

app.use(bodyParser.json());

let mongoUrl =
  "mongodb+srv://tashika:1234@cluster0.vf5sl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUrl);

let connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected successfuly");
});



app.use("/api/users",userRouter)

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
