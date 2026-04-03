import Favorite from "../models/Favorite.js";

export const getAllFavoriteHotel = async (req, res) => {
  try {
    const getAllFavorite = await Favorite.find().populate("hotel");
    res.status(200).json({
      success: true,
      count: getAllFavorite.length,
      data: getAllFavorite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { user, hotel } = req.body;
    const exsistingFavorite = await Favorite.findOne({
      user,
      hotel,
    });

    if (exsistingFavorite) {
      await Favorite.findByIdAndDelete(exsistingFavorite._id);
      return res.status(200).json({
        success: true,
        message: "Xóa yêu thích khách sạn",
      });
    }
    const addFavorite = new Favorite({
      user,
      hotel,
    });
    await addFavorite.save();
    res.status(201).json({
      success: true,
      message: "Thêm khách sạn yêu thích thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
