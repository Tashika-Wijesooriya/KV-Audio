import express from "express";
import { addInquiry, deleteInquiries, getInquiries } from "../controllers/inquiryController.js";

const inquiryRouter = express.Router();

inquiryRouter.post("/", addInquiry);
inquiryRouter.get("/", getInquiries);
inquiryRouter.delete("/:id",deleteInquiries)


export default inquiryRouter;