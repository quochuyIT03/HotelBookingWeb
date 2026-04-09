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
import cors from 'cors'
import { cloudinary } from "./config/cloudinary.js";
import path from "path"

dotenv.config();

const app = express(); 

// middlewares
app.use(cors({
  // Liệt kê các địa chỉ được phép truy cập
  origin: [
    "http://localhost:5173",                 // Khi chạy máy ảo local
    "https://hotelbookingweb-1.onrender.com" // Khi chạy trên Render
  ],
  credentials: true
}));

if(process.env.NODE_ENV !== "production"){
  app.use(cors({origin: "http://localhost:5173"}))
}

const PORT = process.env.PORT || 5001;

const __dirname = path.resolve(); 

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }))

// Connect tới Database 
connectDatabase().then(() => {
    app.listen(PORT, () => {
    console.log(`Server load on port: %s`, PORT); 
})
})



app.use("/api/users", userRoute);

app.use("/api/hotels", hotelRoute);

app.use("/api/rooms", roomRoute);

app.use("/api/bookings", bookingRoute);

app.use("/api/auth", authRoute); 

app.use("/api/reviews", reviewRoute);

app.use("/api/favorites", favoriteRoute);

app.use("/api/payments", paymentRoute);

app.use((err, req, res, next) => {
  console.error("🔥 REAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message,
    full: err
  });
});

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
})
}