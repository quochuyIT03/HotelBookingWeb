import express from 'express'
import { addNewHotel, countHotelByCity, deleteHotel, getAllHotel, getAvailableRoomsByHotel, getOneHotel, searchHotels, updateHotel } from '../controllers/hotelController.js';
import { authorizedRoles } from "../middlewares/authorizedRoles.js";

const router = express.Router(); 

router.get("/search", searchHotels)

router.get("/countHotelByCity", countHotelByCity)

router.get("/", getAllHotel)

router.post("/", authorizedRoles("admin", "superadmin"), addNewHotel)

router.get("/:id", getOneHotel)

router.get("/:id/available-rooms", getAvailableRoomsByHotel)

router.put("/:id", updateHotel)

router.delete("/:id", deleteHotel)



export default router;