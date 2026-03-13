import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        hotel: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Hotel", 
            required: true,
        }, 
        rating: {
            type: Number, 
            min: 1, 
            max: 5, 
            required: true
        }, 
        comment: String
    }, 
    {timestamps: true}

)

const Review = mongoose.model("Review", reviewSchema);
export default Review;