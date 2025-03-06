import { isItAdmin, isItCustomer } from "./userController.js";
import Inquiry from "../models/inquiry.js";

export async function addInquiry(req, res) {
  try {
    if (isItCustomer(req)) {
      const data = req.body;

      data.email = req.user.email;
      data.phone = req.user.phone;

      let id = 0;

      const inquiries = await Inquiry.find().sort({ id: -1 }).limit(1);

      if (inquiries.length == 0) {
        id = 1;
      } else {
        id = inquiries[0].id + 1;
      }

      data.id = id;

      const newInquiry = new Inquiry(data);
      const response = await newInquiry.save();

      res.json({ message: "Inquiry added successfully", id: response.id });
    }
  } catch (error) {
    res.status(500).json({ message: "Inquiry could not be added" });
  }
}

export async function getInquiries(res, req) {
  try {
    if (isItCustomer(req)) {
      const inquiries = await Inquiry.find({ email: req.user.email });
      res.json(inquiries);
      return;
    } else if (isItAdmin(req)) {
      const inquiries = await Inquiry.find();
      res.json(inquiries);
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Could not fetch inquiries" });
  }
}

export async function deleteInquiries(req, res) {
  try {
    if (isItAdmin(req)) {
      const id = req.params.id;
      await Inquiry.deleteOne({ id: id });

      res.json({ message: "Inquiry deleted successfully" });
      return;
    } else if (isItCustomer) {
      const id = req.params.id;
      const inquiries = await Inquiry.findOne({ id: id });
      if (inquiries == null) {
        res.status(404).json({
          message: "Inquiry not found",
        });
        return;
      } else {
        if (inquiries.email == req.user.email) {
          await Inquiry.deleteOne({ id: id });
          res.json({ message: "Inquiry deleted successfully" });
          return;
        } else {
          res.status(403).json({
            message: "unauthorized",
          });
        }
      }
    } else {
      res.status(403).json({
        message: "unauthorized",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete inquiry" });
  }
}

export async function updateInquiry(req, res) {
  try {
    if (await isItAdmin(req)) {
      const { id } = req.params;
      const data = req.body;
      await Inquiry.updateOne({ id: id }, data);
      return res.json({ message: "Inquiry updated successfully" });
    } else if (await isItCustomer(req)) {
      const { id } = req.params;
      const updateData = req.body;

      const inquiry = await Inquiry.findOne({ _id: id });
      if (!inquiry) {
        res.status(404).json({ message: "Inquiry not found" });
        return;
      }

      if (inquiry.email === req.user.email) {
        await Inquiry.updateOne({ id: id }, { message: data.message });
        res.json({ message: "Inquiry updated successfully" });
        return;
      } else {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }
    } else {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update inquiry" });
    return;
  }
}
