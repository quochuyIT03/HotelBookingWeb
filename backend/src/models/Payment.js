import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Booking", 
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String, 
            enum: ["cash", "paypal", "credit_card"],
            default: "cash"
        },
        status: {
            type: String, 
            enum: ["pending", "paid", "failed"], 
            default: "pending"
        }
    },
    {timestamps: true}
)
const Payment = mongoose.model("Payment", paymentSchema)
export default Payment