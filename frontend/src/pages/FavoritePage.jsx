/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, MapPin, Star, Trash2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Giả sử lấy userId từ localStorage sau khi login
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      // Lưu ý: Nếu Backend của ông chưa lọc theo User, hãy truyền query hoặc header nhé
      const res = await fetch(`${window.BASE_URL}/favorites`);
      const result = await res.json();
      
      if (result.success) {
        // Lọc lại những favorites thuộc về user hiện tại (nếu backend chưa làm)
        const myFavorites = result.data.filter(item => item.user === userId || item.user?._id === userId);
        setFavorites(myFavorites);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách yêu thích:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchFavorites();
  }, [userId]);

const removeFavorite = async (hotelId) => {
  // Tạo một cái "promise" để toast nó chạy hiệu ứng loading trong khi chờ API (nếu muốn cực chuyên nghiệp)
  // Hoặc dùng cách đơn giản bên dưới:

  try {
    const res = await fetch(`${window.BASE_URL}/favorites/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, hotel: hotelId }),
    });
    
    const data = await res.json();

    if (data.success) {
      // 1. Cập nhật UI ngay lập tức
      setFavorites(prev => prev.filter(item => (item.hotel._id || item.hotel) !== hotelId));

      // 2. Bắn toast thông báo
      toast.success("Đã xóa khỏi danh sách yêu thích", {
        description: "Khách sạn này sẽ không còn xuất hiện trong bộ sưu tập của bạn.",
        icon: "🗑️", // Icon thùng rác cho đúng ngữ cảnh xóa
        duration: 3000,
      });
    } else {
      toast.error("Không thể xóa khách sạn", {
        description: data.message || "Đã có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  } catch (error) {
    console.error("Lỗi xóa yêu thích:", error);
    toast.error("Lỗi kết nối server", {
      description: "Vui lòng kiểm tra lại đường truyền internet của ông nhé!",
    });
  }
};

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans">
      <Navbar />

      {/* Header Section */}
      <div className="pt-32 pb-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">My Favorites</h1>
          <p className="text-slate-400 tracking-[0.2em] uppercase text-xs">Danh sách khách sạn bạn đã yêu thích</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-rose-500" size={40} />
            <p className="text-slate-400 italic">Đang tải danh sách của bạn...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {favorites.map((item) => {
              const hotel = item.hotel;
              if (!hotel) return null; // Tránh lỗi nếu dữ liệu hotel bị null

              return (
                <div 
                  key={item._id}
                  className="group bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-2xl transition-all duration-500"
                >
                  {/* Image Area */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={hotel.image?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"} 
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => removeFavorite(hotel._id)}
                      className="absolute top-5 right-5 bg-white/90 backdrop-blur-md p-3 rounded-2xl text-slate-400 hover:text-rose-600 hover:scale-110 transition-all shadow-lg"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="absolute bottom-5 left-5 bg-white px-4 py-2 rounded-xl shadow-lg">
                       <span className="text-rose-600 font-bold text-lg">${hotel.cheapestPrice}</span>
                       <span className="text-[10px] text-slate-400 uppercase font-bold ml-1">/ Night</span>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-rose-600 transition-colors">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center text-slate-400 mt-1 gap-1">
                          <MapPin size={14} className="text-rose-500" />
                          <span className="text-xs font-medium tracking-wide">{hotel.city}</span>
                        </div>
                      </div>
                      <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                        <Star size={14} className="fill-amber-500 text-amber-500 mr-1" />
                        <span className="text-xs font-bold text-amber-700">{hotel.rating || "5.0"}</span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-sm line-clamp-2 italic font-light">
                      {hotel.description || "Một không gian tuyệt vời để bạn tận hưởng kỳ nghỉ mơ ước cùng người thân."}
                    </p>

                    <Button 
                      onClick={() => navigate(`/hotel/${hotel._id}`)}
                      className="w-full bg-slate-900 hover:bg-rose-600 text-white rounded-xl py-6 transition-all duration-300 font-bold tracking-widest text-xs"
                    >
                      VIEW DETAILS <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-32 space-y-6 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Heart size={40} className="text-slate-200" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">Chưa có khách sạn yêu thích</h2>
              <p className="text-slate-400 max-w-xs mx-auto">Hãy khám phá các điểm đến và lưu lại những nơi bạn muốn ghé thăm.</p>
            </div>
            <Button 
              onClick={() => navigate("/hotels")}
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 rounded-full"
            >
              Khám phá ngay
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default FavoritePage;