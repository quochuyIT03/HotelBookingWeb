import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
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
    if (password !== confirmPassword) {
      toast.error("Password không khớp");
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

      toast.success("Đăng kí thành công");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Đăng kí thất bại");
    }
  };

  return (
    <>
      <div className="min-h-screen w-full bg-white relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #000000 40%, #350136 100%)
      `,
            backgroundSize: "100% 100%",
          }}
        />

        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
          <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold text-center text-white">
              Welcome to Booking Hotel
            </h2>

            <p className="text-center text-white/70 mb-8">
              Sign up to your account
            </p>

            <div className="mb-5">
              <Input
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/20 border-none text-white placeholder:text-white/70 h-12"
              />
            </div>

            <div className="mb-5">
              <Input
                placeholder="Full Name"
                onChange={(e) => setFullname(e.target.value)}
                className="bg-white/20 border-none text-white placeholder:text-white/70 h-12"
              />
            </div>

            <div className="mb-5">
              <Input
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/20 border-none text-white placeholder:text-white/70 h-12"
              />
            </div>

            <div className="mb-5">
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
</div>

            <div className="relative mb-5">
              <Input
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/20 border-none text-white placeholder:text-white/70 h-12 pr-10"
              />
              <Eye
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="absolute right-3 top-3 text-white/70 w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="relative mb-5">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/20 border-none text-white placeholder:text-white/70 h-12 pr-10"
              />
              <Eye
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-white/70 w-5 h-5 cursor-pointer"
              />
            </div>

            <div className="flex justify-between text-sm text-white/80 mb-6">
              <label className="flex items-center gap-2">
                Đã có tài khoản?
              </label>

              <span
                onClick={() => (window.location.href = "/login")}
                className="cursor-pointer text-cyan-300"
              >
                Đăng nhập
              </span>
            </div>

            <Button
              onClick={handleRegister}
              className="w-full h-12 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 hover:opacity-90 text-white text-base"
            >
              Sign Up
            </Button>

            <div className="text-center text-white/70 my-6">
              or continue with
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white/20 rounded-lg h-11 flex items-center justify-center gap-2 text-white">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  className="w-5"
                />
                Google
              </button>

              <button className="bg-white/20 rounded-lg h-11 flex items-center justify-center gap-2 text-white">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                  className="w-5"
                />
                GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
