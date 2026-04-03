import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Camera, User, Mail, Shield, Phone, MapPin, BadgeCheck, Sparkles } from "lucide-react";

const EditUserModal = ({
  open,
  setOpen,
  user,
  currentUser,
  onSubmit,
  mode = "edit",
}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    phone: "",
    location: "",
    avatar: "",
    role: "user",
    password: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (open) {
      if (user && mode === "edit") {
        setFormData({
          username: user.username || "",
          email: user.email || "",
          fullname: user.profile?.fullname || "",
          phone: user.profile?.phone || "",
          location: user.profile?.location || "",
          avatar: user?.avatar || "",
          role: user.role || "user",
        });
        setPreview(user?.avatar || "");
      } else {
        setFormData({
          username: "",
          email: "",
          fullname: "",
          phone: "",
          location: "",
          avatar: "",
          role: "user",
          password: "",
        });
        setPreview("");
      }
      setSelectedFile(null);
    }
  }, [user, mode, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md bg-[#0f0f12] border-white/5 text-slate-300 rounded-[2.5rem] shadow-2xl overflow-hidden p-0">
        
        {/* Header Decor */}
        <div className="h-24 bg-linear-to-r from-emerald-600/20 to-cyan-600/20 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <img
                src={preview || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-[#0f0f12] shadow-2xl relative z-10"
                alt="Avatar"
              />
              <label className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-2 border-dashed border-emerald-500/50">
                <Camera className="text-white w-6 h-6" />
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        </div>

        <div className="px-8 pt-16 pb-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white flex items-center gap-2 justify-center">
              <Sparkles className="text-emerald-500" size={20} />
              {mode === "edit" ? "Edit Operator" : "New Operator"}
            </DialogTitle>
            <p className="text-center text-[10px] font-mono text-slate-500 tracking-[0.3em] uppercase">User Access Control</p>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
            
            {/* Input Group: Username & Email */}
            <div className="space-y-4">
               <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <Input name="username" value={formData.username} onChange={handleChange} className="pl-12 bg-white/5 border-white/10 rounded-2xl h-12 focus:border-emerald-500/50 text-white transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} className="pl-12 bg-white/5 border-white/10 rounded-2xl h-12 focus:border-emerald-500/50 text-white transition-all" />
                </div>
              </div>

              {mode === "add" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">Security Key (Password)</label>
                  <Input name="password" type="password" value={formData.password} onChange={handleChange} className="bg-white/5 border-white/10 rounded-2xl h-12 focus:border-rose-500/50 text-white transition-all" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <Input name="fullname" value={formData.fullname} onChange={handleChange} className="bg-white/5 border-white/10 rounded-2xl h-12 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><Phone size={10}/> Phone</label>
                <Input name="phone" value={formData.phone} onChange={handleChange} className="bg-white/5 border-white/10 rounded-2xl h-12 text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1"><MapPin size={10}/> Location</label>
                <Input name="location" value={formData.location} onChange={handleChange} className="bg-white/5 border-white/10 rounded-2xl h-12 text-white" />
              </div>
            </div>

            {/* Role Selection */}
            {currentUser?.role === "superadmin" && (
              <div className="space-y-1 pt-2">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1 flex items-center gap-1"><BadgeCheck size={12}/> Authority Level</label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => setFormData({ ...formData, role: val })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 text-white">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1e] border-white/10 text-white rounded-xl">
                    <SelectItem value="user">Standard User</SelectItem>
                    <SelectItem value="admin">System Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-8 bg-white/5 flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="flex-1 rounded-2xl border-white/10 bg-transparent text-slate-400 hover:bg-white/5 h-12 font-black uppercase tracking-widest text-[10px]"
          >
            Abort
          </Button>
          <Button 
            onClick={() => onSubmit(formData, selectedFile)}
            className="flex-1 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-black h-12 font-black uppercase tracking-widest text-[10px]"
          >
            {mode === "edit" ? "Commit Changes" : "Create Account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;