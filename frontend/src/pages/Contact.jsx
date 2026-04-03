import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Giả lập gửi mail
    setTimeout(() => {
      setLoading(false);
      toast.success("Tin nhắn của bạn đã được gửi đi! Chúng tôi sẽ phản hồi sớm nhất.");
    }, 1500);
  };

  return (
    <div className="bg-[#0c0c0e] min-h-screen text-slate-300">
      <Navbar />

      {/* Hero Section - Tiêu đề trang */}
      <div className="pt-40 pb-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent blur-3xl"></div>
        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-4 relative z-10">
          Liên Hệ <span className="text-indigo-500">Với Luxe</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed relative z-10">
          Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7. Hãy để lại lời nhắn, Luxe sẽ phản hồi trong vòng 30 phút.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group p-8 rounded-[2rem] bg-white/2 border border-white/5 hover:border-indigo-500/30 transition-all duration-500">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <h3 className="text-white font-bold mb-2">Hotline</h3>
                <p className="text-sm text-slate-500">1900 1234</p>
                <p className="text-sm text-slate-500">090 123 4567</p>
              </div>

              <div className="group p-8 rounded-[2rem] bg-white/2 border border-white/5 hover:border-cyan-500/30 transition-all duration-500">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <h3 className="text-white font-bold mb-2">Email</h3>
                <p className="text-sm text-slate-500">support@luxe.com</p>
                <p className="text-sm text-slate-500">info@luxe.com</p>
              </div>
            </div>

            {/* List thông tin chi tiết */}
            <div className="space-y-6 pl-4">
              <div className="flex items-start gap-5">
                <div className="mt-1 p-2 rounded-full bg-white/5 text-slate-400"><MapPin size={18} /></div>
                <div>
                  <p className="text-white font-medium">Địa chỉ văn phòng</p>
                  <p className="text-sm text-slate-500">123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="mt-1 p-2 rounded-full bg-white/5 text-slate-400"><Clock size={18} /></div>
                <div>
                  <p className="text-white font-medium">Giờ làm việc</p>
                  <p className="text-sm text-slate-500">Thứ 2 - Chủ Nhật: 08:00 - 22:00</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="mt-1 p-2 rounded-full bg-white/5 text-slate-400"><Globe size={18} /></div>
                <div>
                  <p className="text-white font-medium">Mạng xã hội</p>
                  <p className="text-sm text-slate-500">facebook.com/luxehotel.official</p>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: FORM LIÊN HỆ */}
          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-r from-indigo-500/10 to-cyan-500/10 rounded-[3rem] blur-2xl"></div>
            <form 
              onSubmit={handleSubmit}
              className="relative bg-white/3 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 space-y-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="text-indigo-500" size={24} />
                <h2 className="text-2xl font-bold text-white tracking-tight">Gửi lời nhắn</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/80 ml-1">Tên của bạn</label>
                  <Input required placeholder="VD: Nguyễn Văn A" className="bg-white/5 border-white/5 h-14 rounded-2xl focus:border-indigo-500/50 text-white placeholder:text-white-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-white/80 ml-1">Địa chỉ Email</label>
                  <Input required type="email" placeholder="email@gmail.com" className="bg-white/5 border-white/5 h-14 rounded-2xl focus:border-indigo-500/50 text-white placeholder:text-white-700" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/80 ml-1">Chủ đề</label>
                <Input placeholder="Bạn cần hỗ trợ về vấn đề gì?" className="bg-white/5 border-white/5 h-14 rounded-2xl focus:border-indigo-500/50 text-white placeholder:text-white-700" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/80 ml-1">Nội dung tin nhắn</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-white-700"
                  placeholder="Viết lời nhắn tại đây..."
                ></textarea>
              </div>

              <Button 
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-[0.2em] transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                {loading ? "Đang gửi..." : (
                  <div className="flex items-center gap-2">
                    Gửi ngay <Send size={16} />
                  </div>
                )}
              </Button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;