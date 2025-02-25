import Review from "../models/review.js";

export function addReview(req, res) {
    if (req.user == null) {
        res.status(401).json({ message: "login first" });
        return
    }

    const data = req.body;

    data.name = req.user.firstName + " " + req.user.lastName;
    data.email = req.user.email;
    data.profilePicture = req.user.profilePicture;

    const newReview = new Review(data);

    newReview
        .save()
        .then(() => {
            res.json({ message: "Review added successfully" });
        })
        .catch((err) => {
            res.status(500).json({ message: "Review could not be added" });
        });
        
    }