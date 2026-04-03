/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Play, ArrowRight, X } from "lucide-react";

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [bgImg, setBgImg] = useState("");

  const heroImages = [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2040",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
  ];

  useEffect(() => {
    setBgImg(heroImages[Math.floor(Math.random() * heroImages.length)]);
  }, []);

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      
      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] scale-100 animate-ken-burns"
        style={{ backgroundImage: `url(${bgImg})` }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/70" />

      {/* Content Layer */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="space-y-8">
          <div className="flex justify-center items-center gap-4 animate-in fade-in zoom-in duration-1000">
             <span className="h-px w-12 bg-rose-400"></span>
             <p className="uppercase tracking-[0.5em] text-[10px] md:text-xs text-white font-bold">
               A New Standard of Luxury
             </p>
             <span className="h-px w-12 bg-rose-400"></span>
          </div>

          <h1 className="text-6xl md:text-9xl font-serif text-white leading-none drop-shadow-2xl">
            Find Your <br />
            <span className="italic font-light text-rose-100">Serene</span> <span className="font-sans font-black opacity-80">ESCAPE</span>
          </h1>

          <p className="text-white/80 text-lg md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">
            Đánh thức giác quan của bạn trong không gian tinh tế, nơi sự sang trọng gặp gỡ sự bình yên.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <button className="group bg-rose-600 text-white px-12 py-5 rounded-full font-bold transition-all hover:bg-white hover:text-black flex items-center gap-3 shadow-2xl active:scale-95">
              <span>EXPLORE NOW</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => setShowVideo(true)}
              className="group flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-10 py-5 rounded-full font-bold hover:bg-white/20 transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                <Play size={16} fill="currentColor" />
              </div>
              <span>WATCH FILM</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- VIDEO MODAL --- */}
      {showVideo && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500">
          <button 
            onClick={() => setShowVideo(false)}
            className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors p-2"
          >
            <X size={40} />
          </button>
          
          <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.pexels.com/video/stunning-night-aerial-view-of-luxurious-hotel-33857285/" 
              title="Luxury Hotel Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/*Mouse Scroll Icon */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;