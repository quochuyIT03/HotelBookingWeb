import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react"; // Thêm EyeOff vào đây
import { toast } from "sonner";
import { registerUser } from "@/api/auth";

const Register = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullname, setFullname] = useState("");

  const handleRegister = async () => {
    // 1. Kiểm tra xem có bỏ trống trường nào không
    if (!username || !email || !password || !phone || !fullname) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // 2. Kiểm tra khớp mật khẩu
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await registerUser({
        username,
        email,
        password,
        profile: {
          phone,
          fullname,
        },
      });

      toast.success("Đăng ký thành công! Đang chuyển hướng...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      console.log(error.response?.data);
      // Hiển thị lỗi cụ thể từ backend nếu có (ví dụ: email đã tồn tại)
      const message = error.response?.data?.message || "Đăng ký thất bại";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(125% 125% at 50% 10%, #000000 40%, #350136 100%)`,
          backgroundSize: "100% 100%",
        }}
      />

      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl my-10">
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Welcome to LuxeHotel
          </h2>
          <p className="text-center text-white/70 mb-8">Create your new account</p>

          <div className="space-y-4">
            <Input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/20 border-none text-white placeholder:text-white/70 h-12"
            />

            <Input
              placeholder="Full Name"
              onChange={(e) => setFullname(e.target.value)}
              className="bg-white/20 border-none text-white placeholder:text-white/70 h-12"
            />

            <Input
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/20 border-none text-white placeholder:text-white/70 h-12"
            />

            <Input
              type="text"
              placeholder="Phone number"
              value={phone}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhone(value);
              }}
              className="bg-white/20 border-none text-white placeholder:text-white/70 h-12"
            />

            {/* Password Field */}
            <div className="relative">
              <Input
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/20 border-none text-white placeholder:text-white/70 h-12 pr-10"
              />
              <div 
                className="absolute right-3 top-3 text-white/70 cursor-pointer hover:text-white"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/20 border-none text-white placeholder:text-white/70 h-12 pr-10"
              />
              <div 
                className="absolute right-3 top-3 text-white/70 cursor-pointer hover:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <div className="flex justify-between text-sm text-white/80 my-6">
            <span>Đã có tài khoản?</span>
            <span
              onClick={() => (window.location.href = "/login")}
              className="cursor-pointer text-cyan-300 hover:underline"
            >
              Đăng nhập
            </span>
          </div>

          <Button
            onClick={handleRegister}
            className="w-full h-12 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 hover:opacity-90 text-white font-bold"
          >
            Sign Up
          </Button>

          <div className="text-center text-white/70 my-6 text-sm">or continue with</div>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white/20 hover:bg-white/30 transition-all rounded-lg h-11 flex items-center justify-center gap-2 text-white text-sm">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" className="w-4" alt="Google" />
              Google
            </button>
            <button className="bg-white/20 hover:bg-white/30 transition-all rounded-lg h-11 flex items-center justify-center gap-2 text-white text-sm">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" className="w-4 invert" alt="Github" />
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;