import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Dùng sonner cho sang Huy ơi
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, X, BedDouble, Users, DollarSign, FileText, Hash } from "lucide-react";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [form, setForm] = useState({
    roomtype: "standard",
    description: "",
    price: "",
    maxPeople: "",
    roomNumbers: "",
    hotel: "",
  });

  // 🔥 Load dữ liệu phòng
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`${window.BASE_URL}/rooms/${id}`);
        const data = await res.json();
        if (data.success) {
          const room = data.data;
          setForm({
            roomtype: room.roomtype,
            description: room.description || "",
            price: room.price,
            maxPeople: room.maxPeople,
            roomNumbers: room.roomNumbers.map((r) => r.number).join(", "),
            hotel: room.hotel?._id || room.hotel,
          });
        }
      } catch (err) {
        console.log(err)
        toast.error("Không thể tải thông tin phòng");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const roomNumbers = form.roomNumbers
      .split(",")
      .map((n) => ({
        number: Number(n.trim()),
        unavailableDates: [],
      }));

    const payload = {
      ...form,
      price: Number(form.price),
      maxPeople: Number(form.maxPeople),
      roomNumbers,
    };

    try {
      const res = await fetch(`${window.BASE_URL}/rooms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Cập nhật phòng thành công!");
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (err) {
      console.log(err)
      toast.error("Lỗi khi cập nhật!");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-[#050505] flex justify-center items-start pt-12 animate-in fade-in duration-500">
      <Card className="w-full max-w-2xl bg-[#0f0f12] border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <CardContent className="p-8 md:p-12 space-y-8">
          
          {/* HEADER */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
              <BedDouble className="text-emerald-500" size={32} /> Edit Room
            </h1>
            <p className="text-slate-500 font-mono text-xs tracking-widest">ID: #{id?.slice(-8).toUpperCase()}</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Room Type */}
            <div className="md:col-span-2 space-y-2">
              <Label className="text-slate-400 font-bold uppercase text-[10px] tracking-widest ml-1">Room Type</Label>
              <Select
                value={form.roomtype}
                onValueChange={(value) => setForm({ ...form, roomtype: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-2xl h-14 focus:ring-emerald-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1e] border-white/10 text-white rounded-xl">
                  <SelectItem value="standard">Standard Class</SelectItem>
                  <SelectItem value="deluxe">Deluxe Premium</SelectItem>
                  <SelectItem value="superior">Superior Luxury</SelectItem>
                  <SelectItem value="suite">Presidential Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label className="text-slate-400 font-bold uppercase text-[10px] tracking-widest ml-1 flex items-center gap-2">
                <DollarSign size={12} className="text-emerald-500" /> Price per Night
              </Label>
              <Input
                type="number"
                className="bg-white/5 border-white/10 text-white rounded-2xl h-14 focus:border-emerald-500/50 transition-all"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            {/* Max People */}
            <div className="space-y-2">
              <Label className="text-slate-400 font-bold uppercase text-[10px] tracking-widest ml-1 flex items-center gap-2">
                <Users size={12} className="text-emerald-500" /> Max Capacity
              </Label>
              <Input
                type="number"
                className="bg-white/5 border-white/10 text-white rounded-2xl h-14 focus:border-emerald-500/50 transition-all"
                value={form.maxPeople}
                onChange={(e) => setForm({ ...form, maxPeople: e.target.value })}
              />
            </div>

            {/* Room Numbers */}
            <div className="md:col-span-2 space-y-2">
              <Label className="text-slate-400 font-bold uppercase text-[10px] tracking-widest ml-1 flex items-center gap-2">
                <Hash size={12} className="text-emerald-500" /> Room Numbers (Comma separated)
              </Label>
              <Input
                className="bg-white/5 border-white/10 text-white rounded-2xl h-14 focus:border-emerald-500/50 transition-all font-mono"
                placeholder="101, 102, 103..."
                value={form.roomNumbers}
                onChange={(e) => setForm({ ...form, roomNumbers: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-2">
              <Label className="text-slate-400 font-bold uppercase text-[10px] tracking-widest ml-1 flex items-center gap-2">
                <FileText size={12} className="text-emerald-500" /> Room Description
              </Label>
              <textarea
                className="w-full min-h-30 bg-white/5 border border-white/10 text-white rounded-2xl p-4 outline-none focus:border-emerald-500/50 transition-all text-sm resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* ACTIONS */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={isUpdating}
                className="flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest transition-all"
              >
                {isUpdating ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
                Save Changes
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1 h-14 rounded-2xl border-white/10 bg-transparent text-white hover:bg-white/5 font-black uppercase tracking-widest transition-all"
              >
                <X className="mr-2" size={20} /> Cancel
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditRoom;