import express from 'express'
import { addNewUser, deleteUser, getAllUser, getOneUser, getUserStats, updateUser } from '../controllers/usersController.js';
import {uploadAvatar} from '../middlewares/multer.js'

const router = express.Router(); 

router.get("/", getAllUser)

router.post("/", uploadAvatar, addNewUser) 

router.get("/:id", getOneUser)

router.put("/:id", uploadAvatar, updateUser)

router.delete("/:id", deleteUser)

router.get("/:id/stats", getUserStats);

export default router;