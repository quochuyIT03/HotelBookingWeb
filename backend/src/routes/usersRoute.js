import express from 'express'
import { addNewUser, deleteUser, getAllUser, getOneUser, updateUser } from '../controllers/usersController.js';

const router = express.Router(); 

router.get("/", getAllUser)

router.post("/", addNewUser)

router.get("/:id", getOneUser)

router.put("/:id", updateUser)

router.delete("/:id", deleteUser)

export default router;