import express from "express";
import {
  blockORUnblockUser,
  getAllUsers,
  getUser,
  loginUser,
  registerUser,
  loginWithGoogle,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/all", getAllUsers);

userRouter.put("/block/:email", blockORUnblockUser);

userRouter.get("/", getUser);

userRouter.post("/google", loginWithGoogle);

export default userRouter;
