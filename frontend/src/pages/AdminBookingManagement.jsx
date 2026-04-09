import { Button } from "@/components/ui/button";
import { 
  Plus, Trash, ChevronLeft, ChevronRight, Loader2, 
  Hotel, CreditCard, X, Search, ArrowUpDown, Filter, Sparkles
} from "lucide-react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "checkInDate", direction: "desc" });

  const [users, setUsers] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomNumbers, setRoomNumbers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [form, setForm] = useState({
    user: "", hotel: "", room: "", roomNumber: "",
    checkInDate: "", checkOutDate: "", totalPrice: 0,
  });

  // --- LOGIC GIỮ NGUYÊN ---
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${window.BASE_URL}/bookings`);
      const data = await res.json();
      setBookings(data.data || []);
    } catch (error) {
      console.log(error)
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    const loadInitialData = async () => {
      const [uRes, hRes] = await Promise.all([
        fetch(`${window.BASE_URL}/users`),
        fetch(`${window.BASE_URL}/hotels`)
      ]);
      const uData = await uRes.json();
      const hData = await hRes.json();
      setUsers(uData.data || []);
      setHotels(hData.data || []);
    };
    loadInitialData();
  }, [fetchBookings]);

  useEffect(() => {
    if (form.room && form.checkInDate && form.checkOutDate) {
      const selectedRoom = rooms.find(r => r._id === form.room);
      const start = new Date(form.checkInDate);
      const end = new Date(form.checkOutDate);
      if (end > start && selectedRoom) {
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        setForm(prev => ({ ...prev, totalPrice: days * selectedRoom.price }));
      } else {
        setForm(prev => ({ ...prev, totalPrice: 0 }));
      }
    }
  }, [form.room, form.checkInDate, form.checkOutDate, rooms]);

  const processedBookings = useMemo(() => {
    let result = [...bookings];
    if (searchTerm) {
      result = result.filter(b => 
        b.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    result.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      if (sortConfig.key === "totalPrice") return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      return sortConfig.direction === "asc" ? new Date(valA) - new Date(valB) : new Date(valB) - new Date(valA);
    });
    return result;
  }, [bookings, searchTerm, sortConfig]);

  // --- PHẦN PHÂN TRANG CẢI TIẾN ---
  const totalPages = Math.ceil(processedBookings.length / itemsPerPage);
  
  const currentBookings = useMemo(() => {
    return processedBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [processedBookings, currentPage]);

  // Reset về trang 1 khi tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSort = (key) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc" }));
  };

  const handleHotelChange = async (hotelId) => {
    setForm(prev => ({ ...prev, hotel: hotelId, room: "", roomNumber: "", totalPrice: 0 }));
    const res = await fetch(`${window.BASE_URL}/rooms/hotels/${hotelId}`);
    const data = await res.json();
    setRooms(data.data || []);
  };

  const handleRoomChange = (roomId) => {
    const selectedRoom = rooms.find((r) => r._id === roomId);
    setForm(prev => ({ ...prev, room: roomId, roomNumber: "" }));
    setRoomNumbers(selectedRoom?.roomNumbers || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa đặt phòng này?")) return;
    const res = await fetch(`${window.BASE_URL}/bookings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBookings(prev => prev.filter((b) => b._id !== id));
      toast.success("Đã xóa dữ liệu thành công");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    await fetch(`${window.BASE_URL}/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
    toast.success("Đã cập nhật trạng thái");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-[#0a0a0c] min-h-screen text-slate-300 font-light tracking-wide">
      
      {/* HEADER HIỆN ĐẠI */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 py-10 px-4 border-b border-white/5">
        <div>
          <h1 className="text-5xl font-extralight text-white tracking-tighter flex items-center gap-4">
            <span className="font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-purple-400 uppercase">Luxe</span>
            BOOKINGS
          </h1>
          <p className="text-slate-500 mt-2 text-sm tracking-[0.2em] uppercase">Hệ thống quản trị tinh giản</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="relative flex-1 min-w-75 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm đơn đặt phòng..."
              className="w-full pl-14 pr-6 py-4 bg-white/3 border border-white/5 rounded-full focus:border-indigo-500/50 outline-none transition-all text-sm text-slate-200 placeholder:text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-none rounded-full px-10 py-7 transition-all active:scale-95 font-bold text-xs tracking-widest shadow-[0_10px_20px_rgba(79,70,229,0.2)]"
          >
            <Plus className="mr-2" size={18} /> TẠO ĐƠN MỚI
          </Button>
        </div>
      </div>

      {/* BỘ LỌC */}
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center gap-8">
          <button onClick={() => handleSort("totalPrice")} className={`text-[10px] tracking-[0.3em] font-bold uppercase transition-all ${sortConfig.key === 'totalPrice' ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}>
            XẾP THEO GIÁ {sortConfig.key === 'totalPrice' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button onClick={() => handleSort("checkInDate")} className={`text-[10px] tracking-[0.3em] font-bold uppercase transition-all ${sortConfig.key === 'checkInDate' ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-400'}`}>
            XẾP THEO NGÀY {sortConfig.key === 'checkInDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
        </div>
        <div className="text-[10px] text-slate-700 tracking-widest font-black uppercase">Dữ liệu trực tuyến v2.0</div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="bg-white/2 rounded-[2rem] border border-white/5 overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} strokeWidth={1.5} />
            <p className="text-[10px] tracking-[0.4em] text-slate-600 uppercase">Đang đồng bộ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-8 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-left">Khách hàng</th>
                  <th className="p-8 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-left">Cơ sở</th>
                  <th className="p-8 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-left">Lịch trình</th>
                  <th className="p-8 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-left">Doanh thu</th>
                  <th className="p-8 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-left">Trạng thái</th>
                  <th className="p-8 text-center w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/2">
                {currentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-white/1 transition-colors group">
                    <td className="p-8">
                      <div className="text-sm font-medium text-white">{b?.user?.username}</div>
                      <div className="text-xs font-medium text-white/30">{b?.user?.profile.fullname}</div>
                    </td>
                    <td className="p-8">
                      <div className="text-sm text-slate-300">{b?.hotel?.name}</div>
                      <div className="text-[9px] text-indigo-400/70 font-bold mt-1 uppercase">Phòng {b.roomNumber}</div>
                    </td>
                    <td className="p-8">
                      <div className="text-xs text-slate-500 font-mono">
                        {new Date(b.checkInDate).toLocaleDateString('vi-VN')} — {new Date(b.checkOutDate).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="text-lg font-light text-white tracking-tight">${b.totalPrice}</div>
                    </td>
                    <td className="p-8">
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateStatus(b._id, e.target.value)}
                        className={`bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer transition-colors
                          ${b.status === "pending" ? "text-amber-500" : b.status === "confirmed" ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        <option value="pending" className="bg-[#121214]">● Chờ duyệt</option>
                        <option value="confirmed" className="bg-[#121214]">● Đã xong</option>
                        <option value="cancelled" className="bg-[#121214]">● Đã hủy</option>
                      </select>
                    </td>
                    <td className="p-8 text-center">
                      <button 
                        onClick={() => handleDelete(b._id)} 
                        className="p-3 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Xóa đơn hàng"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PHẦN PHÂN TRANG MỚI */}
        <div className="p-6 border-t border-white/5 flex justify-between items-center bg-white/1">
          <span className="text-[10px] text-slate-600 tracking-[0.2em] uppercase font-bold">
            Trang {currentPage} / {totalPages || 1}
          </span>
          <div className="flex items-center gap-3">
            <button 
              className="p-2 text-slate-400 hover:text-white disabled:opacity-10 transition-colors" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Render danh sách số trang */}
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all border ${
                    currentPage === i + 1 
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
                    : "border-transparent text-slate-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              className="p-2 text-slate-400 hover:text-white disabled:opacity-10 transition-colors" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DARK GIỮ NGUYÊN */}
      {showForm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-100 p-4 animate-in fade-in duration-300">
          <div className="bg-[#121214] p-12 rounded-[3rem] w-full max-w-2xl border border-white/10 shadow-2xl relative">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-3xl font-extralight text-white tracking-tighter">Chi Tiết <span className="font-bold text-indigo-500">Đặt Phòng</span></h2>
                <p className="text-slate-600 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">Nhập liệu thủ công hệ thống</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 text-slate-600 hover:text-white transition-colors"><X size={28} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {[
                { label: "Tên khách hàng", type: "select", key: "user", data: users, display: "username" },
                { label: "Chọn khách sạn", type: "select", key: "hotel", data: hotels, display: "name", onChange: handleHotelChange },
                { label: "Loại phòng", type: "select", key: "room", data: rooms, display: "roomtype", onChange: handleRoomChange },
                { label: "Số phòng trống", type: "select", key: "roomNumber", data: roomNumbers, display: "number" },
                { label: "Ngày nhận phòng", type: "date", key: "checkInDate" },
                { label: "Ngày trả phòng", type: "date", key: "checkOutDate" }
              ].map((field, i) => (
                <div key={i} className="group border-b border-white/10 pb-2 focus-within:border-indigo-500 transition-all">
                  <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1 block">{field.label}</label>
                  {field.type === "select" ? (
                    <select 
                      className="w-full bg-transparent py-2 text-sm text-slate-200 outline-none cursor-pointer appearance-none"
                      onChange={(e) => field.onChange ? field.onChange(e.target.value) : setForm({ ...form, [field.key]: e.target.value })}
                    >
                      <option value="" className="bg-[#121214]">Chọn thông tin...</option>
                      {field.data?.map((item) => (
                        <option key={item._id || item.number} value={item._id || item.number} className="bg-[#121214]">{item[field.display]}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="date" 
                      className="w-full bg-transparent py-2 text-sm text-slate-200 outline-none scheme-dark"
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}

              <div className="col-span-1 md:col-span-2 flex justify-between items-end mt-6 pt-8 border-t border-white/5">
                <div>
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Tổng doanh thu dự kiến</span>
                  <div className="text-6xl font-extralight text-white mt-2 tracking-tighter">${form.totalPrice}</div>
                </div>
                <div className="pb-2 opacity-20">
                   <CreditCard size={56} strokeWidth={1} />
                </div>
              </div>
            </div>

            <Button className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full py-8 mt-12 text-xs font-bold tracking-[0.3em] uppercase transition-all shadow-[0_15px_30px_rgba(79,70,229,0.4)] border-none">
              Xác Nhận Đặt Phòng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingManagement