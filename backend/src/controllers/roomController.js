import mongoose from "mongoose";
import Room from "../models/Room.js";

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("hotel").lean(); //populate("hotel"): lấy thông tin của hotel
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRoomByHotel = async (req, res) => {
  try {
    const rooms = await Room.find({
      hotel: req.params.id,
    });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addNewRoom = async (req, res) => {
  try {
    const { roomtype, description, price, maxPeople, roomNumbers, hotel } =
      req.body;
    const hotelId = new mongoose.Types.ObjectId(hotel);

    const newRoom = new Room({
      roomtype,
      description,
      price,
      maxPeople,
      roomNumbers,
      hotel: hotelId,
    });
    const savedRoom = await newRoom.save();

    res.status(201).json({
      success: true,
      data: savedRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedRoom) {
      return res.status(404).json({ 
        success: false, 
        message: "Room không tồn tại"
       });
    }
    res.status(200).json({
      success: true, 
      data: updatedRoom
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Không tìm thấy phòng để xóa" });
    }
    return res.status(201).json({
      success: true,
      message: "Xóa phòng thành công!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkRoomAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const availableRooms = room.roomNumbers.filter((roomNumber) => {
      const isBooked = roomNumber.unavailableDates.some((date) => {
        const bookedDate = new Date(date);
        return bookedDate >= start && bookedDate <= end;
      });

      return !isBooked;
    });

    res.status(200).json({
      success: true,
      count: availableRooms.length,
      availableRooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookedRooms = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const bookedRooms = room.roomNumbers.filter((roomNumber) => {
      return roomNumber.unavailableDates.some((date) => {
        const bookedDate = new Date(date);
        return bookedDate >= start && bookedDate <= end;
      });
    });

    res.status(200).json({
      success: true,
      count: bookedRooms.length,
      bookedRooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};