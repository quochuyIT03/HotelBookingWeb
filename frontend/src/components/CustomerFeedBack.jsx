import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerFeedBack = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPinnedReviews = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/reviews/pinned");
        if (res.data.success) {
          setReviews(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi fetch review ghim:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPinnedReviews();
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-4xl font-bold mb-12 tracking-tight">Khách hàng nói gì</h2>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {reviews.map((item) => (
            <div key={item._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={item.user?.avatar || "https://i.pravatar.cc/150"}
                  className="w-12 h-12 rounded-full object-cover ring-4 ring-slate-50"
                  alt={item.user?.username}
                />
                <div>
                  <p className="font-bold text-slate-900 text-sm italic">
                    @{item.user?.profile?.fullname || "Ẩn danh"}
                  </p>
                  <div className="text-yellow-400 text-[10px]">
                    {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "{item.comment}"
              </p>
              <p className="mt-3 text-[9px] font-black uppercase text-blue-500 tracking-widest">
                Tại: {item.hotel?.name}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative Image Container */}
        <div className="relative rounded-[3rem] overflow-hidden h-125 shadow-2xl group">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt="Feature"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
            <h3 className="text-white text-3xl font-black mb-4 leading-tight">Khám phá những trải nghiệm thực tế</h3>
            <button className="bg-white text-black px-8 py-3 rounded-2xl font-bold hover:bg-rose-500 hover:text-white transition-colors">
              Xem tất cả khách sạn
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerFeedBack;