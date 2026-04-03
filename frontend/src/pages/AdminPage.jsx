import React, { useEffect, useState } from "react";
import { Calendar, DollarSign, Hotel, Users, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";

const AdminPage = () => {
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [hotelRes, bookingRes, userRes] = await Promise.all([
          fetch("http://localhost:5001/api/hotels"),
          fetch("http://localhost:5001/api/bookings"),
          fetch("http://localhost:5001/api/users"),
        ]);
        const hotelData = await hotelRes.json();
        const bookingData = await bookingRes.json();
        const userData = await userRes.json();

        setHotels(hotelData.data || []);
        setBookings(bookingData.data || []);
        setUsers(userData.data || []);
      } catch (error) {
        console.log("Lỗi fetch dữ liệu: ", error);
      }
    };
    fetchAllData();
  }, []);

  const roleUserStat = [
    { name: "Người dùng", value: users.filter((u) => u.role === "user").length, color: "#10b981" },
    { name: "Quản trị viên", value: users.filter((u) => u.role === "admin").length, color: "#3b82f6" },
    { name: "Tổng quản trị", value: users.filter((u) => u.role === "superadmin").length, color: "#f43f5e" },
  ];

  const monthlyData = {};
  bookings.forEach((b) => {
    const month = new Date(b.createdAt).getMonth() + 1;
    monthlyData[month] = (monthlyData[month] || 0) + Number(b.totalPrice || 0);
  });

  const chartData = Object.keys(monthlyData).map((m) => ({
    name: "Tháng " + m,
    price: monthlyData[m],
  }));

  const totalProfit = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="p-8 bg-[#0a0a0c] min-h-screen text-slate-100 font-sans">
      {/* CSS Custom cho thanh cuộn */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}} />

      <header className="mb-10">
        <h1 className="text-4xl font-extralight tracking-tighter text-white">
          BẢNG ĐIỀU KHIỂN <span className="font-bold text-indigo-400">HỆ THỐNG</span>
        </h1>
        <p className="text-slate-400 text-sm mt-2 uppercase tracking-[0.2em] font-medium">Tổng quan hoạt động kinh doanh trực tuyến</p>
      </header>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { title: "Người dùng", value: users.length, icon: Users, color: "from-blue-500 to-indigo-500", trend: "+12%" },
          { title: "Khách sạn", value: hotels.length, icon: Hotel, color: "from-emerald-500 to-teal-500", trend: "+10%" },
          { title: "Đơn đặt phòng", value: bookings.length, icon: Calendar, color: "from-orange-500 to-rose-500", trend: "+22%" },
          { title: "Tổng doanh thu", value: `$${totalProfit.toLocaleString()}`, icon: DollarSign, color: "from-purple-500 to-pink-500", trend: "+32%" },
        ].map((stat, i) => (
          <Card key={i} className="relative overflow-hidden border-white/10 bg-white/4 backdrop-blur-xl rounded-3xl group hover:border-indigo-400/50 transition-all duration-500">
            <CardContent className="p-6">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-linear-to-br ${stat.color} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`} />
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl bg-linear-to-br ${stat.color} text-white shadow-lg`}>
                  <stat.icon size={22} />
                </div>
                <span className="flex items-center text-[11px] font-bold text-emerald-400 bg-emerald-400/20 px-2.5 py-1 rounded-lg uppercase">
                  <TrendingUp size={12} className="mr-1" /> {stat.trend}
                </span>
              </div>
              <div className="mt-5">
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.15em]">{stat.title}</p>
                <p className="text-3xl font-semibold text-white mt-1 tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <Card className="border-white/10 bg-white/3 rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-6">
            <CardTitle className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <ArrowUpRight size={20} className="text-indigo-400" /> Doanh Thu Theo Tháng
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 12, fontWeight: 500}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#ffffff08'}}
                  contentStyle={{ backgroundColor: '#1e1e24', border: '1px solid #ffffff20', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="price" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={40} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/3 rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-6">
            <CardTitle className="text-lg font-semibold text-slate-100">Cơ Cấu Người Dùng</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={roleUserStat} dataKey="value" innerRadius={80} outerRadius={110} paddingAngle={10} stroke="none">
                  {roleUserStat.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e1e24', border: 'none', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-8 mt-4">
              {roleUserStat.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px]">
                  <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.4)]" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT BOOKINGS - CÓ SCROLL */}
        <Card className="border-white/10 bg-[#121214] rounded-[2rem] overflow-hidden shadow-2xl hover:border-indigo-500/30 transition-all flex flex-col h-125">
          <CardHeader className="border-b border-white/10 bg-white/1 px-6 py-5 shrink-0">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="text-indigo-400" size={20} />
              Đặt phòng gần nhất
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto custom-scroll grow">
            <div className="divide-y divide-white/5">
              {bookings.length > 0 ? (
                bookings.map((b) => (
                  <div key={b._id} className="flex items-center justify-between p-6 hover:bg-white/3 transition-all group">
                    <div className="flex items-center gap-4">
                      <img
                        src={b.user?.avatar || `https://ui-avatars.com/api/?name=${b.user?.username || 'U'}&background=random`}
                        className="w-12 h-12 rounded-2xl border-2 border-white/10 shadow-lg object-cover group-hover:scale-105 transition-transform"
                        alt="avatar"
                      />
                      <div>
                        <p className="text-[15px] font-bold text-white">{b?.user?.username || "Khách vãng lai"}</p>
                        <p className="text-xs text-indigo-400 font-bold mt-1 uppercase tracking-wide">{b.room?.roomtype || "Deluxe Room"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-white tracking-tight">${b.totalPrice?.toLocaleString()}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">{new Date(b.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-slate-600 italic">Chưa có đơn hàng nào...</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* HOTEL MANAGEMENT - CÓ SCROLL + STICKY HEADER */}
        <Card className="border-white/10 bg-[#121214] rounded-[2rem] overflow-hidden shadow-2xl hover:border-emerald-500/30 transition-all flex flex-col h-125">
          <CardHeader className="border-b border-white/10 bg-white/1 px-6 py-5 shrink-0">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Hotel className="text-emerald-400" size={20} />
              Quản lý khách sạn
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto custom-scroll grow">
            <table className="w-full relative">
              <thead className="sticky top-0 z-10 bg-[#121214] shadow-sm shadow-black/50">
                <tr className="text-left text-[11px] uppercase tracking-[0.2em] text-slate-500 border-b border-white/10">
                  <th className="p-6 font-bold">Khách sạn</th>
                  <th className="p-6 font-bold text-center">Khu vực</th>
                  <th className="p-6 font-bold text-right">Giá rẻ nhất</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {hotels.length > 0 ? (
                  hotels.map((hotel, index) => (
                    <tr key={hotel._id || index} className="group hover:bg-white/2">
                      <td className="p-6 font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">{hotel.name}</td>
                      <td className="p-6 text-slate-400 text-center font-medium">{hotel.city}</td>
                      <td className="p-6 text-right">
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold font-mono">
                          ${hotel.cheapestPrice}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-10 text-center text-slate-600 italic">Chưa có khách sạn nào...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;