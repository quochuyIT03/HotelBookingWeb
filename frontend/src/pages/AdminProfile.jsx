import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  User, Mail, ShieldCheck, Key, LogOut, 
  LayoutDashboard, Hotel, BookOpen, 
  Camera, CheckCircle, Clock, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [adminData, setAdminData] = useState(null);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setAdminData(user);
  }, []);

  const handleLogout = () => {
    toast.info("Đang đăng xuất...", { duration: 1000 });
    setTimeout(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }, 1500);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    toast.success("Cập nhật hồ sơ thành công!");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-rose-500/30">
      <Toaster position="top-right" richColors theme="dark" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* HEADER SECTION - Glassmorphism style */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-slate-900/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-rose-500/20 ring-4 ring-black">
              <img 
                src={adminData?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"} 
                alt="Admin Avatar"
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-rose-600 text-white p-2.5 rounded-full shadow-xl hover:bg-rose-500 hover:scale-110 transition-all border-2 border-[#020617]">
              <Camera size={16} strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
              <h1 className="text-4xl font-black text-white tracking-tight">{adminData?.username || "Admin Name"}</h1>
              <span className="bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase px-4 py-1.5 rounded-full border border-rose-500/20 tracking-[0.2em]">
                System Admin
              </span>
            </div>
            <p className="text-slate-400 font-medium tracking-wide">Quản lý tối cao hệ thống LuxeHotel</p>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all h-12 px-6" 
              onClick={() => window.location.href='/admin'}
            >
              <LayoutDashboard size={18} className="mr-2 text-rose-500" /> Dashboard
            </Button>
            <Button 
              className="rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20 h-12 px-6" 
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" /> Thoát
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* SIDEBAR TABS */}
          <div className="space-y-3">
            {[
              { id: "profile", label: "Hồ sơ cá nhân", icon: User },
              { id: "stats", label: "Thống kê nhanh", icon: TrendingUp },
              { id: "security", label: "Bảo mật & MK", icon: Key },
              { id: "manage", label: "Phân quyền", icon: ShieldCheck },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-7 py-5 rounded-[2rem] font-bold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? "bg-rose-600 text-white shadow-[0_20px_40px_rgba(225,29,72,0.2)] scale-[1.02]" 
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                }`}
              >
                <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                <span className="tracking-wide text-sm">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-3 bg-slate-900/30 backdrop-blur-sm rounded-[3rem] p-12 border border-white/5 shadow-inner min-h-137.5">
            {activeTab === "profile" && (
              <form onSubmit={handleUpdateProfile} className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-rose-500 tracking-[0.2em] ml-2">Tên hiển thị</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-500 transition-colors" size={20} />
                      <input 
                        type="text" 
                        defaultValue={adminData?.username}
                        className="w-full pl-14 pr-6 py-5 bg-white/5 rounded-[1.5rem] border border-white/5 focus:border-rose-500/50 focus:ring-0 text-white font-medium placeholder:text-slate-600 transition-all outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-rose-500 tracking-[0.2em] ml-2">Email hệ thống</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
                      <input 
                        type="email" 
                        disabled
                        value={adminData?.email}
                        className="w-full pl-14 pr-6 py-5 bg-black/40 rounded-[1.5rem] border border-white/5 font-medium text-slate-500 cursor-not-allowed italic" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-rose-500 tracking-[0.2em] ml-2">Mô tả công việc (Bio)</label>
                  <textarea 
                    rows="4"
                    placeholder="Nhập mô tả ngắn về vai trò quản lý của ông..."
                    className="w-full p-6 bg-white/5 rounded-[2rem] border border-white/5 focus:border-rose-500/50 outline-none focus:ring-0 text-white font-medium resize-none transition-all"
                  ></textarea>
                </div>

                <Button className="h-16 px-12 bg-rose-600 hover:bg-rose-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-rose-900/20 active:scale-95 transition-all">
                  Lưu thay đổi hồ sơ
                </Button>
              </form>
            )}

            {activeTab === "stats" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in zoom-in-95 duration-700">
                {[
                  { icon: Hotel, label: "Hotels Managed", val: "12", color: "text-amber-400", bg: "bg-amber-400/5", border: "border-amber-400/20" },
                  { icon: BookOpen, label: "Daily Bookings", val: "45", color: "text-blue-400", bg: "bg-blue-400/5", border: "border-blue-400/20" },
                  { icon: CheckCircle, label: "Tasks Done", val: "98%", color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/20" }
                ].map((item, i) => (
                  <div key={i} className={`p-8 rounded-[2.5rem] ${item.bg} border ${item.border} hover:scale-105 transition-transform duration-500`}>
                    <div className="bg-slate-950 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl mb-6 border border-white/5">
                      <item.icon className={item.color} size={28} />
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mb-1">{item.label}</p>
                    <h4 className="text-4xl font-black text-white">{item.val}</h4>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "security" && (
              <div className="max-w-md space-y-8 animate-in fade-in duration-700">
                <div className="p-8 rounded-[2rem] bg-white/5 border border-dashed border-white/10 flex items-center gap-6">
                  <div className="p-4 bg-slate-950 rounded-2xl">
                    <Clock className="text-rose-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white tracking-wide">Lần cuối đổi mật khẩu</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">Cách đây 92 ngày</p>
                  </div>
                </div>
                <Button className="w-full h-16 rounded-[1.5rem] border border-white/10 bg-white/5 text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] transition-all">
                  Yêu cầu mã đặt lại mật khẩu
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminProfile;