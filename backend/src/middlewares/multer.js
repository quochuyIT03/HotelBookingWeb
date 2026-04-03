import multer from 'multer';
import { storage } from '../config/cloudinary.js';

const upload = multer({ storage: storage });

export const uploadAvatar = upload.single("avatar");

export const uploadHotelImages = upload.fields([
  { name: "image1", maxCount: 1 }, 
  { name: "image2", maxCount: 1 }, 
  { name: "image3", maxCount: 1 }, 
  { name: "image4", maxCount: 1 }, 
  { name: "image5", maxCount: 1 }, 
])