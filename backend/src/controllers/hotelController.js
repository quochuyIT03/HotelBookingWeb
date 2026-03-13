import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";


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
    const getDetailHotel = await Hotel.findById(req.params.id)
    if(!getDetailHotel){
      return res.status(400).json({message: "Không tồn tại hotel cần tìm!"})
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
    const {
      name,
      description,
      address,
      city,
      country,
      cheapestPrice,
      amenities,
    } = req.body;
    const existtingAddress = await Hotel.findOne({ address });
    if (existtingAddress) {
      return res.status(400).json({
        message: "Địa chỉ đã tồn tại!",
      });
    }
    const newHotel = new Hotel({
      name,
      description,
      address,
      city,
      country,
      cheapestPrice,
      amenities,
    });
    const savedHotel = await newHotel.save();
    res.status(201).json({
      success: true,
      data: savedHotel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body, //  $set là update operator của MongoDB. Nó dùng để cập nhật giá trị của field mà không làm mất các field khác.
      },
      {
        new: true,
      },
    );
    if (!updatedHotel) {
      return res.status(400).json({ message: "Hotel không tồn tại" });
    }
    res.status(200).json(updatedHotel);
  } catch (error) {
    console.error(error); //cho dev backend đọc
    res.status(500).json({ message: "System Error" }); //cho người dùng đọc
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
      return Hotel.countDocuments({city: city})
    })
  )
  res.status(200).json({
      success: true, 
      data: list
    })
    } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
  

export const getAvailableRoomsByHotel = async (req, res) => {
  const {checkIn, checkOut} = req.query;

  const start = new Date(checkIn); 
  const end = new Date(checkOut); 
  const rooms = await Room.find({
    hotel:req.params.id
  })

  const availableRooms = rooms.map((room)=>{
    const availableNumbers = room.roomNumbers.filter((roomNumber)=>{
      const isBooked = roomNumber.unavailableDates.some((date) => {
        return date >= start && date <= end
      })
      return !isBooked
    })
    return{
      roomID : room._id,
      roomtype : room.roomtype, 
      availableNumbers
    }
  })
  res.status(200).json({
    success: true, 
    data: availableRooms
  })
}