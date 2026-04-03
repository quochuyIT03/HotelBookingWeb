import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Hotel as HotelIcon, 
  Users, 
  Trash2, 
  Edit3, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  DoorOpen,
  LayoutGrid
} from "lucide-react";

const AdminRoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("all");
  const [search, setSearch] = useState("");
  
  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch hotels & rooms song song cho nhanh
    Promise.all([
      fetch("http://localhost:5001/api/hotels").then(res => res.json()),
      fetch("http://localhost:5001/api/rooms").then(res => res.json())
    ]).then(([hotelsData, roomsData]) => {
      setHotels(hotelsData.data || []);
      setRooms(roomsData.data || []);
    });
  }, []);

  // 🔥 Filter logic
  const filteredRooms = rooms.filter((room) => {
    const matchesHotel = selectedHotel === "all" || room.hotel?._id === selectedHotel;
    const matchesSearch = room.roomtype.toLowerCase().includes(search.toLowerCase());
    return matchesHotel && matchesSearch;
  });

  // --- LOGIC PHÂN TRANG ---
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const currentRooms = filteredRooms.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedHotel]);

  const handleDelete = async (id) => {
    toast.info("Đang xác nhận xóa...", {
      action: {
        label: "Xác nhận",
        onClick: async () => {
          try {
            await fetch(`http://localhost:5001/api/rooms/${id}`, { method: "DELETE" });
            setRooms((prev) => prev.filter((r) => r._id !== id));
            toast.success("Đã xóa hạng phòng!");
          } catch (error) {
            console.log(error)
            toast.error("Xóa thất bại!");
          }
        },
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3 italic">
            <LayoutGrid className="text-emerald-500" size={32} /> ROOMS DIRECTORY
          </h1>
          <p className="text-slate-500 font-medium">Hệ thống quản lý và phân loại các hạng phòng lưu trú.</p>
        </div>
      </div>

      {/* FILTER BAR - Glassmorphism */}
      <div className="bg-[#0f0f12] p-5 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <Input
            placeholder="Tìm theo hạng phòng (Standard, Suite...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 bg-white/3 border-white/10 rounded-2xl h-14 text-white focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
          />
        </div>

        <Select onValueChange={setSelectedHotel} defaultValue="all">
          <SelectTrigger className="w-full md:w-72 bg-white/3 border-white/10 rounded-2xl h-14 text-white">
            <div className="flex items-center gap-2">
                <HotelIcon size={16} className="text-emerald-500" />
                <SelectValue placeholder="Tất cả khách sạn" />
            </div>
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a1e] border-white/10 text-white rounded-2xl">
            <SelectItem value="all">Tất cả khách sạn</SelectItem>
            {hotels.map((hotel) => (
              <SelectItem key={hotel._id} value={hotel._id}>{hotel.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ROOM LIST GRID */}
      {currentRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentRooms.map((room) => (
            <Card key={room._id} className="bg-[#0f0f12] border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 shadow-xl">
              <CardContent className="p-8 space-y-6">
                {/* Header Card */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white capitalize group-hover:text-emerald-400 transition-colors tracking-tight">
                      {room.roomtype}
                    </h2>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <HotelIcon size={12} className="text-emerald-500" /> {room.hotel?.name || "Independent"}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono font-black text-emerald-400">${room.price}</span>
                    <p className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter">/ per night</p>
                  </div>
                </div>

                {/* Stats Icons */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <Users size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-300">{room.maxPeople} Guests</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                        <DoorOpen size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-300">{room.roomNumbers.length} Units</span>
                  </div>
                </div>

                {/* Room Numbers Tags - Custom Scroll */}
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Room Inventory</p>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                    {room.roomNumbers.map((r) => (
                        <span key={r.number} className="px-3 py-1 bg-white/3 text-slate-400 rounded-lg text-[10px] font-mono border border-white/5 hover:border-emerald-500/30 transition-colors">
                        #{r.number}
                        </span>
                    ))}
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-3 gap-3 pt-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  
                  <Button 
                    variant="ghost"
                    className="rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-white h-12"
                    onClick={() => navigate(`/admin/rooms/edit/${room._id}`)}
                  >
                    <Edit3 size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 text-white h-12"
                    onClick={() => handleDelete(room._id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-[#0f0f12] rounded-[3rem] border-2 border-dashed border-white/5">
          <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="text-slate-600" size={40} />
          </div>
          <h3 className="text-xl font-bold text-white">No rooms found in our records</h3>
          <p className="text-slate-500 mt-2">Thử thay đổi bộ lọc hoặc thêm hạng phòng mới cho khách sạn.</p>
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 py-10">
          <Button
            variant="ghost"
            className="w-12 h-12 rounded-2xl bg-[#0f0f12] border border-white/5 text-white hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-20"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={24} />
          </Button>
          
          <div className="flex gap-3">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-12 h-12 rounded-2xl text-sm font-black transition-all duration-300 ${
                  currentPage === index + 1 
                  ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
                  : "bg-[#0f0f12] text-slate-500 border border-white/5 hover:border-white/20"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
             className="w-12 h-12 rounded-2xl bg-[#0f0f12] border border-white/5 text-white hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-20"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={24} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminRoomManagement;