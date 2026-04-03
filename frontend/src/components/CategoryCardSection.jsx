import React from "react";
import { Card } from "./ui/card";

const categories = [
  {
    title: "Du Xuân Cầu An",
    desc: "Gửi trọn ước nguyện, đón nhận bình an",
    hotels: "24 khách sạn",
    image: "https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=600&auto=format&fit=crop&q=60",
    tag: "Hot"
  },
  {
    title: "iVIVU Club",
    desc: "Nghỉ dưỡng trọn gói, không còn mệt mỏi",
    hotels: "18 khách sạn",
    image: "https://images.unsplash.com/photo-1568849676085-51415703900f?w=600&auto=format&fit=crop&q=60",
    tag: "New"
  },
  {
    title: "Đổi Gió Dịp Lễ",
    desc: "Đặt sớm còn phòng giá tốt",
    hotels: "100 khách sạn",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=60",
  },
  {
    title: "iVIVU Luxury",
    desc: "Resort hàng đầu thế giới",
    hotels: "28 khách sạn",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&auto=format&fit=crop&q=60",
  },
];

const CategoryCardSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Title Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Phong cách du lịch
          </h2>
          <p className="text-muted-foreground text-lg">
            Khám phá những trải nghiệm du lịch đặc sắc theo sở thích của bạn
          </p>
        </div>
        <button className="hidden md:block text-blue-600 font-semibold hover:underline">
          Xem tất cả phong cách →
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((item, index) => (
          <Card
            key={index}
            className="group relative h-[400px] overflow-hidden rounded-2xl border-none cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            {/* Image with Zoom Effect */}
            <div className="absolute inset-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay Gradient: Đậm hơn ở dưới để nổi bật chữ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Badge (Nếu có) */}
            {item.tag && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                {item.tag}
              </span>
            )}

            {/* Content Area */}
            <div className="absolute inset-x-0 bottom-0 p-6 transform transition-transform duration-500">
              <p className="text-blue-400 text-xs font-bold uppercase mb-2 tracking-widest">
                {item.hotels}
              </p>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                {item.title}
              </h3>
              
              {/* Description: Chỉ hiện rõ khi hover hoặc hiện mờ mờ */}
              <p className="text-white/70 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                {item.desc}
              </p>

              <div className="h-1 w-12 bg-blue-500 rounded-full group-hover:w-full transition-all duration-500" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryCardSection;