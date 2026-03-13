import express from "express";
import userRoute from './routes/usersRoute.js'
import hotelRoute from './routes/hotelRoute.js'
import roomRoute from './routes/roomRoute.js'
import bookingRoute from './routes/bookingRoute.js'
import authRoute from './routes/authRoute.js'
import reviewRoute from './routes/reviewRoute.js'
import favoriteRoute from './routes/favoriteRoute.js'
import paymentRoute from './routes/paymentRoute.js'
import { connectDatabase } from "./config/db.js";
import dotenv from 'dotenv'

dotenv.config();
const app = express(); 
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use("/api/users", userRoute);

app.use("/api/hotels", hotelRoute);

app.use("/api/rooms", roomRoute);

app.use("/api/bookings", bookingRoute);

app.use("/api/auth", authRoute); 

app.use("/api/reviews", reviewRoute);

app.use("/api/favorites", favoriteRoute);

app.use("/api/payments", paymentRoute);

connectDatabase().then(() => {
    app.listen(PORT, () => {
    console.log(`Server load on port: %s`, PORT); 
})
})
