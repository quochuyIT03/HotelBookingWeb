import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BedDouble, DollarSign, Users, Hash, FileText, ArrowLeft, Plus } from "lucide-react";

const AddRoom = () => {
  const { id } = useParams(); // 🔥 hotelId
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [form, setForm] = useState({
    roomtype: "standard",
    description: "",
    price: "",
    maxPeople: "",
    roomNumbers: "",
  });

  // 🔥 Lấy thông tin hotel để hiển thị tiêu đề cho thân thiện
  useEffect(() => {
    fetch(`http://localhost:5001/api/hotels/${id}`)
      .then((res) => res.json())
      .then((data) => setHotel(data.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Đang khởi tạo hạng phòng...");

    const roomNumbersArray = form.roomNumbers
      .split(",")
      .filter(n => n.trim() !== "") // Loại bỏ khoảng trắng thừa
      .map((n) => ({
        number: Number(n.trim()),
        unavailableDates: [],
      }));

    const payload = {
      ...form,
      price: Number(form.price),
      maxPeople: Number(form.maxPeople),
      roomNumbers: roomNumbersArray,
      hotel: id,
    };

    try {
      const res = await fetch("http://localhost:5001/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("✅ Đã thêm hạng phòng mới thành công!");
        navigate(`/admin/hotels/${id}`);
      } else {
        throw new Error(data.message || "Lỗi khi tạo phòng");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message);
      console.error(err);
    }
  };

  const inputClass = "bg-white/[0.03] border-white/10 rounded-xl px-4 py-6 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/50 transition-all";
  const labelClass = "text-slate-400 font-bold mb-2 flex items-center gap-2 text-xs uppercase tracking-widest";

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-[#0f0f12] border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
        {/* Trang trí background nhẹ */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-[60px] rounded-full" />
        
        <CardContent className="p-8 md:p-12 space-y-8 relative">
          {/* HEADER */}
          <div className="space-y-2">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-4 text-sm font-medium"
            >
              <ArrowLeft size={16} /> Quay lại khách sạn
            </button>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              Add New Room 
              {hotel && <span className="text-emerald-500 block text-lg not-italic mt-1">@ {hotel.name}</span>}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Room Type & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className={labelClass}><BedDouble size={14} className="text-emerald-400"/> Room Type</Label>
                <Select
                  value={form.roomtype}
                  onValueChange={(value) => setForm({ ...form, roomtype: value })}
                >
                  <SelectTrigger className="bg-white/3 border-white/10 rounded-xl h-13 text-white focus:ring-emerald-500/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1e] border-white/10 text-white">
                    <SelectItem value="standard">Standard Room</SelectItem>
                    <SelectItem value="deluxe">Deluxe Room</SelectItem>
                    <SelectItem value="superior">Superior Room</SelectItem>
                    <SelectItem value="suite">Suite Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={labelClass}><DollarSign size={14} className="text-emerald-400"/> Price per Night</Label>
                <Input
                  type="number"
                  placeholder="VD: 150"
                  className={inputClass}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Row 2: Max People & Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-1">
                <Label className={labelClass}><Users size={14} className="text-emerald-400"/> Max People</Label>
                <Input
                  type="number"
                  placeholder="2"
                  className={inputClass}
                  value={form.maxPeople}
                  onChange={(e) => setForm({ ...form, maxPeople: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className={labelClass}><FileText size={14} className="text-emerald-400"/> Room Description</Label>
                <Input
                  placeholder="Tiện nghi: Wifi, Ban công, King bed..."
                  className={inputClass}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Room Numbers */}
            <div className="space-y-2">
              <Label className={labelClass}><Hash size={14} className="text-emerald-400"/> Room Numbers (phẩy để ngăn cách)</Label>
              <Input
                placeholder="101, 102, 205, 308"
                className={`${inputClass} font-mono text-emerald-400 placeholder:font-sans`}
                value={form.roomNumbers}
                onChange={(e) => setForm({ ...form, roomNumbers: e.target.value })}
                required
              />
              <p className="text-[10px] text-slate-500 italic mt-1 ml-1">
                Nhập danh sách số phòng hiện có cho hạng phòng này.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                className="flex-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-7 rounded-2xl shadow-xl shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-95 border-none uppercase tracking-widest"
              >
                <Plus size={18} className="mr-2" /> Create Room
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1 border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl py-7 font-bold transition-all"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddRoom;