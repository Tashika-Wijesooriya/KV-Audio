import express from "express";
import {
  blockORUnblockUser,
  getAllUsers,
  getUser,
  loginUser,
  registerUser,
  loginWithGoogle,
  sendOTP,
  verifyOTP,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/all", getAllUsers);
userRouter.put("/block/:email", blockORUnblockUser);
userRouter.get("/", getUser);
userRouter.post("/google", loginWithGoogle);

userRouter.get("/sendOTP", sendOTP);
userRouter.post("/verifyEmail", verifyOTP);

export default userRouter;
