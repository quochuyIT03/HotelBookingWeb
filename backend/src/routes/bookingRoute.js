import express from 'express'
import {addNewBooking, checkAvailability, checkBookingStatus, deleteBooking, getAllBooking, getDetailsBooking, getMyBookings, updateBooking} from '../controllers/bookingController.js'

const router = express.Router(); 

router.get("/check-availability", checkAvailability);

router.get("/", getAllBooking)

router.get("/check-status", checkBookingStatus);

router.get("/:id", getDetailsBooking)

router.post("/", addNewBooking)

router.put("/:id", updateBooking)

router.delete("/:id", deleteBooking)

router.get("/users/:userId", getMyBookings)

export default router
