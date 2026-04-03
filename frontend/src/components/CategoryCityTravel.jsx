import React from "react";
import { Card } from "@/components/ui/card";

const cities = [
  { name: "Phú Quốc", hotels: 920, img: "https://images.unsplash.com/photo-1730714103959-5d5a30acf547", grid: "col-span-2" },
  { name: "Vũng Tàu", hotels: 705, img: "https://images.unsplash.com/photo-1623596711744-c10ed15581d9", grid: "row-span-2" },
  { name: "Đà Lạt", hotels: 1180, img: "https://images.unsplash.com/photo-1558338475-7ac335028946", grid: "" },
  { name: "Quy Nhơn", hotels: 333, img: "https://images.unsplash.com/photo-1669170451762-6584c2e22c3c", grid: "" },
  { name: "Nha Trang", hotels: 1023, img: "https://images.unsplash.com/photo-1689326232193-d55f0b7965eb", grid: "row-span-2" },
  { name: "Đà Nẵng", hotels: 1358, img: "https://images.unsplash.com/photo-1588411393236-d2524cca1196", grid: "col-span-2" },
  { name: "Ninh Bình", hotels: 499, img: "https://images.unsplash.com/photo-1709064159097-91b634741c96", grid: "" },
  { name: "Lào Cai", hotels: 18, img: "https://images.unsplash.com/photo-1573617639674-f61838e6f8d3", grid: "" },
];

const CategoryCityTravel = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900">Điểm đến nổi bật</h2>
        <p className="text-lg text-muted-foreground mt-2">
          Những địa điểm du lịch hàng đầu Việt Nam đang chờ bạn khám phá
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[220px] gap-6">
        {cities.map((city, index) => (
          <Card
            key={index}
            className={`relative overflow-hidden border-none group cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ${city.grid}`}
          >
            {/* Ảnh nền */}
            <img
              src={city.img}
              alt={city.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Lớp phủ Gradient mượt hơn */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

            {/* Nội dung */}
            <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-500 group-hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">
                {city.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="h-1 w-8 bg-blue-500 rounded-full transition-all duration-500 group-hover:w-16" />
                <p className="text-sm text-gray-200 font-medium">{city.hotels} khách sạn</p>
              </div>
            </div>
            
            {/* Hiệu ứng overlay khi hover (glassmorphism nhẹ) */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryCityTravel;