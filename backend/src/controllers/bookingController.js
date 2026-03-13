import Booking from "../models/Booking.js";
import mongoose from "mongoose";
import Room from "../models/Room.js";

const getAllBooking = async (req, res) => {
  try {
    const getAll = await Booking.find()
      .populate("hotel")
      .populate({
        path: "user",
        select: "-password",
      })
      .populate("room");
    if (!getAll) {
      return res.status(404).json({
        success: false,
        message: "Không có booking nào",
      });
    }
    res.status(200).json({
      success: true,
      count: getAll.length,
      data: getAll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDetailsBooking = async (req, res) => {
  try {
    const detailsBooking = await Booking.findById(req.params.id)
      .populate("hotel")
      .populate({
        path: "user",
        select: "-password",
      })
      .populate("room");
    if (!detailsBooking) {
      return res
        .status(400)
        .json({ message: "Không tồn tại booking cần tìm!" });
    }
    return res.status(200).json({
      success: true,
      data: detailsBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addNewBooking = async (req, res) => {
  try {
    const bookings = new Booking(req.body);
    const savedBooking = await bookings.save();

    res.status(201).json({
      success: true,
      data: savedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      },
    );
    if (!updatedBooking) {
      return res.status(400).json({ message: "Booking không tồn tại" });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking không tồn tại",
      });
    }
    res.status(200).json(deletedBooking);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getAllBooking,
  getDetailsBooking,
  updateBooking,
  deleteBooking,
  addNewBooking,
};
