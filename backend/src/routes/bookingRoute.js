import express from 'express'
import {addNewBooking, deleteBooking, getAllBooking, getDetailsBooking, updateBooking} from '../controllers/bookingController.js'

const router = express.Router(); 

router.get("/", getAllBooking)

router.get("/:id", getDetailsBooking)

router.post("/", addNewBooking)

router.put("/:id", updateBooking)

router.delete("/:id", deleteBooking)

export default router
