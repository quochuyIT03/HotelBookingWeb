import express, { Router } from 'express' 
import { getAllFavoriteHotel, toggleFavorite } from '../controllers/favoriteController.js';

const router = express.Router(); 

router.get("/", getAllFavoriteHotel)

router.post("/toggle", toggleFavorite)

export default router;