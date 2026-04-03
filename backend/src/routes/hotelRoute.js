import express from "express";
import {
  addNewHotel,
  countHotelByCity,
  deleteHotel,
  getAllHotel,
  getAvailableRoomsByHotel,
  getHotels,
  getOneHotel,
  getTopRatedHotels,
  searchHotels,
  updateHotel,
} from "../controllers/hotelController.js";
import {uploadHotelImages} from '../middlewares/multer.js'

const router = express.Router();

router.get("/search", searchHotels);

router.get("/countHotelByCity", countHotelByCity);

router.get("/top-rated", getTopRatedHotels);

router.get("/", getAllHotel);

router.get("/", getHotels);

router.post("/", uploadHotelImages, addNewHotel)

router.get("/:id", getOneHotel);

router.get("/:id/available-rooms", getAvailableRoomsByHotel);

router.put("/:id", uploadHotelImages, updateHotel);

router.delete("/:id", deleteHotel);



export default router;
