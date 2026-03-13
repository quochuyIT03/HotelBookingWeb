import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Kết nối cơ sở dữ liệu thành công!");
  } catch (error) {
    console.error("Có lỗi xảy ra khi kết nối cơ sở dữ liệu", error);
    process.exit(1);
  }
};
