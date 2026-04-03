import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";


export const getAllHotel = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    console.error(error);
  }
};

export const getOneHotel = async (req, res) => {
  try {
    const getDetailHotel = await Hotel.findById(req.params.id);
    if (!getDetailHotel) {
      return res.status(400).json({ message: "Không tồn tại hotel cần tìm!" });
    }
    return res.status(200).json({
      success: true,
      data: getDetailHotel,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addNewHotel = async (req, res) => {
  try {

    const { name, description, address, city, country, cheapestPrice, amenities } = req.body;

    const imageFiles = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
      req.files?.image5?.[0],
    ].filter(Boolean);

    const imagesUrl = imageFiles.map(file => file.path); // ✅ Cloudinary trả luôn URL

    const existingAddress = await Hotel.findOne({ address });
    if (existingAddress) {
      return res.status(400).json({ message: "Địa chỉ đã tồn tại!" });
    }

    const newHotel = new Hotel({
      name,
      description,
      address,
      city,
      country,
      cheapestPrice: Number(cheapestPrice),
      image: imagesUrl,
      amenities: amenities
        ? typeof amenities === "string"
          ? JSON.parse(amenities)
          : amenities
        : [],
    });

    const saved = await newHotel.save();

    res.status(201).json({ data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel không tồn tại" });
    }

    const imageFiles = [
      req.files?.image1?.[0],
      req.files?.image2?.[0],
      req.files?.image3?.[0],
      req.files?.image4?.[0],
      req.files?.image5?.[0],
    ].filter(Boolean);

    const newImages = imageFiles.map(file => file.path);

    // 👉 nếu có ảnh mới → replace, không thì giữ cũ
    const finalImages = newImages.length > 0 ? newImages : hotel.image;

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          cheapestPrice: Number(req.body.cheapestPrice) || hotel.cheapestPrice,
          image: finalImages,
          amenities: req.body.amenities
            ? typeof req.body.amenities === "string"
              ? JSON.parse(req.body.amenities)
              : req.body.amenities
            : hotel.amenities,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Update hotel thành công",
      data: updatedHotel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!deletedHotel) {
      return res.status(400).json({ message: "Hotel không tồn tại" });
    }
    res.status(200).json(deletedHotel);
    console.log("Xóa khách sạn thành công!");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchHotels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, featured } = req.query;

    const hotels = await Hotel.find({
      city: city ? { $regex: city, $options: "i" } : { $exists: true },
      cheapestPrice: {
        $gte: minPrice || 0,
        $lte: maxPrice || 999999,
      },
      ...(featured && { featured: featured === "true" }),
    });

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const countHotelByCity = async (req, res) => {
  try {
    const cities = req.query.cities.split(",");

    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      }),
    );
    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAvailableRoomsByHotel = async (req, res) => {
  const { checkIn, checkOut } = req.query;

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const rooms = await Room.find({
    hotel: req.params.id,
  });

  const availableRooms = rooms.map((room) => {
    const availableNumbers = room.roomNumbers.filter((roomNumber) => {
      const isBooked = roomNumber.unavailableDates.some((date) => {
        return date >= start && date <= end;
      });
      return !isBooked;
    });
    return {
      roomID: room._id,
      roomtype: room.roomtype,
      availableNumbers,
    };
  });
  res.status(200).json({
    success: true,
    data: availableRooms,
  });
};

export const getHotels = async (req, res) => {
  const { city, checkIn, checkOut } = req.query;

  try {
    let query = {};

    // 1. Lọc theo thành phố (không phân biệt hoa thường)
    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    // 2. Logic nâng cao: Chỉ hiện khách sạn còn phòng trống (Optional)
    // Phần này khó hơn vì bạn phải join với bảng Booking để check 
    // Nếu mới bắt đầu, hãy tập trung lọc theo 'city' trước.

    const hotels = await Hotel.find(query);
    res.status(200).json({ success: true, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopRatedHotels = async (req, res) => {
  try {
    // sort({ averageRating: -1 }): Sắp xếp từ cao xuống thấp
    // limit(8): Chỉ lấy 8 khách sạn hàng đầu
    const hotels = await Hotel.find()
      .sort({ averageRating: -1 }) 
      .limit(8);

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Lỗi khi lấy danh sách khách sạn top rating" 
    });
  }
};