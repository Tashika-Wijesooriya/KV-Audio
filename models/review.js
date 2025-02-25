import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
})


const Review = mongoose.model('Review', reviewSchema);
export default Review