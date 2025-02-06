import User from "../models/user.js";
import bcrypt from "bcrypt";

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
    if ((user = null)) {
      res.status(404).json({ message: "User not found" });
    } else {
      const isPasswordCorrectr = bcrypt.compareSync(
        data.password,
        user.password
      );

      if (isPasswordCorrectr) {
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Login failed" });
      }
    }
  });
}
