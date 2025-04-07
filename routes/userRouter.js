import express from "express";
import {
  blockORUnblockUser,
  getAllUsers,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/all", getAllUsers);

userRouter.put("/block/:email", blockORUnblockUser);

export default userRouter;
