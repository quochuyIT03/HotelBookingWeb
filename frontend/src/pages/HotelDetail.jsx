import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  BedDouble, 
  Users, 
  MapPin, 
  Plus, 
  Edit3, 
  ChevronRight,
  Star,
  Info
} from "lucide-react";

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelRes, roomsRes] = await Promise.all([
          fetch(`${window.BASE_URL}/hotels/${id}`),
          fetch(`${window.BASE_URL}/rooms/hotels/${id}`)
        ]);
        
        const hotelData = await hotelRes.json();
        const roomsData = await roomsRes.json();

        setHotel(hotelData.data);
        setRooms(roomsData.data || []);
      } catch (error) {
        console.error("Lỗi fetch dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#050505]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
    </div>
  );

  if (!hotel) return <p className="p-6 text-white">Không tìm thấy thông tin khách sạn.</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* NAVIGATION & ACTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button 
          onClick={() => navigate("/admin/hotelsManagement")}
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Management</span>
        </button>

        <div className="flex gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex-1 md:flex-none border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl px-6"
            onClick={() => navigate(`/admin/editHotel/${id}`)}
          >
            <Edit3 size={16} className="mr-2 text-amber-400" /> Edit Hotel
          </Button>

          <Button
            className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 shadow-lg shadow-emerald-500/20"
            onClick={() => navigate(`/admin/hotels/${id}/rooms/add`)}
          >
            <Plus size={16} className="mr-2" /> Add New Room
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: HOTEL OVERVIEW (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0f0f12] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="relative h-48 group">
              <img 
                src={hotel.image?.[0] || "https://via.placeholder.com/400x300"} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="hotel"
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-white text-xs font-bold">4.8</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight leading-tight uppercase italic">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
                  <MapPin size={14} className="text-rose-500" />
                  {hotel.address}, {hotel.city}
                </div>
              </div>

              <div className="h-px bg-white/5 w-full" />

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                  <Info size={14} /> Description
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {hotel.description || "Chưa có mô tả chi tiết cho khách sạn này."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: ROOM LIST (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">
              Available Rooms ({rooms.length})
            </h2>
          </div>

          {rooms.length === 0 ? (
            <div className="bg-white/2 border border-dashed border-white/10 rounded-[2rem] p-12 text-center">
              <BedDouble size={48} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 font-medium">Chưa có hạng phòng nào được thêm.</p>
              <Button 
                variant="link" 
                className="text-emerald-500 mt-2"
                onClick={() => navigate(`/admin/hotels/${id}/rooms/add`)}
              >
                Tạo hạng phòng đầu tiên ngay
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {rooms.map((room) => (
                <Card key={room._id} className="bg-[#0f0f12] border-white/5 rounded-3xl overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors uppercase">
                          {room.roomtype}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-emerald-400 font-mono font-bold">${room.price}</span>
                           <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest">/ Night</span>
                        </div>
                      </div>
                      <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-xl">
                        <BedDouble size={20} />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400 text-xs">
                      <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
                        <Users size={14} />
                        <span>Max: {room.maxPeople}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Room Numbers</p>
                      <div className="flex flex-wrap gap-2">
                        {room.roomNumbers.map((r) => (
                          <span
                            key={r.number}
                            className="text-[10px] font-mono bg-white/3 text-slate-300 border border-white/10 px-2 py-1 rounded-md"
                          >
                            #{r.number}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent border-white/10 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-10"
                        onClick={() => navigate(`/admin/rooms/${room._id}`)}
                      >
                        Details
                      </Button>

                      <Button
                        size="sm"
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white border-none rounded-xl h-10"
                        onClick={() => navigate(`/admin/rooms/edit/${room._id}`)}
                      >
                        <Edit3 size={14} className="mr-2" /> Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}