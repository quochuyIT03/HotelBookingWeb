import React from "react";
import { Mail, Phone, MapPin, ArrowRight, Instagram, Facebook, Twitter } from "lucide-react"; // Thêm icon cho sinh động

const Footer = () => {
  return (
    <footer className="relative mt-20 text-white overflow-hidden group">
      {/* Background Image với hiệu ứng zoom nhẹ khi hover vào footer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e)`,
        }}
      />

      {/* Overlay đa tầng: Teal + Dark Gradient để chữ luôn nổi bật */}
      <div className="absolute inset-0 bg-teal-900/60 transition-colors duration-500 group-hover:bg-teal-900/50"></div>
      <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0c] via-transparent to-transparent"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        
        {/* Grid nội dung */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand/Slogan (Tui thêm cột này cho cân bằng layout) */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tighter">
              LUXE<span className="text-teal-400">HOTEL</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Trải nghiệm kỳ nghỉ đẳng cấp với hệ thống đặt phòng thông minh và dịch vụ tận tâm hàng đầu Việt Nam.
            </p>
            <div className="flex gap-4 pt-2">
              <Facebook size={18} className="text-white/50 hover:text-white cursor-pointer transition-colors" />
              <Instagram size={18} className="text-white/50 hover:text-white cursor-pointer transition-colors" />
              <Twitter size={18} className="text-white/50 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Company - Giữ nguyên của ông nhưng thêm hiệu ứng hover lướt qua */}
          <div>
            <h3 className="font-bold mb-6 uppercase text-[11px] tracking-[0.2em] text-teal-400">
              Công ty
            </h3>
            <ul className="space-y-4 text-sm text-white/70">
              {["Về chúng tôi", "Tin tức", "Blog du lịch"].map((item) => (
                <li key={item} className="flex items-center gap-2 hover:text-white hover:translate-x-2 transition-all cursor-pointer group/item">
                   <span className="w-0 h-px bg-teal-400 transition-all group-hover/item:w-4"></span>
                   {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-6 uppercase text-[11px] tracking-[0.2em] text-teal-400">
              Hỗ trợ
            </h3>
            <ul className="space-y-4 text-sm text-white/70">
              {[
                "Trung tâm trợ giúp",
                "Chính sách hoàn tiền",
                "Điều khoản dịch vụ",
                "Chính sách bảo mật"
              ].map((item) => (
                <li key={item} className="hover:text-white hover:translate-x-2 transition-all cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Thêm Icon cho chuyên nghiệp */}
          <div>
            <h3 className="font-bold mb-6 uppercase text-[11px] tracking-[0.2em] text-teal-400">
              Liên hệ
            </h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-teal-400" />
                <span>support@hotelbooking.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-teal-400" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-teal-400" />
                <span>Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="text-xs text-white/40 tracking-widest uppercase">
            © 2026 <span className="text-white/60 font-bold">LUXE HOTEL</span>. All rights reserved.
          </div>

          {/* Nút bấm của ông được nâng cấp nhẹ */}
          <button className="group relative overflow-hidden bg-white text-black px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:pr-14 active:scale-95 shadow-xl shadow-teal-900/20">
            <span className="relative z-10">Khám phá khách sạn</span>
            <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:opacity-100 group-hover:right-6" size={18} />
          </button>

        </div>
      </div>
    </footer>
  );
};

export default Footer;