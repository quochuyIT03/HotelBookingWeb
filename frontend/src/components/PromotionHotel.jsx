import React from "react";

const PromotionHotel = () => {
  return (
    <section
  className="relative py-24 text-center text-white"
  style={{
    backgroundImage:
      "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>

  {/* overlay */}
  <div className="absolute inset-0 bg-black/40"></div>

  <div className="relative max-w-2xl mx-auto px-6">

    <h2 className="text-3xl font-bold mb-8">
      Nhận ưu đãi khách sạn mới nhất
    </h2>

    <div className="flex bg-white rounded-full overflow-hidden shadow">

      <input
        className="flex-1 px-6 py-4 text-black outline-none"
        placeholder="Nhập email của bạn"
      />

      <button className="bg-blue-500 px-6 text-white">
        Đăng ký
      </button>

    </div>

  </div>
</section>
  );
};

export default PromotionHotel;
