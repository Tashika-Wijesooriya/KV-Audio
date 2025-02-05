import User from "../models/user.js";

export function registerUser(req, res) {
    const newUser = new User(req.body);
    newUser.save().then(() => {
        res.json({ message: "User added successfully" });
    }).catch((err) => {
        res.status(500).json({ message: "user could not be added" });
    });
}