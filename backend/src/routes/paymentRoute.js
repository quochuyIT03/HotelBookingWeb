import express, { Router } from 'express' 
import { addNewPayment, deletePayment, getPaymentByAdmin, getPaymentUser, updatePayment } from '../controllers/paymentController.js';

const router = express.Router(); 

router.get("/", getPaymentByAdmin)

router.get("/", getPaymentUser)

router.post("/", addNewPayment)

router.put("/:id", updatePayment)

router.delete("/:id", deletePayment)

export default router;