import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomtype: {
      type: String,
      enum: ["standard", "deluxe", "superior", "suite"],
      default: "standard",
      required: true,
    },
    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    maxPeople: {
      type: Number,
      required: true,
    },

    roomNumbers: [
      {
        number: Number,
        unavailableDates: [Date],
      },
    ],

    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
  },
  { timestamps: true },
);
const Room = mongoose.model("Room", roomSchema);
export default Room;
