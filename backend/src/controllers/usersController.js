import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary'
import { parse } from "dotenv";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      
    });
    console.error(error)
  }
};

export const getOneUser = async (req, res) => {
  try {
    const detailsUser = await User.findById(req.params.id).select("-password");
    res.status(200).json({
      success: true,
      data: detailsUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      
    });
    console.error(error)
  }
}

export const addNewUser = async (req, res) => {
  try {
    
    // Lấy các trường từ body
    const { username, email, password, role, profile } = req.body;

    // 1. Kiểm tra User tồn tại
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User hoặc Email đã tồn tại!" });
    }

    const finalAvatar = req.file ? req.file.path : req.body.avatar || "";
    console.log("FILES:", req.file);
    console.log("BODY:", req.body);
    // 3. Xử lý Profile
    let finalProfile = {};
    if (profile) {
      finalProfile = typeof profile === 'string' ? JSON.parse(profile) : profile;
    }

    // 4. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Lưu vào Database (Sát với Schema của bạn)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      avatar: finalAvatar, // <--- Đã lưu đúng trường avatar rồi đây!
      profile: finalProfile
    });

    const savedUser = await newUser.save();
    const { password: pw, ...others } = savedUser._doc;

    res.status(201).json({ message: "Tạo user thành công!", data: others });

  } catch (error) {
    console.error("Lỗi Controller:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    // 1. Xử lý Avatar (Ưu tiên File upload, sau đó tới link/base64 body)
    let updatedAvatar = user.avatar;
    if (req.file) {
      updatedAvatar = req.file.path;
    } else if (req.body.avatar) {
      updatedAvatar = req.body.avatar;
    }

    // 2. Xử lý Profile (Gộp dữ liệu cũ và mới để tránh mất field)
    let updatedProfile = user.profile || {};
    if (req.body.profile) {
      const newProfile = typeof req.body.profile === "string" 
        ? JSON.parse(req.body.profile) 
        : req.body.profile;
      
      // Gộp profile cũ và mới để không bị mất các trường không gửi lên
      updatedProfile = { ...updatedProfile, ...newProfile };
    }

    // 3. Xử lý Password
    let updatedPassword = user.password;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(req.body.password, salt);
    }

    // 4. Update Database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username || user.username,
          email: req.body.email || user.email,
          password: updatedPassword,
          role: req.body.role || user.role,
          avatar: updatedAvatar,
          profile: updatedProfile,
        },
      },
      { new: true }
    ).select("-password");

    // QUAN TRỌNG: Trả về updatedUser chứ không phải tên hàm updateUser
    res.status(200).json({
      message: "Cập nhật user thành công!",
      data: updatedUser, // Sửa chỗ này
    });

  } catch (error) {
    console.log("Lỗi Backend:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật!" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user){
      return res.status(404).json({
        message: "Không tồn tại user",
      });
    }
    if(user.role === "superadmin") {
      return res.status(403).json({
        message: "Không được xóa superadmin",
      });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if(!deletedUser){
      return res.status(400).json({message: "Không tồn tại user"})
    }
    res.status(200).json(deletedUser)
    console.log("Đã xóa user thành công!")
  } catch (error) {
    console.error(error); 
    res.status(500).json({message: "Đã có lỗi xảy ra, không xóa được người dùng"}) //cho người dùng đọc 
  }
};

//  // 2. XỬ LÝ AVATAR trong update á 
//     let updatedAvatar = user.avatar;

//     if (req.file) {
//       // 👉 nếu có avatar cũ thì xóa trên cloudinary
//       if (user.avatar) {
//         try {
//           const publicId = user.avatar.split("/").pop().split(".")[0];
//           await cloudinary.uploader.destroy("uploads/" + publicId);
//         } catch (err) {
//           console.log("Không xoá được ảnh cũ:", err.message);
//         }
//       }

//       updatedAvatar = req.file.path;
//     } else if (req.body.avatar) {
//       updatedAvatar = req.body.avatar;
//     }

export const getUserStats = async (req, res) => {
  const userId = req.params.id;

  try {
    // 1. Đếm số đơn đặt phòng của User này
    const bookingCount = await Booking.countDocuments({ user: userId });

    // 2. Đếm số review User này đã viết (nếu bạn có tính năng review)
    const reviewCount = await Review.countDocuments({ user: userId });

    // 3. Lấy số lượng yêu thích (thường nằm trong mảng favorites của Model User)
    const user = await User.findById(userId);
    const favoriteCount = user.favorites ? user.favorites.length : 0;

    res.status(200).json({
      success: true,
      bookings: bookingCount,
      reviews: reviewCount,
      favorites: favoriteCount,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Không thể lấy thống kê" });
  }
};