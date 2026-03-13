import User from "../models/User.js";
import bcrypt from "bcryptjs";

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
    const { username, email, password, profile } = req.body;
    const existtingEmail = await User.findOne({email}); 
    if(existtingEmail){
      return res.status(400).json({
        message:"Email đã tồn tại!"
      })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);  //salt là thêm kí tự ngẫu nhiên để ko bị phát hiện khi 2 user trùng 1 password, khi hash trùng password sẽ có chuỗi hash giống nhau. 

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profile,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {username, profile } = req.body; 
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      username, 
      profile
    }, {
      new: true //Trả về giá trị sau update. 
    })
    if(!updatedUser) {
      return res.status(400).json({message: "Không tồn tại user update"})
    }
    res.status(200).json(updatedUser); 
  } catch (error) {
    console.error(error) //cho dev backend đọc 
    res.status(500),json({message: "System Error"}) //cho người dùng đọc 
  }
};

export const deleteUser = async (req, res) => {
  try {
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
