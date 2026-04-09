import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  ChevronRight,
  Loader2,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMyBookings = async () => {
      if (!user) {
        toast.error("Vui lòng đăng nhập để xem đơn hàng!");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        // Lưu ý: Thay đổi URL này khớp với API Backend của bạn (ví dụ lấy theo User ID)
        const res = await fetch(
          `${window.BASE_URL}/bookings/users/${user._id}`,
        );
        const data = await res.json();

        if (res.ok) {
          setBookings(data.data || data); // Tùy cấu trúc JSON trả về của bạn
        }
      } catch (error) {
        console.error("Lỗi fetch bookings:", error);
        toast.error("Không thể tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Hàm định dạng ngày tháng cho đẹp
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-rose-500">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-bold">Đang tải chuyến đi của bạn...</p>
      </div>
    );
  }

  const renderStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          label: "Đã xác nhận",
          classes: "bg-emerald-50 text-emerald-600 border-emerald-100",
          icon: <CheckCircle2 size={14} />,
        };
      case "pending":
        return {
          label: "Đang chờ",
          classes: "bg-amber-50 text-amber-600 border-amber-100",
          icon: <Clock size={14} />,
        };
      case "cancelled":
        return {
          label: "Đã hủy",
          classes: "bg-rose-50 text-rose-500 border-rose-100",
          icon: <AlertCircle size={14} />,
        };
      default:
        return {
          label: status || "Chưa rõ",
          classes: "bg-slate-50 text-slate-500 border-slate-100",
          icon: <AlertCircle size={14} />,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-widest mb-2">
              <div className="h-0.5 w-8 bg-rose-500"></div>
              <span>Quản lý lịch trình</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900">
              Chuyến đi của tôi
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            Bạn có {bookings.length} đơn đặt phòng
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
            <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Chưa có chuyến đi nào
            </h2>
            <p className="text-slate-500 mb-8">
              Hãy khám phá các khách sạn tuyệt vời và bắt đầu hành trình của
              bạn.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-rose-500 transition-all shadow-lg"
            >
              Khám phá ngay
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 group"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Ảnh khách sạn */}
                  <div className="lg:w-72 h-56 lg:h-auto relative overflow-hidden">
                    <img
                      src={
                        booking.hotel?.image?.[0] ||
                        "https://placehold.co/600x400?text=Hotel"
                      }
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt="hotel"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-tighter shadow-sm">
                        Phòng {booking.roomNumber}
                      </span>
                    </div>
                  </div>

                  {/* Nội dung chi tiết */}
                  <div className="flex-1 p-8 flex flex-col justify-between gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-rose-500 transition-colors">
                          {booking.hotel?.name || "Khách sạn nghỉ dưỡng"}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                          <MapPin size={14} />
                          <span>
                            {booking.hotel?.city || "Địa điểm chưa cập nhật"}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border ${renderStatus(booking.status).classes}`}
                      >
                        {renderStatus(booking.status).icon}
                        <span>{renderStatus(booking.status).label}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Calendar size={12} /> Nhận phòng
                        </p>
                        <p className="font-bold text-slate-700">
                          {formatDate(booking.checkInDate)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Calendar size={12} /> Trả phòng
                        </p>
                        <p className="font-bold text-slate-700">
                          {formatDate(booking.checkOutDate)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock size={12} /> Loại phòng
                        </p>
                        <p className="font-bold text-slate-700 capitalize">
                          {booking.room?.roomtype || "Standard"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <CreditCard size={12} /> Tổng cộng
                        </p>
                        <p className="font-black text-rose-500 text-lg">
                          ${booking.totalPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyBookings;
