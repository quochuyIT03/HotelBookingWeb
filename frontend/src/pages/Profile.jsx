import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Copy, Loader2, User, Phone, MapPin, Mail, ShieldCheck, Star, Heart, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Navbar from "@/components/Navbar";

const Profile = () => {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [username, setUsername] = useState(userData?.username || "");
  const [fullname, setFullname] = useState(userData?.profile?.fullname || "");
  const [phone, setPhone] = useState(userData?.profile?.phone || "");
  const [location, setLocation] = useState(userData?.profile?.location || "");
  const [avatar, setAvatarUrl] = useState(userData?.avatar || "");

  const [stats, setStats] = useState({ bookings: 0, reviews: 0, favorites: 0 });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!userData?._id) return;
    const loadStats = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/users/${userData._id}/stats`);
        setStats({
          bookings: res.data.bookings || 0,
          reviews: res.data.reviews || 0,
          favorites: res.data.favorites || 0
        });
      } catch (err) {
        console.error("Lỗi load stats:", err);
      }
    };
    loadStats();
  }, [userData?._id]);

  if (!userData) return <div className="h-screen flex items-center justify-center font-bold">Vui lòng đăng nhập...</div>;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Ảnh quá lớn, vui lòng chọn ảnh dưới 2MB");

    const reader = new FileReader();
    reader.onloadend = () => setAvatarUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await axios.put(`http://localhost:5001/api/users/${userData._id}`, {
        username,
        avatar,
        profile: { fullname, phone, location }
      });
      if (res.data && res.data.data) {
        const oldStorageData = JSON.parse(localStorage.getItem("user"));
        const finalData = { ...oldStorageData, ...res.data.data };
        localStorage.setItem("user", JSON.stringify(finalData));
        setUserData(finalData);
        toast.success("Hồ sơ đã được cập nhật thành công!");
      }
    } catch (error) {
      console.log(error)
      toast.error("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  const fields = [username, fullname, phone, location, avatar];
  const percent = Math.round((fields.filter(f => f && f !== "").length / fields.length) * 100);

  return (
    <div className="bg-[#0c0c0e] min-h-screen text-slate-200 font-light">
      <Navbar />
      
      <main className="max-w-5xl mx-auto pt-32 pb-20 px-6">
        {/* Header Profile */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/5 pb-12">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-cyan-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative">
                <img
                  src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#0c0c0e] shadow-2xl transition duration-500"
                  alt="avatar"
                />
                <label className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-500 transition-all shadow-lg border-2 border-[#0c0c0e]">
                  <Camera size={16} className="text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tighter">{fullname || username}</h1>
              <div className="flex items-center gap-2 text-slate-500 mt-2 text-sm">
                <ShieldCheck size={16} className="text-cyan-500" />
                <span>Thành viên từ {new Date(userData.createdAt || Date.now()).getFullYear()}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-slate-500">
              <span>Hồ sơ hoàn thiện</span>
              <span>{percent}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-indigo-500 to-cyan-400 transition-all duration-1000"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cột trái: Stats & Info nhanh */}
          <div className="space-y-6">
            <div className="bg-white/3 border border-white/5 rounded-[2rem] p-8 space-y-8">
              <div className="flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400"><BookmarkCheck size={20} /></div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.bookings}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Chuyến đi</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400"><Star size={20} /></div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.reviews}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Đánh giá</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-pink-500/10 text-pink-400"><Heart size={20} /></div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.favorites}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Yêu thích</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 text-center italic text-slate-500 text-sm border border-dashed border-white/10 rounded-2xl">
              "Hãy hoàn thiện thông tin để nhận thêm nhiều ưu đãi đặc biệt từ Luxe Hotel."
            </div>
          </div>

          {/* Cột phải: Form chỉnh sửa */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1 group-focus-within:text-indigo-400 transition-colors">Tên tài khoản</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-white/5 border-white/5 pl-12 h-14 rounded-2xl focus:border-indigo-500/50 transition-all text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Họ và tên</label>
                <Input value={fullname} onChange={(e) => setFullname(e.target.value)} className="bg-white/5 border-white/5 h-14 rounded-2xl focus:border-indigo-500/50 transition-all text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                <Input value={userData.email} disabled className="bg-white/2 border-white/5 pl-12 h-14 rounded-2xl text-white italic cursor-not-allowed" />
                <Copy 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer text-slate-600 hover:text-white transition" 
                  onClick={() => { navigator.clipboard.writeText(userData.email); toast.success("Đã sao chép Email!"); }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="bg-white/5 border-white/5 pl-12 h-14 rounded-2xl focus:border-indigo-500/50 transition-all text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Vị trí hiện tại</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-white/5 border-white/5 pl-12 h-14 rounded-2xl focus:border-indigo-500/50 transition-all text-white" />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="w-full md:w-auto px-12 h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/10 transition-all active:scale-95 disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="animate-spin mr-2" /> : "Cập nhật hồ sơ"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;