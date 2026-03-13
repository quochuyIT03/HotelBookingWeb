import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profile: {
      fullname: {
        type: String,
        trim: true,
      },

      location: {
        type: String,
        trim: true,
      },

      avatarUrl: {  
        type: String,
        default: "",
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("User", userSchema);
export default User;