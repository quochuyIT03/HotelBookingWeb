import React, { useEffect, useState } from "react";
import imgUpload from "@/assets/upload.png";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, Save, UploadCloud } from "lucide-react";

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔥 STATE IMAGE
  const [images, setImages] = useState([null, null, null, null, null]);
  const [preview, setPreview] = useState([]);

  // 🔥 DATA
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    cheapestPrice: "",
  });

  // 🔥 FETCH HOTEL DETAIL
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/hotels/${id}`);
        const data = await res.json();
        const hotel = data.data;

        setFormData({
          name: hotel.name || "",
          description: hotel.description || "",
          address: hotel.address || "",
          city: hotel.city || "",
          country: hotel.country || "",
          cheapestPrice: hotel.cheapestPrice || "",
        });
        setPreview(hotel.image || []);
      } catch (error) {
        console.log(error);
        toast.error("Không thể tải dữ liệu khách sạn");
      }
    };
    fetchHotel();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Đang cập nhật...");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      
      images.forEach((img, index) => {
        if (img) data.append(`image${index + 1}`, img);
      });

      const res = await fetch(`http://localhost:5001/api/hotels/${id}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) throw new Error(result.message);

      toast.success("Cập nhật khách sạn thành công!");
      navigate("/admin/hotelsManagement");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Cập nhật thất bại: " + error.message);
    }
  };

  // Class dùng chung cho Input
  const inputClass = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Update Hotel</h1>
            <p className="text-slate-500 text-sm">Chỉnh sửa thông tin chi tiết của khách sạn</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: IMAGES */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0f0f12] p-6 rounded-3xl border border-white/5 shadow-xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <UploadCloud size={18} className="text-emerald-400" /> Hotel Images
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {images.map((img, index) => (
                <label 
                  key={index} 
                  htmlFor={`image${index + 1}`}
                  className={`relative cursor-pointer group overflow-hidden rounded-2xl border-2 border-dashed border-white/10 hover:border-emerald-500/50 transition-all aspect-square ${index === 0 ? 'col-span-2 aspect-video' : ''}`}
                >
                  <img
                    src={img ? URL.createObjectURL(img) : preview[index] || imgUpload}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt="preview"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs font-bold bg-emerald-600 px-2 py-1 rounded">Change</span>
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
            <p className="text-[10px] text-slate-500 mt-4 text-center italic">Tip: Ảnh đầu tiên sẽ là ảnh đại diện (Thumbnail)</p>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM DATA */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0f0f12] p-8 rounded-3xl border border-white/5 shadow-xl space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Hotel Name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="VD: Vinpearl Luxury" className={inputClass} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Full Address</label>
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Số 1, đường ABC..." className={inputClass} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">City</label>
                <input name="city" value={formData.city} onChange={handleChange} placeholder="Đà Nẵng" className={inputClass} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Country</label>
                <input name="country" value={formData.country} onChange={handleChange} placeholder="Việt Nam" className={inputClass} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Base Price ($)</label>
                <input name="cheapestPrice" type="number" value={formData.cheapestPrice} onChange={handleChange} placeholder="99" className={inputClass} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Mô tả về tiện ích, view..." 
                className={`${inputClass} h-40 resize-none`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              <Save size={20} /> CẬP NHẬT THÔNG TIN
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default EditHotel;