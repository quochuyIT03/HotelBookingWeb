import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CategoryHotel = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopHotels = async () => {
      try {
        const res = await axios.get(`${window.BASE_URL}/hotels/top-rated`);
        if (res.data.success) {
          setHotels(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi fetch hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopHotels();
  }, []);

  // Hàm format tiền VNĐ cho chuyên nghiệp
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) return <div className="h-60 flex items-center justify-center italic text-gray-400">Đang tìm khách sạn tốt nhất...</div>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Khách sạn được yêu thích nhất</h2>
          <p className="text-muted-foreground mt-2">Dựa trên đánh giá thực tế từ hàng ngàn khách hàng</p>
        </div>
      </div>

      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {hotels.map((hotel) => (
            <CarouselItem key={hotel._id} className="md:basis-1/2 lg:basis-1/4">
              <Link to={`/hotel/${hotel._id}`}>
                <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                  
                  {/* Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.image?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={hotel.name}
                    />
                    <div className="absolute top-3 left-3 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
                      ★ {hotel.rating || "5.0"}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col grow">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
                      {hotel.city}
                    </span>
                    <h3 className="font-bold text-gray-800 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                      {hotel.name}
                    </h3>
                    
                    <div className="mt-auto">
                      <p className="text-xs text-gray-400 line-through">
                        {formatPrice(hotel.cheapestPrice * 1.2)}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-rose-600 font-black text-lg">
                          {formatPrice(hotel.cheapestPrice)}
                        </p>
                        <span className="text-[10px] text-gray-400">/đêm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 hidden md:flex" />
        <CarouselNext className="-right-4 hidden md:flex" />
      </Carousel>
    </section>
  );
};

export default CategoryHotel;