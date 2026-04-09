import React, { useEffect, useState } from "react";
import { MenuIcon, LogOut, User, Calendar, LayoutDashboard, Heart } from "lucide-react"; // Thêm icon cho menu thêm xinh
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Hiệu ứng đổi màu nhẹ khi cuộn trang cho thêm phần chuyên nghiệp
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    // Thêm hiệu ứng Glassmorphism khi scroll và transition mượt mà
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/70 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
        
        {/* Logo với Font-weight và Letter-spacing tinh tế hơn */}
        <a href="/" className="text-2xl font-bold tracking-tighter text-slate-900 group">
          <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600">Luxe</span>
          <span className="transition-colors group-hover:text-indigo-600"> Hotel</span>
        </a>

        {/* Menu Items */}
        <div className="hidden md:flex items-center gap-10 text-[13px] font-medium uppercase tracking-widest text-slate-700">
          <a href="/" className="hover:text-indigo-600 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-indigo-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all">
            Home
          </a>
          <a href="/hotels" className="hover:text-indigo-600 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-indigo-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all">
            Hotels
          </a>
          <a href="/contact" className="hover:text-indigo-600 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-indigo-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all">
            Contact
          </a>

          <a href="/about" className="hover:text-indigo-600 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-indigo-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all">
            About Us
          </a>

          {user && (user.role === "admin" || user.role === "superadmin") && (
            <a 
              className="flex items-center gap-1 text-amber-600 font-bold hover:scale-105 transition-transform" 
              href="/admin"
            >
              <LayoutDashboard size={14} /> Admin
            </a>
          )}

          <div className="h-4 w-px bg-slate-200 mx-2" /> {/* Vạch ngăn cách nhẹ nhàng */}

          {!user ? (
            <a 
              href="/login" 
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              Login
            </a>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative cursor-pointer group">
                  <img
                    src={user?.avatar || "https://i.pravatar.cc/40"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md group-hover:border-indigo-400 transition-all object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 mt-2 p-2 rounded-2xl shadow-xl border-slate-100 animate-in fade-in zoom-in duration-200">
                <div className="px-3 py-2 mb-1">
                  <p className="text-xs text-slate-400 font-normal">Tài khoản</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{user.username}</p>
                </div>
                <DropdownMenuSeparator className="bg-slate-50" />
                
                <DropdownMenuItem
                  className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => (window.location.href = "/profile")}
                >
                  <User size={16} className="text-slate-400" />
                  <span className="font-medium text-slate-600 text-sm">Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => (window.location.href = "/my-bookings")}
                >
                  <Calendar size={16} className="text-slate-400" />
                  <span className="font-medium text-slate-600 text-sm">My Bookings</span>
                </DropdownMenuItem>

                 <DropdownMenuItem
                  className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => (window.location.href = "/my-favorite")}
                >
                  <Heart size={16} className="text-slate-400" />
                  <span className="font-medium text-slate-600 text-sm">Favorite Hotels</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-50" />
                
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-3 rounded-xl cursor-pointer text-red-500 hover:bg-red-50 focus:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="font-bold text-sm">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-900">
           <MenuIcon size={24} />
        </div>

      </div>
    </nav>
  );
};

export default Navbar;