import Review from "../models/review.js";

export function addReview(req, res) {
  if (req.user == null) {
    res.status(401).json({ message: "login first" });
    return;
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

export function getReviews(req, res) {
  const user = req.user;

  if (user == null || user.role != "admin") {
    Review.find({ isApproved: true })
      .then((reviews) => {
        res.json(reviews);
      })
      .catch((err) => {
        res.status(500).json({ message: "Could not fetch reviews" });
      });
    return;
  }

  if (user.role == "admin") {
    Review.find()
      .then((reviews) => {
        res.json(reviews);
      })
      .catch((err) => {
        res.status(500).json({ message: "Could not fetch reviews" });
      });
  }
}

export  function deleteReview(req, res) {
  const email = req.params.email;

  Review.deleteOne({ email: email })
    .then(() => {
      res.json({ message: "Review deleted successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Review could not be deleted" });
    });
};
