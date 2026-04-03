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
  const { hotel, room, roomNumber, checkInDate, checkOutDate } = req.body;

  try {
    // 1. Ép kiểu dữ liệu về Date để tránh lỗi so sánh chuỗi (String)
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày!",
      });
    }

    // 2. Kiểm tra trùng lịch chuẩn logic Overlapping:
    // (Ngày nhận mới < Ngày trả cũ) VÀ (Ngày trả mới > Ngày nhận cũ)
    const existingBooking = await Booking.findOne({
      hotel: hotel,
      room: room,
      roomNumber: roomNumber,
      status: { $ne: "cancelled" }, // Chỉ tính các phòng chưa hủy
      $and: [
        { checkInDate: { $lt: end } }, // Bắt đầu trước khi đơn cũ kết thúc
        { checkOutDate: { $gt: start } }, // Kết thúc sau khi đơn cũ bắt đầu
      ],
    });

    // 3. Nếu tìm thấy một booking đang tồn tại, chặn lại và báo lỗi
    if (existingBooking) {
      // Format lại ngày cho dễ đọc khi báo lỗi cho User
      const formattedStart = new Date(
        existingBooking.checkInDate,
      ).toLocaleDateString("vi-VN");
      const formattedEnd = new Date(
        existingBooking.checkOutDate,
      ).toLocaleDateString("vi-VN");

      return res.status(400).json({
        success: false,
        message: `Phòng ${roomNumber} đã có người đặt từ ${formattedStart} đến ${formattedEnd}. Vui lòng chọn thời gian khác hoặc số phòng khác!`,
      });
    }

    // 4. Nếu không trùng lịch, tiến hành lưu booking mới
    const booking = new Booking({
      ...req.body,
      checkInDate: start, // Lưu trực tiếp dạng Date
      checkOutDate: end, // Lưu trực tiếp dạng Date
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: "Đặt phòng thành công!",
      data: savedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
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

// BookingController.js
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("hotel")
      .populate("room");
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
};
const checkAvailability = async (req, res) => {
  const { room, checkIn, checkOut } = req.query;

  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày!",
      });
    }

    // Tìm tất cả booking của loại phòng này mà trùng lịch
    const bookings = await Booking.find({
      room: room,
      status: { $ne: "cancelled" },
      $and: [{ checkInDate: { $lt: end } }, { checkOutDate: { $gt: start } }],
    });

    // Lấy ra danh sách các số phòng đã bị đặt (ví dụ: [103])
    const bookedNumbers = bookings.map((b) => b.roomNumber);

    res.status(200).json({
      success: true,
      bookedNumbers: bookedNumbers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const checkBookingStatus = async (req, res, next) => {
  const { user, hotel } = req.query;

  try {
    // Tìm ít nhất 1 đơn đặt phòng của user này tại khách sạn này
    // Huy có thể thêm điều kiện status: "confirmed" để chắc chắn họ đã thanh toán/ở rồi
    const booking = await Booking.findOne({
      user: user,
      hotel: hotel,
      status: "confirmed" 
    });

    if (booking) {
      return res.status(200).json({ hasBooked: true });
    } else {
      return res.status(200).json({ hasBooked: false });
    }
  } catch (err) {
    next(err);
  }
};

export {
  getAllBooking,
  getDetailsBooking,
  updateBooking,
  deleteBooking,
  addNewBooking,
  getMyBookings,
  checkAvailability,
  checkBookingStatus
};
