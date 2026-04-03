import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContentArea = () => {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!destination) {
      alert("Vui lòng nhập điểm đến!");
      return;
    }
    // Chuyển hướng kèm theo dữ liệu tìm kiếm trên URL
    navigate(`/hotels?city=${destination}&checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Khám phá những điểm đến tuyệt vời</h1>
      <p className="text-muted-foreground mb-10">Tìm kiếm khách sạn tốt nhất cho kỳ nghỉ của bạn</p>

      <div className="bg-white rounded-2xl shadow-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="border rounded-lg px-4 py-3 outline-none focus:ring-2 ring-blue-500/20"
          placeholder="Bạn muốn đi đâu? (Ví dụ: Da Nang)"
          onChange={(e) => setDestination(e.target.value)}
        />

        <input
          type="date"
          className="border rounded-lg px-4 py-3 outline-none"
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
        />

        <input
          type="date"
          className="border rounded-lg px-4 py-3 outline-none"
          // Ngày trả phòng ít nhất phải sau ngày nhận 1 ngày
          min={dates.checkIn || new Date().toISOString().split("T")[0]} 
          onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
        />

        <button 
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded-lg px-6 py-3 hover:bg-blue-600 font-bold transition-all"
        >
          Tìm kiếm
        </button>
      </div>
    </section>
  );
};

export default ContentArea