import axios from "axios";

// 1. Lấy URL từ biến môi trường Render, nếu không có thì mới dùng localhost
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const API = axios.create({
    baseURL: BASE_URL, // Dùng biến BASE_URL vừa khai báo ở trên
    withCredentials: true, // Rất quan trọng để gửi/nhận Cookie (nếu có)
});

export const loginUser = (data) => API.post("/auth/login", data); 
export const registerUser = (data) => API.post("/auth/register", data);