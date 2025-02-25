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
          },
         process.env.JWT_SECRET
        );

        res.json({ message: "Login successful", token: token });
      } else {
        res.status(401).json({ message: "Login failed" });
      }
    }
  });
}

// import User from "../models/user.js";
// import bcrypt from "bcrypt";

// export async function registerUser(req, res) {
//   try {
//     const data = req.body;

//     // Generate a unique salt for this user
//     const salt = bcrypt.genSaltSync(10);

//     // Hash the password using the salt
//     const hashedPassword = bcrypt.hashSync(data.password, salt);

//     // Save both the salt and the hashed password
//     const newUser = new User({
//       ...data,
//       password: hashedPassword,
//       salt: salt, // Store salt in the database
//     });

//     await newUser.save();
//     res.json({ message: "User added successfully" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "User could not be added", error: err.message });
//   }
// }

// export async function loginUser(req, res) {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Retrieve the stored salt (though bcrypt hashes already include it)
//     const { salt, password: hashedPassword } = user;

//     // Hash the input password using the stored salt
//     const hashedInputPassword = bcrypt.hashSync(password, salt);

//     // Compare the newly hashed password with the stored hashed password
//     if (hashedInputPassword === hashedPassword) {
//       res.json({ message: "Login successful" });
//     } else {
//       res.status(401).json({ message: "Login failed" });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "An error occurred", error: err.message });
//   }
// }
