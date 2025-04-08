import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

import nodemailer from "nodemailer";
import OTP from "../models/otp.js";

dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "tashikawijesooriya@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
});

export function registerUser(req, res) {
  const data = req.body;

  // Hash the password
  data.password = bcrypt.hashSync(data.password, 10);

  const newUser = new User(data);

  newUser
    .save()
    .then(() => {
      res.json({ message: "User added successfully" });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "User could not be added", error: err.message });
    });
}

export function loginUser(req, res) {
  const data = req.body;

  User.findOne({ email: data.email }).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    const isPasswordCorrect = bcrypt.compareSync(data.password, user.password);

    if (isPasswordCorrect) {
      const token = jwt.sign(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profilePicture: user.profilePicture,
          email: user.email,
          phone: user.phone,
          emailVerified: user.emailVerified,
        },
        process.env.JWT_SECRET
      );

      res.json({ message: "Login successful", token: token, user: user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
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
      res
        .status(500)
        .json({ message: "Failed to fetch users", error: e.message });
    }
  } else {
    res.status(403).json({ message: "Access denied" });
  }
}

export async function blockORUnblockUser(req, res) {
  const email = req.params.email;

  if (isItAdmin(req)) {
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: "User blocked/unblocked successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (e) {
      res
        .status(500)
        .json({ message: "Failed to block/unblock user", error: e.message });
    }
  } else {
    res.status(403).json({ message: "Access denied" });
  }
}

export async function getUser(req, res) {
  if (req.user) {
    try {
      const user = await User.findOne({ email: req.user.email });
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (e) {
      res
        .status(500)
        .json({ message: "Failed to fetch user", error: e.message });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

export async function loginWithGoogle(req, res) {
  const accessToken = req.body.accessToken;

  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const googleUser = response.data;

    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      const hashedPassword = bcrypt.hashSync(
        "randomPasswordFromGoogleLogin",
        10
      );
      user = new User({
        email: googleUser.email,
        password: hashedPassword,
        firstName: googleUser.given_name || "First",
        lastName: googleUser.family_name || "Last",
        address: "Not Provided",
        phone: "Not Provided",
        profilePicture: googleUser.picture || "",
        emailVerified: true,
      });

      await user.save();
    }

    const token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        phone: user.phone,
        emailVerified: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expiration set to 1 hour
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Google login error:", error.message);
    res.status(500).json({ message: "Failed to login with Google" });
  }
}

export async function sendOTP(req, res) {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });

  try {
    const otpCode = Math.floor(Math.random() * 9000) + 1000;
    await OTP.create({ email: req.user.email, otp: otpCode });

    const message = {
      from: "tashikawijesooriya@gmail.com",
      to: req.user.email,
      subject: "Validating OTP",
      text: `Your OTP code is ${otpCode}`,
    };

    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to send OTP" });
      } else {
        res.json({ message: "OTP sent successfully" });
      }
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error", detail: err.message });
  }
}

export async function verifyOTP(req, res) {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });

  try {
    const code = req.body.code;
    const otp = await OTP.findOne({ email: req.user.email, otp: code });

    if (!otp) return res.status(404).json({ error: "Invalid OTP" });

    await OTP.deleteOne({ email: req.user.email, otp: code });

    await User.updateOne({ email: req.user.email }, { emailVerified: true });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to verify OTP", detail: err.message });
  }
}
