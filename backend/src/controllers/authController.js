import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    const savedUSer = await newUser.save();

    res.status(201).json({
      success: true,
      data: savedUSer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {

    const user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(404).json({
            message: "User không tồn tại"
        })
    }
    const isMatch = await bcrypt.compare(
        req.body.password,
        user.password
    )
    if(!isMatch){
        return res.status(404).json({
            message: "Sai mật khẩu"
        })
    }
    const token = jwt.sign(
        {
            id: user._id, 
            role: user.role, 
            
            
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    )
    const {password, ...others} = user._doc; //ẩn password khi trả về client
    res.status(200).json({
        success: true, 
        data:others,    
        token,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
