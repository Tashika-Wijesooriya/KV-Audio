import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function registerUser(req, res) {
  const data = req.body;

  data.password = bcrypt.hashSync(data.password, 10);

  const newUser = new User(data);

  newUser
    .save()
    .then(() => {
      res.json({ message: "User added successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "user could not be added" });
    });
}

export function loginUser(req, res) {
  const data = req.body;

  User.findOne({ email: data.email }).then((user) => {
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (user.isBlocked) {
        res.status(403).json({ message: "User is blocked" });
        return;   
      }
      const isPasswordCorrect = bcrypt.compareSync(
        data.password,
        user.password
      );

      if (isPasswordCorrect) {
        const token = jwt.sign(
          {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            profilePicture: user.profilePicture,
            email: user.email,
            phone: user.phone,
          },
          process.env.JWT_SECRET
        );

        res.json({ message: "Login successful", token: token ,user:user});
      } else {
        res.status(401).json({ message: "Login failed" });
      }
    }
  });
}

export function isItAdmin(req) {
  let isAdmin = false;

  if (req.user != null) {
    if (req.user.role == "admin") {
      isAdmin = true;
    }
  }
  return isAdmin;
}

export function isItCustomer(req) {
  let isCustomer = false;

  if (req.user != null) {
    if (req.user.role == "customer") {
      isCustomer = true;
    }
  }
  return isCustomer;
}

export async function getAllUsers(req, res) {
  if (isItAdmin(req)) {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
    
  }else{
    res.status(403).json({ message: "Access denied" });
  }
  
}

export async function blockORUnblockUser(req, res) {
  const email = req.params.email;
  if(isItAdmin(req)){
    try {  
      const user = await User.findOne({ email: email });
      if (user) {
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: "User blocked successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (e) {
      res.status(500).json({ message: "Failed to block user" });
    }
  }else{
    res.status(403).json({ message: "Access denied" });
  }
}