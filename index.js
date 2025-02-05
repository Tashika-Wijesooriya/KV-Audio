import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

let app = express();

app.use(bodyParser.json());

let mongoUrl =
  "mongodb+srv://admin:123@cluster0.ko33q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUrl);

let connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected successfuly");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
