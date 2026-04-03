import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
      unique: true,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    image: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    cheapestPrice: {
      type: Number,
      required: true,
    },

    amenities: [
      {
        type: String,
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
const Hotel = mongoose.model("Hotel", hotelSchema); 
export default Hotel;