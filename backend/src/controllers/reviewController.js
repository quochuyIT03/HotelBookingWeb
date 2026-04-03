import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import mongoose from "mongoose";

// --- HÀM HỖ TRỢ: TÍNH TOÁN VÀ CẬP NHẬT RATING CHO HOTEL ---
// Tách ra hàm riêng để dùng chung cho cả lúc Thêm và Xóa review
const updateHotelRating = async (hotelId) => {
  const allReviews = await Review.find({ hotel: hotelId });
  const totalRating = allReviews.reduce((acc, item) => item.rating + acc, 0);

  // Tính trung bình, làm tròn 1 chữ số thập phân
  const finalAvg = allReviews.length > 0 
    ? (totalRating / allReviews.length).toFixed(1) 
    : 0;

  // Cập nhật vào model Hotel (Sử dụng field 'rating' như Huy yêu cầu)
  await Hotel.findByIdAndUpdate(hotelId, { 
    rating: Number(finalAvg) 
  });
  
  console.log(`[Hệ thống] Đã cập nhật rating cho Hotel ${hotelId}: ${finalAvg}`);
  return finalAvg;
};

// 1. Lấy tất cả review (Dành cho Admin)
export const getAllReview = async (req, res) => {
  try {
    const getAll = await Review.find().populate("hotel").populate({
      path: "user",
      select: "-password",
    });
    res.status(200).json({
      success: true,
      count: getAll.length,
      data: getAll,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Lấy review theo Khách sạn (Hiển thị ở trang chi tiết)
export const getAllReviewByHotel = async (req, res) => {
  try {
    const reviews = await Review.find({ hotel: req.params.id })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Lấy review theo Phòng (Nếu cần)
export const getAllReviewByRoom = async (req, res) => {
  try {
    const reviewByRoom = await Review.find({
      room: req.params.id
    }).populate("user", "-password");

    res.status(200).json({
      success: true,
      count: reviewByRoom.length,
      data: reviewByRoom
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. XÓA REVIEW (Chỉ chủ nhân mới được xóa)
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body; // Lấy thêm role từ body

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đánh giá!" });
    }

    // --- CẬP NHẬT LOGIC BẢO MẬT ---
    // Cho phép xóa nếu: (ID trùng khớp) HOẶC (Người xóa là Admin)
    const isOwner = review.user.toString() === userId;
    const isAdmin = role === "superadmin" || role === "admin"; // Giả sử Huy lưu role trong localStorage là 'admin'

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn không có quyền xóa đánh giá này!" 
      });
    }

    const hotelId = review.hotel;
    await Review.findByIdAndDelete(id);

    // Tính toán lại rating cho Hotel (Hàm này mình đã viết ở trên)
    await updateHotelRating(hotelId);

    res.status(200).json({ success: true, message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. THÊM REVIEW MỚI
export const addNewReview = async (req, res) => {
  try {
    const { hotel, user, rating, comment } = req.body;
    const hotelId = hotel; // Khai báo hotelId từ body

    // Kiểm tra quyền (Đã đặt phòng và status là confirmed chưa)
    const hasBooked = await Booking.findOne({ 
      user: user, 
      hotel: hotelId, 
      status: "confirmed" 
    });

    if (!hasBooked) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn cần hoàn thành kỳ nghỉ tại đây mới có thể để lại đánh giá!" 
      });
    }

    // Chặn đánh giá trùng lặp
    const existingReview = await Review.findOne({ user: user, hotel: hotelId });
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: "Bạn đã để lại đánh giá cho khách sạn này rồi!" 
      });
    }

    const newReview = new Review({
      hotel: hotelId,
      user,
      rating,
      comment
    });

    const savedReview = await newReview.save();

    // Cập nhật số sao mới cho khách sạn
    await updateHotelRating(hotelId);

    const populatedReview = await Review.findById(savedReview._id).populate("user", "username avatar");

    res.status(201).json({ 
      success: true, 
      message: "Đánh giá thành công!",
      data: populatedReview 
    });

  } catch (error) {
    console.error("Lỗi Review:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Admin ghim/bỏ ghim review
export const togglePinReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy review" });
    }

    review.isPinned = !review.isPinned;
    await review.save();

    res.status(200).json({
      success: true,
      message: review.isPinned ? "Đã ghim review lên trang chủ!" : "Đã bỏ ghim review!",
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Lấy các review được ghim cho Trang chủ
export const getPinnedReviews = async (req, res) => {
  try {
    const pinnedReviews = await Review.find({ isPinned: true })
      .populate("user", "username avatar profile")
      .populate("hotel", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pinnedReviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};