import express from 'express'
import { addNewRoom, checkRoomAvailability, deleteRoom, getAllRooms, getBookedRooms, getOneRoom, getRoomByHotel, updateRoom } from '../controllers/roomController.js';

const router = express.Router(); 

router.get("/", getAllRooms)

router.post("/", addNewRoom)

router.post("/check-availability", checkRoomAvailability)

router.get("/hotels/:id", getRoomByHotel)

router.get("/:id", getOneRoom)

router.put("/:id", updateRoom)

router.delete("/:id", deleteRoom)

router.post("/booked", getBookedRooms)

export default router;