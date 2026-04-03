import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Users, Award, Globe, Heart, 
  ChevronRight, Sparkles, ShieldCheck, Map, 
  Hotel
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
  const stats = [
    { label: "Khách hàng hài lòng", value: "50K+", icon: Heart },
    { label: "Khách sạn đối tác", value: "1,200+", icon: Hotel },
    { label: "Quốc gia hiện diện", value: "25+", icon: Globe },
    { label: "Giải thưởng đạt được", value: "150+", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans overflow-x-hidden">
      <Navbar />

      {/* --- HERO SECTION: HIỆU ỨNG GRADIENT BLUR --- */}
      <section className="relative pt-40 pb-20 flex items-center justify-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-rose-600/10 blur-[120px] rounded-full opacity-50 -z-10" />
        
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-black text-rose-500 mb-8 border border-white/10 uppercase tracking-[0.3em] animate-bounce">
            <Sparkles size={14} />
            <span>Since 2024 • Shaping the Future</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
            Định nghĩa lại <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-rose-500 via-orange-400 to-rose-600 animate-gradient-x">
              Sự Sang Trọng
            </span>
          </h1>
          
          <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg font-medium leading-relaxed">
            LuxeHotel không chỉ là một nền tảng đặt phòng. Chúng tôi là người đồng hành, 
            giúp bạn tìm thấy những khoảnh khắc nghỉ dưỡng đẳng cấp nhất trên toàn thế giới.
          </p>
        </div>
      </section>

      {/* --- STORY SECTION: BỐ CỤC ĐỐI XỨNG --- */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-linear-to-r from-rose-600 to-orange-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" 
                alt="Luxury Hotel"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
            {/* Thẻ nổi Overlay */}
            <div className="absolute -bottom-10 -right-10 bg-slate-900/90 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl hidden md:block animate-in slide-in-from-right-10 duration-1000">
              <p className="text-rose-500 font-black text-4xl mb-1">100%</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Dịch vụ 5 sao</p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-black text-white leading-tight">
              Sứ mệnh của chúng tôi là <br /> 
              mang lại trải nghiệm vô tận.
            </h2>
            <div className="space-y-6">
              {[
                { title: "Minh bạch tuyệt đối", desc: "Mọi thông tin giá cả và dịch vụ đều được xác thực 100%.", icon: ShieldCheck },
                { title: "Hỗ trợ 24/7", desc: "Đội ngũ chuyên gia luôn sẵn sàng giải quyết mọi vấn đề của bạn.", icon: Users },
                { title: "Dấu ấn toàn cầu", desc: "Mạng lưới khách sạn trải dài hơn 200 thành phố lớn.", icon: Map },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION: COUNTER STYLE --- */}
      <section className="py-24 bg-white/2 border-y border-white/5 shadow-inner">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((s, idx) => (
              <div key={idx} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-rose-600/10 text-rose-500 mb-6 group-hover:scale-110 transition-transform">
                  <s.icon size={32} />
                </div>
                <h3 className="text-5xl font-black text-white mb-2">{s.value}</h3>
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="max-w-5xl mx-auto px-6 py-32 text-center">
        <div className="bg-linear-to-br from-rose-600 to-orange-600 rounded-[3rem] p-16 relative overflow-hidden group shadow-[0_40px_100px_rgba(225,29,72,0.3)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20" />
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 relative z-10 leading-tight">
            Sẵn sàng trải nghiệm <br /> kỷ nguyên nghỉ dưỡng mới?
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Button className="h-16 px-10 bg-white text-rose-600 hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl">
              Khám phá ngay
            </Button>
            <Button variant="outline" className="h-16 px-10 border-white/20 bg-transparent text-white hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
              Liên hệ chúng tôi <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;