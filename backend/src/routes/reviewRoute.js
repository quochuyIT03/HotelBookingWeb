import express from 'express'
import { addNewReview, deleteReview, getAllReview, getAllReviewByHotel, getAllReviewByRoom, getPinnedReviews, togglePinReview } from '../controllers/reviewController.js';

const router = express.Router(); 

router.get("/", getAllReview); 

router.get("/hotels/:id", getAllReviewByHotel); 

router.get("/rooms/:id", getAllReviewByRoom); 

router.post("/", addNewReview);

// Route dành cho trang chủ (Public)
router.get("/pinned", getPinnedReviews);

// Route dành cho Admin (Cần có thêm middleware verifyAdmin ở đây nết tốt)
router.patch("/pin/:id", togglePinReview);

router.delete("/:id", deleteReview); 

export default router; 