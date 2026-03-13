import Review from "../models/Review.js";

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllReviewByHotel = async (req, res) => {
  try {

    const reviews = await Review.find({
      hotel: req.params.id
    }).populate("user", "-password");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getAllReviewByRoom = async (req, res) => {
  const reviewByRoom = await Review.find({
    room: req.params.id
    }).populate("user", "-password");

    res.status(200).json({
      success: true,
      count: reviewByRoom.length,
      data: reviewByRoom
    });
};

export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id)
    if (!deletedReview) {
      return res.status(404).json({ message: "Không tìm thấy review để xóa" });
    }
    return res.status(201).json({
      success: true,
      message: "Xóa review thành công!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addNewReview = async (req, res) => {
  try {
    const reviews = new Review(req.body);
    const savedReview = await reviews.save();
    res.status(201).json({
      success: true,
      data: savedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
