import { loginUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    if (!email || !password) {
      toast.error("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {

      const res = await loginUser({ email, password });

      // Lấy user từ backend
      const user = res.data.user || res.data.data || res.data;

      // Lưu user
      localStorage.setItem("user", JSON.stringify(user));


      // Lưu token nếu có
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Login thành công!");

      if(user.role === "admin" || user.role === "superadmin"){
        window.location.href = "/admin"
      }else{
        window.location.href = "/";
      }

      

    } catch (error) {

      console.log(error);

      toast.error("Sai email hoặc mật khẩu");

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

            <h2 className="text-3xl font-bold text-center text-white">
              Welcome Back
            </h2>

            <p className="text-center text-white/70 mb-8">
              Sign in to your account
            </p>

            <div className="mb-5">
              <Input
                placeholder="Email Address"
                className="bg-white/20 border-none text-white placeholder:text-white/70 h-12"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative mb-5">
              <Input
                type="password"
                placeholder="Password"
                className="bg-white/20 border-none text-white placeholder:text-white/70 h-12 pr-10"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Eye className="absolute right-3 top-3 text-white/70 w-5 h-5 cursor-pointer"/>
            </div>

            <div className="flex justify-between text-sm text-white/80 mb-6">
              <label className="flex items-center gap-2">
                <input type="checkbox"/>
                Remember me
              </label>

              <span className="cursor-pointer text-cyan-300">
                Forgot password?
              </span>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full h-12 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 hover:opacity-90 text-white text-base"
            >
              Sign In
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

            <p className="text-center text-white/70 mt-6">
              Don't have an account?
              <span
                onClick={() => (window.location.href = "/register")}
                className="text-cyan-300 ml-1 cursor-pointer"
              >
                Sign up
              </span>
            </p>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;