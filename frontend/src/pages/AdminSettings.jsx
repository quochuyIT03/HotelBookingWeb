import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Check, ChevronRight, ShieldCheck, UserCog, 
  Settings2, Hotel, CreditCard, Code2, 
  History, Database, Sparkles, BellRing, Globe 
} from "lucide-react";

// Import ảnh của Huy
import profileImg from "@/assets/profile.png";
import groupUserImg from "@/assets/groupUsers.png";
import settingsImg from "@/assets/settings.png";
import hotelsImg from "@/assets/hotels.png";
import paymentsImg from "@/assets/payments.png";
import apiImg from "@/assets/api.png";
import warningImg from "@/assets/warning.png";

const AdminSettings = () => {
  const mainSettings = [
    {
      title: "Profile",
      subtitle: "Personal Identity",
      desc: ["Update Bio", "Security Pass", "Avatar"],
      img: profileImg,
      color: "from-blue-500/20 to-cyan-500/20",
      border: "hover:border-blue-500/50",
      icon: <UserCog className="text-blue-400" size={20} />
    },
    {
      title: "Users",
      subtitle: "Team Access",
      desc: ["Roles", "Permissions", "Admin Panel"],
      img: groupUserImg,
      color: "from-emerald-500/20 to-teal-500/20",
      border: "hover:border-emerald-500/50",
      icon: <ShieldCheck className="text-emerald-400" size={20} />
    },
    {
      title: "System",
      subtitle: "Core Engine",
      desc: ["Config", "Notifications", "Region"],
      img: settingsImg,
      color: "from-purple-500/20 to-pink-500/20",
      border: "hover:border-purple-500/50",
      icon: <Settings2 className="text-purple-400" size={20} />
    },
    {
      title: "Hotels",
      subtitle: "Inventory Hub",
      desc: ["Property", "Pricing", "Room Class"],
      img: hotelsImg,
      color: "from-amber-500/20 to-orange-500/20",
      border: "hover:border-amber-500/50",
      icon: <Hotel className="text-amber-400" size={20} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 p-6 md:p-10 space-y-12 font-sans selection:bg-emerald-500/30">
      
      {/* HEADER CỰC CHÁY */}
      <div className="relative space-y-2">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 blur-[100px] rounded-full" />
        <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase flex items-center gap-4">
          <Sparkles className="text-emerald-500 animate-pulse" size={40} /> 
          Settings <span className="text-emerald-500/50 text-2xl not-italic font-mono">/ Control Center</span>
        </h1>
        <p className="text-slate-500 font-mono text-sm tracking-[0.2em] uppercase">Hệ thống quản trị và cấu hình lõi dự án.</p>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        
        {mainSettings.map((item, idx) => (
          <Card key={idx} className={`group relative overflow-hidden bg-[#0f0f12] border border-white/5 rounded-[2.5rem] transition-all duration-500 ${item.border} hover:-translate-y-2 shadow-2xl`}>
            {/* Background Gradient Layer */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <img src={item.img} alt="" className="w-16 h-16 object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-500 rotate-6 group-hover:rotate-0 shadow-2xl" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">{item.subtitle}</p>
                <h3 className="text-2xl font-black text-white uppercase italic">{item.title}</h3>
              </div>

              <ul className="space-y-3">
                {item.desc.map((d, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full" /> {d}
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-white/5 hover:bg-white text-white hover:text-black rounded-xl font-black uppercase text-[10px] tracking-widest border border-white/10 transition-all py-6">
                Configure <ChevronRight size={14} className="ml-2" />
              </Button>
            </div>
          </Card>
        ))}

        {/* CÁC CARD CHỨC NĂNG PHỤ - GLASSMORPHISM */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          
          {/* Payment Card */}
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-white/5 rounded-[2rem] p-8 flex items-center justify-between group hover:border-blue-500/30 transition-all cursor-pointer">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl group-hover:rotate-12 transition-transform">
                <CreditCard size={32} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-tighter text-lg">Payment Gateway</h4>
                <p className="text-slate-500 text-xs font-mono">Visa, Mastercard, MoMo active</p>
              </div>
            </div>
            <img src={paymentsImg} className="h-12 opacity-20 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* API Card */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-white/5 rounded-[2rem] p-8 flex items-center justify-between group hover:border-purple-500/30 transition-all cursor-pointer">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-purple-500/20 text-purple-400 rounded-2xl group-hover:rotate-12 transition-transform">
                <Code2 size={32} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-tighter text-lg">API Connect</h4>
                <p className="text-slate-500 text-xs font-mono">v1.2.0 - 0.5ms latency</p>
              </div>
            </div>
            <img src={apiImg} className="h-12 opacity-20 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Security/Logs Card */}
          <div className="bg-gradient-to-r from-rose-600/20 to-orange-600/20 border border-white/5 rounded-[2rem] p-8 flex items-center justify-between group hover:border-rose-500/30 transition-all cursor-pointer">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-rose-500/20 text-rose-400 rounded-2xl group-hover:rotate-12 transition-transform">
                <History size={32} />
              </div>
              <div>
                <h4 className="text-white font-black uppercase tracking-tighter text-lg">Audit Logs</h4>
                <p className="text-slate-500 text-xs font-mono">Last backup: 2h ago</p>
              </div>
            </div>
            <img src={warningImg} className="h-12 opacity-20 group-hover:opacity-100 transition-opacity" />
          </div>

        </div>
      </div>

      {/* FOOTER BAR TRÔNG CHO NÓ "TECH" */}
      <div className="flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-white/5">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Region: Vietnam (GMT+7)</span>
          </div>
          <div className="flex items-center gap-2">
            <BellRing size={14} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Status: Operational</span>
          </div>
        </div>
        <p className="text-[10px] font-mono text-slate-600 tracking-tighter">HOTEL_CORE_SYSTEM_V.2.0.26</p>
      </div>
    </div>
  );
};

export default AdminSettings;