/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Star, MapPin, Heart, Wifi, Coffee, Utensils, 
  Zap, Search, ChevronLeft, ChevronRight, Loader2, X 
} from "lucide-react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const HotelPage = () => {
  const [hotels, setHotels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy userId từ localStorage (Huy nhớ check key 'user' trong dự án của mình nhé)
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // PHÂN TRANG & SEARCH STATE
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${window.BASE_URL}/hotels`);
      const data = await res.json();
      setHotels(data.data || []);
    } catch (error) {
      console.error("Lỗi fetch hotels: ", error);
    } finally {
      setLoading(false);
    }
  };

  // --- GỘP THÊM: Lấy danh sách favorite từ DB khi load trang ---
  const fetchUserFavorites = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${window.BASE_URL}/favorites`);
      const result = await res.json();
      if (result.success) {
        // Lọc lấy các ID hotel đã thích của user hiện tại
        const myFavs = result.data
          .filter(f => (f.user?._id || f.user) === userId)
          .map(f => (f.hotel?._id || f.hotel));
        setFavorites(myFavs);
      }
    } catch (err) {
      console.error("Lỗi fetch favorites: ", err);
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchUserFavorites(); // Chạy cùng lúc khi mount
  }, [userId]);

  // --- GỘP THÊM: Sửa lại hàm toggle để gọi API ---
const toggleFavorite = async (id) => {
  if (!userId) {
    toast.error("Vui lòng đăng nhập để lưu khách sạn yêu thích!", {
      description: "Bạn cần có tài khoản để sử dụng tính năng này.",
    });
    return;
  }

  try {
    const res = await fetch(`${window.BASE_URL}/favorites/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, hotel: id }),
    });
    const data = await res.json();

    if (data.success) {
      // Xác định xem là vừa Thêm hay vừa Xóa dựa trên mảng cũ
      const isRemoving = favorites.includes(id);

      setFavorites((prev) =>
        isRemoving ? prev.filter((i) => i !== id) : [...prev, id]
      );

      // Bắn thông báo mượt mà
      if (isRemoving) {
        toast.success("Đã bỏ lưu khách sạn", {
          icon: "💔",
          duration: 2000,
        });
      } else {
        toast.success("Đã thêm vào danh sách yêu thích", {
          icon: "❤️",
          duration: 2000,
        });
      }
    }
  } catch (error) {
    toast.error("Hệ thống đang bận", {
      description: "Không thể cập nhật trạng thái yêu thích lúc này.",
    });
    console.error("Lỗi toggle favorite: ", error);
  }
};

  // LOGIC FILTER & PAGINATION (Giữ nguyên của Huy)
  const filteredHotels = hotels.filter(hotel => 
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const currentItems = filteredHotels.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 450, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-sans">
      <Navbar />

      {/* --- HERO SECTION (Giữ nguyên của Huy) --- */}
      <section className="relative pt-40 pb-32 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 -z-10">
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop" 
            className="w-full h-full object-cover scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-linear-to-b from-slate-950/60 via-transparent to-[#f8fafc]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white mb-6 border border-white/20 uppercase tracking-widest">
            <Zap size={12} className="text-amber-400 fill-amber-400" />
            <span>Limited Summer Deals</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4 leading-tight drop-shadow-xl">
            Tìm nơi dừng chân <br />
            <span className="text-rose-400">Hoàn hảo</span>
          </h1>
          
          <p className="text-white/80 max-w-lg mx-auto mb-10 text-base font-medium leading-relaxed">
            Hơn 2,000+ khách sạn hạng sang đang chờ đợi bạn khám phá.
          </p>
          
          {/* SEARCH BOX (Giữ nguyên của Huy) */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-linear-to-r from-rose-500 to-orange-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl">
              <div className="flex items-center flex-1 px-4 border-r border-slate-100">
                <Search className="text-slate-400 mr-3" size={20} />
                <input 
                  type="text"
                  placeholder="Bạn muốn đi đâu?"
                  value={searchTerm}
                  onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-800 font-medium placeholder:text-slate-400"
                />
              </div>
              <button className="bg-slate-900 hover:bg-rose-600 text-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 active:scale-95 ml-2">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT (Giữ nguyên của Huy) --- */}
      <div className="max-w-7xl mx-auto px-6 pb-24 relative z-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-137.5 bg-white rounded-[3rem] animate-pulse border border-slate-100 shadow-sm" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
              {currentItems.map((hotel) => (
                <div
                  key={hotel._id}
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-[0_40px_80px_rgba(244,63,94,0.12)] transition-all duration-700 hover:-translate-y-4 border border-slate-100 flex flex-col"
                >
                  {/* IMAGE AREA */}
                  <div className="h-70 w-full overflow-hidden relative">
                    <img
                      src={hotel.image?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"}
                      alt={hotel.name}
                      onClick={() => setPreviewImg(hotel.image?.[0])}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 cursor-zoom-in"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* PRICE */}
                    <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur px-5 py-2.5 rounded-2xl shadow-2xl border border-white/20">
                      <span className="text-rose-600 font-black text-2xl">
                        ${hotel.cheapestPrice?.toLocaleString()}
                      </span>
                      <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold ml-1">/ Đêm</span>
                    </div>

                    {/* FAVORITE BUTTON (Đã gộp API) */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(hotel._id); }}
                      className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-90 shadow-lg"
                    >
                      <Heart
                        size={20}
                        className={`transition-colors duration-300 ${
                          favorites.includes(hotel._id) ? "fill-rose-500 text-rose-500" : "text-slate-300"
                        }`}
                      />
                    </button>
                  </div>

                  {/* INFO AREA (Giữ nguyên của Huy) */}
                  <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight line-clamp-1 group-hover:text-rose-600 transition-colors duration-300">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center text-slate-400 gap-1.5">
                          <MapPin size={14} className="text-rose-500" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{hotel.city}</span>
                        </div>
                      </div>
                      <div className="flex items-center bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl shadow-sm">
                        <Star size={14} className="text-amber-500 fill-amber-500 mr-1" />
                        <span className="text-sm font-black text-amber-700">{hotel.rating || "5.0"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-slate-400 py-4 border-y border-slate-50">
                      <div className="flex items-center gap-2"><Wifi size={18} /><span className="text-[10px] font-bold uppercase tracking-tighter">Free Wifi</span></div>  
                      <div className="flex items-center gap-2"><Utensils size={18} /><span className="text-[10px] font-bold uppercase tracking-tighter">Ăn sáng</span></div>
                      <div className="flex items-center gap-2"><Coffee size={18} /><span className="text-[10px] font-bold uppercase tracking-tighter">Cafe</span></div>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 italic">
                      {hotel.description || "Tận hưởng những giây phút thư giãn tuyệt vời với dịch vụ chuẩn 5 sao quốc tế."}
                    </p>

                    <Button 
                      onClick={() => navigate(`/hotel/${hotel._id}`)}
                      className="w-full h-14 bg-slate-900 hover:bg-rose-600 text-white rounded-2xl transition-all duration-500 font-bold uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-200"
                    >
                      Đặt chỗ ngay
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* PHÂN TRANG (Giữ nguyên của Huy) */}
            {totalPages > 1 && (
              <div className="mt-24 flex justify-center items-center gap-3">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-rose-600 disabled:opacity-20 transition-all shadow-sm"
                >
                  <ChevronLeft size={24} />
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`w-14 h-14 rounded-2xl font-black transition-all ${
                      currentPage === idx + 1 
                        ? "bg-rose-600 text-white shadow-2xl scale-110" 
                        : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-rose-600 disabled:opacity-20 transition-all shadow-sm"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL ZOOM (Giữ nguyên của Huy) */}
      {previewImg && (
        <div 
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center z-100 p-6 animate-in fade-in" 
          onClick={() => setPreviewImg(null)}
        >
          <button className="absolute top-10 right-10 text-white/50 hover:text-white">
            <X size={44} strokeWidth={1} />
          </button>
          <img src={previewImg} className="max-w-5xl w-full rounded-[2.5rem] shadow-2xl" alt="Preview" />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HotelPage;