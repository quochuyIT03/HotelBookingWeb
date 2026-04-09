import React, { useState, useEffect } from "react"; // Thêm useEffect
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Calendar,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, room } = location.state || {};

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedRoomNum, setSelectedRoomNum] = useState("");
  const [loading, setLoading] = useState(false);

  // Lưu danh sách các số phòng ĐÃ BỊ ĐẶT trong khoảng thời gian đã chọn
  const [bookedNumbers, setBookedNumbers] = useState([]);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // --- 1. LOGIC KIỂM TRA PHÒNG TRỐNG ---
  useEffect(() => {
    const checkAvailability = async () => {
      // Chỉ chạy khi có đủ ngày nhận và ngày trả
      if (checkIn && checkOut) {
        setSelectedRoomNum(""); // Reset số phòng đang chọn khi đổi ngày
        setIsCheckingStatus(true);
        try {
          // SỬA TẠI ĐÂY: rooms -> room (để khớp với req.query của Backend)
          const res = await fetch(
             `${window.BASE_URL}/bookings/check-availability?room=${room._id}&checkIn=${checkIn}&checkOut=${checkOut}`,
          );
          const result = await res.json();

          if (res.ok) {
            // Cập nhật danh sách các số phòng đã bị đặt
            setBookedNumbers(result.bookedNumbers || []);

            // Console log để bạn debug cho dễ
            console.log("Các số phòng đã bị đặt:", result.bookedNumbers);
          }
        } catch (error) {
          console.error("Lỗi kiểm tra phòng trống:", error);
          toast.error("Không thể kiểm tra tình trạng phòng!");
        } finally {
          setIsCheckingStatus(false);
        }
      }
    };
    checkAvailability();
  }, [checkIn, checkOut, room?._id]); // Xóa cái useEffect thừa ở dưới đi nhé

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end - start;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return days > 0 ? days * room.price : 0;
  };

  const handleConfirmBooking = async () => {
    if (!checkIn || !checkOut || !selectedRoomNum) {
      toast.error("Vui lòng chọn đầy đủ ngày và số phòng!");
      return;
    }

    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        toast.error("Vui lòng đăng nhập!");
        return navigate("/login");
      }

      const bookingData = {
        hotel: hotel._id,
        room: room._id,
        roomNumber: selectedRoomNum,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: calculateTotal(),
        user: userData._id,
      };

       const res = await fetch(`${window.BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Đặt phòng thành công!");
        navigate("/my-bookings");
      } else {
        toast.error(result.message || "Đặt phòng thất bại.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  if (!hotel || !room) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Chưa có thông tin thanh toán
        </h2>
        <Button onClick={() => navigate("/")}>Quay lại trang chủ</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h1 className="text-4xl font-black text-slate-900 mb-2">
              Xác nhận & Thanh toán
            </h1>
            <p className="text-slate-500 font-medium">
              Bạn đang đặt phòng tại{" "}
              <span className="text-rose-500 font-bold">{hotel.name}</span>
            </p>
          </section>

          {/* 1. Chọn ngày */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="text-rose-500" size={22} /> 1. Chọn ngày lưu
              trú
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">
                  Ngày nhận phòng
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 ring-rose-500/20"
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">
                  Ngày trả phòng
                </label>
                <input
                  type="date"
                  // Ngày trả phòng ít nhất phải là ngày sau ngày nhận phòng 1 ngày
                  min={
                    checkIn
                      ? new Date(new Date(checkIn).getTime() + 86400000)
                          .toISOString()
                          .split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 ring-rose-500/20"
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 2. Chọn số phòng - PHẦN QUAN TRỌNG */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Check className="text-rose-500" size={22} /> 2. Chọn số phòng
                cụ thể
              </h2>
              {isCheckingStatus && (
                <Loader2 className="animate-spin text-rose-500" size={20} />
              )}
            </div>

            {!checkIn || !checkOut ? (
              <p className="text-amber-600 text-sm font-medium italic bg-amber-50 p-4 rounded-xl">
                * Vui lòng chọn ngày nhận và trả phòng trước để xem các phòng
                còn trống.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {room.roomNumbers
                  // BƯỚC 1: Lọc bỏ những phòng đã bị đặt
                  ?.filter((rn) => !bookedNumbers.includes(rn.number))
                  // BƯỚC 2: Chỉ vẽ ra những phòng còn trống
                  ?.map((rn) => (
                    <button
                      key={rn._id}
                      onClick={() => setSelectedRoomNum(rn.number)}
                      className={`px-6 py-4 rounded-xl font-bold transition-all border-2 ${
                        selectedRoomNum === rn.number
                          ? "border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-200"
                          : "border-slate-100 bg-slate-50 text-slate-600 hover:border-rose-200"
                      }`}
                    >
                      P.{rn.number}
                    </button>
                  ))}

                {/* Hiển thị thông báo nếu lọc xong mà không còn phòng nào trống */}
                {room.roomNumbers?.filter(
                  (rn) => !bookedNumbers.includes(rn.number),
                ).length === 0 && (
                  <p className="text-rose-500 font-medium italic">
                    Rất tiếc, loại phòng này đã hết sạch phòng trống trong
                    khoảng thời gian bạn chọn!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: TỔNG TIỀN */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-8">
            <div className="space-y-4">
              <img
                src={hotel.image?.[0]}
                className="w-full h-40 object-cover rounded-3xl"
                alt=""
              />
              <h3 className="text-xl font-bold">{hotel.name}</h3>
              <p className="text-slate-400 text-sm">
                {room.roomtype} - Tối đa {room.maxPeople} người
              </p>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                <span className="text-rose-400 font-bold">
                  Tổng cộng (
                  {calculateTotal() > 0
                    ? Math.ceil(
                        (new Date(checkOut) - new Date(checkIn)) /
                          (1000 * 60 * 60 * 24),
                      )
                    : 0}{" "}
                  đêm):
                </span>
                <span className="text-3xl font-black">${calculateTotal()}</span>
              </div>
            </div>

            <Button
              onClick={handleConfirmBooking}
              disabled={loading || !selectedRoomNum}
              className="w-full h-16 bg-rose-500 hover:bg-rose-600 rounded-2xl text-lg font-black"
            >
              {loading ? "Đang xử lý..." : "Xác nhận đặt phòng"}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
