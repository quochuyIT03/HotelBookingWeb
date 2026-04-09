import { Plus, UploadCloud, MapPin, DollarSign, FileText, Hotel } from "lucide-react";
import React, { useState } from "react";
import imgUpload from "@/assets/upload.png";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const AddHotel = () => {
  const [images, setImages] = useState([null, null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [cheapestPrice, setCheapestPrice] = useState("");

  const handleFileChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Đang khởi tạo khách sạn...");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("country", country);
      formData.append("cheapestPrice", cheapestPrice);

      images.forEach((img, index) => {
        if (img) formData.append(`image${index + 1}`, img);
      });

      const res = await fetch(`${window.BASE_URL}/hotels`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) throw new Error(result.message);

      toast.success("✅ Thêm khách sạn thành công!");

      // Reset form
      setName(""); setDescription(""); setAddress("");
      setCity(""); setCountry(""); setCheapestPrice("");
      setImages([null, null, null, null, null]);

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("ERROR:", error);
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };

  const inputClass = "w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all duration-300 shadow-inner";
  const labelClass = "text-sm font-bold text-slate-400 ml-1 mb-2 flex items-center gap-2";

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <Hotel className="text-emerald-500" size={36} /> Add New Hotel
        </h1>
        <p className="text-slate-500 font-medium">Điền thông tin bên dưới để đăng ký khách sạn mới vào hệ thống.</p>
      </div>

      <form onSubmit={onSubmitHandler} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: IMAGE UPLOAD (4 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0f0f12] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full" />
            
            <h3 className={labelClass}>
              <UploadCloud size={18} className="text-emerald-400" /> Hotel Gallery
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {images.map((img, index) => (
                <label 
                  key={index} 
                  htmlFor={`image${index + 1}`}
                  className={`relative cursor-pointer group overflow-hidden rounded-3xl border-2 border-dashed border-white/5 hover:border-emerald-500/40 transition-all aspect-square ${index === 0 ? 'col-span-2 aspect-video' : ''}`}
                >
                  <img
                    src={img ? URL.createObjectURL(img) : imgUpload}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!img && 'p-8 opacity-20'}`}
                    alt="upload"
                  />
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <div className="bg-white text-black p-2 rounded-full shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
                      <Plus size={20} />
                    </div>
                  </div>
                  <input
                    type="file"
                    id={`image${index + 1}`}
                    hidden
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                  />
                </label>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-6 text-center leading-relaxed">
              Hỗ trợ định dạng JPG, PNG. <br/> Ảnh đầu tiên sẽ được dùng làm ảnh bìa chính.
            </p>
          </div>
        </div>

        {/* RIGHT: CONTENT FORM (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0f0f12] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
            
            {/* Tên khách sạn */}
            <div className="space-y-2">
              <label className={labelClass}><Hotel size={16}/> Hotel Name</label>
              <input 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                placeholder="Nhập tên khách sạn..." 
                className={inputClass} 
                required 
              />
            </div>

            {/* Địa chỉ & Thành phố */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className={labelClass}><MapPin size={16}/> Full Address</label>
                <input 
                  onChange={(e) => setAddress(e.target.value)} 
                  value={address} 
                  placeholder="Địa chỉ cụ thể..." 
                  className={inputClass} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>City</label>
                <input 
                  onChange={(e) => setCity(e.target.value)} 
                  value={city} 
                  placeholder="Thành phố..." 
                  className={inputClass} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Country</label>
                <input 
                  onChange={(e) => setCountry(e.target.value)} 
                  value={country} 
                  placeholder="Quốc gia..." 
                  className={inputClass} 
                  required 
                />
              </div>
            </div>

            {/* Giá & Mô tả */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-1">
                <label className={labelClass}><DollarSign size={16}/> Price ($)</label>
                <input 
                  type="number" 
                  onChange={(e) => setCheapestPrice(e.target.value)} 
                  value={cheapestPrice} 
                  placeholder="0.00" 
                  className={inputClass} 
                  required 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                 <label className={labelClass}><FileText size={16}/> Short Description</label>
                 <textarea 
                  onChange={(e) => setDescription(e.target.value)} 
                  value={description} 
                  placeholder="Vài dòng giới thiệu về khách sạn..." 
                  className={`${inputClass} h-14.5 resize-none py-4`}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-8 rounded-3xl shadow-xl shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-95 text-lg mt-4 border-none"
            >
              CREATE HOTEL NOW
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddHotel;