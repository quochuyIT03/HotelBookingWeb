import express from 'express'
import { addNewReview, deleteReview, getAllReview, getAllReviewByHotel, getAllReviewByRoom } from '../controllers/reviewController.js';

const router = express.Router(); 

router.get("/", getAllReview); 

router.get("/hotels/:id", getAllReviewByHotel); 

router.get("/rooms/:id", getAllReviewByRoom); 

router.post("/", addNewReview);

router.delete("/:id", deleteReview); 

export default router; 