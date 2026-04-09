/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  Loader2,
  Bed,
  Info,
  Star,
  Send,
  MessageSquare,
  Trash2 // Thêm icon thùng rác cho đẹp
} from "lucide-react";
import { toast } from "sonner";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATES DỮ LIỆU ---
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState("");

  // --- STATES REVIEW ---
  const [hotelReviews, setHotelReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);

  // Lấy User từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // --- 1. FETCH DATA TỔNG HỢP ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const urls = [
          `${window.BASE_URL}/hotels/${id}`,
          `${window.BASE_URL}/rooms/hotels/${id}`,
          `${window.BASE_URL}/reviews/hotels/${id}`
        ];

        if (userId) {
          urls.push(`${window.BASE_URL}/bookings/check-status?user=${userId}&hotel=${id}`);
        }

        const responses = await Promise.all(urls.map(url => fetch(url)));
        if (!responses[0].ok) throw new Error("Không tìm thấy khách sạn");

        const hotelJson = await responses[0].json();
        const roomJson = await responses[1].json();
        const reviewJson = await responses[2].json();

        setHotel(hotelJson.data);
        setSelectedImg(hotelJson.data?.image?.[0] || "");
        setRooms(roomJson.data || []);
        setHotelReviews(reviewJson.data || []);

        if (userId && responses[3]) {
          const checkBooking = await responses[3].json();
          setCanReview(checkBooking.hasBooked); 
        } else {
          setCanReview(false);
        }
      } catch (error) {
        console.error("Lỗi fetch dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, userId]);

  // --- 2. HÀM XỬ LÝ BOOKING ---
  const handleBooking = () => {
    if (!selectedRoom) {
      toast.warning("Vui lòng chọn loại phòng bạn muốn đặt!");
      return;
    }
    navigate("/checkout", { state: { hotel, room: selectedRoom } });
  };

  // --- 3. HÀM XỬ LÝ ĐĂNG REVIEW ---
const handlePostReview = async (e) => {
  e.preventDefault();
  if (!userId) return toast.warning("Vui lòng đăng nhập để đánh giá!");
  
  setSubmitting(true);
  try {
    const response = await fetch(`${window.BASE_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotel: id,
        user: userId,
        rating: newRating,
        comment: newComment
      })
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("Cảm ơn bạn đã đánh giá!");
      setNewComment("");
      setNewRating(5);

      // --- KHÚC QUAN TRỌNG ĐỂ NHẢY SỐ SAO ---
      const resReviews = await fetch(`${window.BASE_URL}/reviews/hotels/${id}`);
      const jsonReviews = await resReviews.json();
      setHotelReviews(jsonReviews.data || []);

      // 2. Lấy lại thông tin Hotel mới nhất (để lấy cái 'rating' vừa được Backend tính lại)
      const resHotel = await fetch(`${window.BASE_URL}/hotels/${id}`);
      const jsonHotel = await resHotel.json();
      if (jsonHotel.success) {
        setHotel(jsonHotel.data); // Cập nhật state hotel -> UI tự render lại số sao mới
      }

    } else {
      toast.error(result.message || "Không thể đăng đánh giá.");
    }
  } catch (err) {
    console.error(err);
    toast.error("Đã xảy ra lỗi khi gửi đánh giá.");
  } finally {
    setSubmitting(false);
  }
};

  // --- 4. HÀM XỬ LÝ XÓA REVIEW ---
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) return;

    try {
      const response = await fetch(`${window.BASE_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId })
      });

      if (response.ok) {
        toast.success("Xóa đánh giá thành công")
        // Cập nhật mảng review tại chỗ để UI thay đổi ngay
        setHotelReviews(prev => prev.filter(rev => rev._id !== reviewId));
        
        // Cập nhật lại thông số khách sạn (số sao trung bình)
        const resHotel = await fetch(`${window.BASE_URL}/hotels/${id}`);
        const hotelJson = await resHotel.json();
        setHotel(hotelJson.data);
      } else {
        const result = await response.json();
        toast(result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa đánh giá.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-rose-500 bg-white">
        <Loader2 className="animate-spin" size={48} />
        <p className="font-bold animate-pulse text-lg">Đang tải thông tin khách sạn...</p>
      </div>
    );
  }

  if (!hotel) return <div className="text-center py-40 font-bold text-slate-500">Khách sạn không tồn tại.</div>;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      {/* --- GALLERY SECTION --- */}
      <div className="pt-28 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-75 md:h-137.5">
          <div className="md:col-span-3 rounded-[2.5rem] overflow-hidden shadow-2xl relative border-4 border-white group">
            <img
              src={selectedImg || "https://placehold.co/1200x800?text=Hotel+Image"}
              alt={hotel.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
          </div>

          <div className="hidden md:flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {hotel.image?.map((img, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setSelectedImg(img)}
                className={`aspect-video rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                  selectedImg === img ? "border-rose-500 ring-2 ring-rose-200" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          {/* Header & Description */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest mb-4">
              <div className="h-0.5 w-8 bg-rose-500"></div>
              <span>Chi tiết nơi lưu trú</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-6">{hotel.name}</h1>
            <div className="flex items-center gap-3 text-slate-600 bg-white w-fit px-5 py-3 rounded-full shadow-sm border border-slate-100">
              <MapPin size={20} className="text-rose-500" />
              <span className="font-semibold text-lg">{hotel.address}, {hotel.city}</span>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Info size={24} className="text-rose-500" /> Về khách sạn này
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg font-light">
              {hotel.description || "Tận hưởng không gian nghỉ dưỡng tuyệt vời với tiện nghi hiện đại."}
            </p>
          </section>

          {/* Rooms Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Bed size={24} className="text-rose-500" /> Các loại phòng trống
            </h2>
            <div className="grid gap-4">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <div
                    key={room._id}
                    onClick={() => setSelectedRoom(room)}
                    className={`group p-6 rounded-[2.5rem] border-2 transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between items-center gap-6 ${
                      selectedRoom?._id === room._id
                        ? "border-rose-500 bg-rose-50/50 shadow-xl shadow-rose-100/50"
                        : "border-slate-100 bg-white hover:border-rose-200 shadow-sm"
                    }`}
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="bg-slate-900 text-white text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-widest">
                          {room.roomtype}
                        </span>
                        <h4 className="text-2xl font-bold text-slate-800 capitalize">{room.description || "Phòng nghỉ"}</h4>
                      </div>
                      <div className="flex gap-6 text-slate-500 text-sm font-medium">
                        <div className="flex items-center gap-1.5"><Users size={18} /> Tối đa {room.maxPeople} người</div>
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold"><CheckCircle2 size={18} /> Khả dụng</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-slate-900">${room.price}<span className="text-sm font-normal text-slate-400">/đêm</span></p>
                      <div className={`mt-3 w-8 h-8 rounded-full border-2 flex items-center justify-center ml-auto transition-all ${
                        selectedRoom?._id === room._id ? "border-rose-500 bg-rose-500" : "border-slate-200"
                      }`}>
                        {selectedRoom?._id === room._id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                    </div>
                  </div>
                ))
              ) : <p className="text-slate-400 italic text-center p-10 border rounded-3xl">Hiện không còn phòng trống.</p>}
            </div>
          </section>

          {/* Reviews Section */}
          <section className="space-y-10 border-t pt-16">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <MessageSquare size={32} className="text-rose-500" /> 
                Đánh giá ({hotelReviews.length})
              </h2>
              <div className="flex items-center gap-1 bg-yellow-100 px-4 py-2 rounded-full text-yellow-700 font-bold">
                <Star size={18} fill="currentColor" /> {hotel?.averageRating || hotel?.rating || "0.0"}
              </div>
            </div>

            <div className="grid gap-6">
              {hotelReviews.length > 0 ? (
                hotelReviews.map((rev) => (
                  <div key={rev._id} className="relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm animate-in fade-in group">
                    
                    {/* NÚT XÓA: CHỈ HIỆN KHI LÀ REVIEW CỦA CHÍNH HUY */}
                    {userId && rev.user?._id === userId && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReview(rev._id);
                        }}
                        className="absolute top-8 right-8 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all duration-300"
                        title="Xóa đánh giá của bạn"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}

                    <div className="flex items-center gap-4 mb-4">
                      <img src={rev.user?.avatar || "https://i.pravatar.cc/150"} className="w-12 h-12 rounded-full border-2 border-rose-100 object-cover" alt="user" />
                      <div>
                        <p className="font-bold text-slate-900">
                          {rev.user?._id === userId ? "Bạn (đã đánh giá)" : (rev.user?.username || "Người dùng ẩn danh")}
                        </p>
                        <p className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div className="ml-auto flex text-yellow-400 gap-0.5 mr-8">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-slate-200"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed">
                  <p className="text-slate-400 italic">Chưa có đánh giá nào cho khách sạn này.</p>
                </div>
              )}
            </div>

            {/* FORM POST REVIEW */}
            {!userId ? (
              <div className="bg-white p-10 rounded-[3rem] border border-dashed flex flex-col items-center gap-4">
                <p className="text-slate-500 font-medium">Đăng nhập ngay để chia sẻ trải nghiệm của bạn!</p>
                <Button onClick={() => navigate("/login")} className="bg-rose-500">Đăng nhập</Button>
              </div>
            ) : canReview ? (
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Để lại đánh giá của bạn</h3>
                    <p className="text-slate-400 text-sm">Chia sẻ trải nghiệm của bạn để giúp mọi người chọn được chỗ nghỉ tốt nhất.</p>
                  </div>
                  <form onSubmit={handlePostReview} className="space-y-6">
                    <div className="flex gap-3 bg-white/5 w-fit p-3 rounded-2xl border border-white/10">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} size={32} 
                          onClick={() => setNewRating(s)}
                          className={`cursor-pointer transition-all hover:scale-110 ${newRating >= s ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`} 
                        />
                      ))}
                    </div>
                    <textarea 
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-5 text-sm focus:ring-2 focus:ring-rose-500 outline-none min-h-30 transition-all"
                      placeholder="Hãy nói gì đó về dịch vụ, không gian..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                    <Button 
                      disabled={submitting} 
                      className="bg-rose-500 hover:bg-rose-600 text-white w-full h-14 rounded-2xl font-black text-lg shadow-lg shadow-rose-500/20 transition-all flex gap-2 justify-center"
                    >
                      {submitting ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Gửi đánh giá ngay</>}
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100 flex flex-col items-center text-center gap-3">
                <div className="p-3 bg-white rounded-full text-rose-500 shadow-sm"><ShieldCheck size={32} /></div>
                <h4 className="font-bold text-rose-900 uppercase tracking-tighter">Quyền đánh giá bị giới hạn</h4>
                <p className="text-rose-700/70 text-sm max-w-sm">
                  Chỉ những khách hàng đã hoàn thành đặt phòng tại {hotel.name} mới có thể để lại bình luận.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Cột Phải */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50 space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Giá thấp nhất từ</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-900">
                  ${selectedRoom ? selectedRoom.price : hotel.cheapestPrice}
                </span>
                <span className="text-slate-400 font-medium">/ đêm</span>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium flex items-center gap-2"><Calendar size={18}/> Loại phòng:</span>
                <span className="font-bold text-slate-900 capitalize text-right">{selectedRoom?.roomtype || "Chưa chọn"}</span>
              </div>
              <div className="h-px bg-slate-200 w-full" />
              <div className="flex justify-between items-center font-bold text-rose-600">
                <span className="text-lg">Tạm tính:</span>
                <span className="text-2xl">${selectedRoom ? selectedRoom.price : 0}</span>
              </div>
            </div>
            <Button 
              onClick={handleBooking}
              disabled={!selectedRoom}
              className={`w-full h-16 rounded-2xl text-lg font-black transition-all duration-300 flex items-center justify-center gap-2 shadow-xl active:scale-95 ${
                selectedRoom ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              {selectedRoom ? "Xác nhận đặt phòng" : "Chọn phòng để đặt"}
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HotelDetails;