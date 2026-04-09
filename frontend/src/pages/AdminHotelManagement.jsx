import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  MapPin,
  Plus,
  Trash2,
  Eye,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import TaskListPagination from "@/components/TaskListPagination";

const AdminHotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [sortField, setSortField] = useState("name"); 
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();

  // ================= FETCH DATA =================
  const fetchHotels = async () => {
    try {
      const res = await fetch(`${window.BASE_URL}/hotels`);
      const data = await res.json();
      setHotels(data.data);
    } catch (error) {
      console.log("Lỗi fetch hotels: ", error);
      toast.error("Không thể kết nối đến server");
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // ================= SORT LOGIC =================
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedHotels = [...hotels].sort((a, b) => {
    let valueA, valueB;
    if (sortField === "name") {
      valueA = a.name?.toLowerCase() || "";
      valueB = b.name?.toLowerCase() || "";
    } else if (sortField === "price") {
      valueA = Number(a.cheapestPrice) || 0;
      valueB = Number(b.cheapestPrice) || 0;
    }

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // ================= PAGINATION LOGIC =================
  const totalPages = Math.ceil(sortedHotels.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const currentHotels = sortedHotels.slice(startIndex, startIndex + pageSize);

  useEffect(() => { setPage(1); }, [sortField, sortOrder]);

  const handlePageChange = (newPage) => setPage(newPage);

  // ================= DELETE ACTION =================
  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa khách sạn này?")) return;
    try {
      const res = await fetch(`${window.BASE_URL}/hotels/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHotels((prev) => prev.filter((h) => h._id !== id));
        toast.success("Đã xóa khách sạn thành công");
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error)
      toast.error("Xóa thất bại, vui lòng thử lại");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight italic">Hotels Management</h1>
          <p className="text-slate-500 text-sm font-medium">Quản lý và cập nhật danh sách khách sạn hệ thống.</p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 border-none"
          onClick={() => navigate("/admin/addHotel")}
        >
          <Plus className="mr-2" size={20} /> Thêm khách sạn mới
        </Button>
      </div>

      {/* TABLE MAIN CONTAINER */}
      <div className="bg-[#0f0f12] border border-white/5 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Table Header với màu nền nhẹ để tách biệt */}
              <tr className="bg-white/3 text-slate-400 text-[11px] uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-6 py-5 font-black">Preview</th>
                <th 
                  className="px-6 py-5 cursor-pointer hover:text-white transition-colors group/head" 
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Hotel Name 
                    {sortField === "name" ? (
                      sortOrder === "asc" ? <ArrowUp size={14} className="text-emerald-400"/> : <ArrowDown size={14} className="text-emerald-400"/>
                    ) : (
                      <ArrowUpDown size={14} className="opacity-20 group-hover/head:opacity-100 transition-opacity"/>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-5 cursor-pointer hover:text-white transition-colors group/head" 
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center gap-2">
                    Min Price
                    {sortField === "price" ? (
                      sortOrder === "asc" ? <ArrowUp size={14} className="text-emerald-400"/> : <ArrowDown size={14} className="text-emerald-400"/>
                    ) : (
                      <ArrowUpDown size={14} className="opacity-20 group-hover/head:opacity-100 transition-opacity"/>
                    )}
                  </div>
                </th>
                <th className="px-6 py-5 font-black text-center">Status</th>
                <th className="px-6 py-5 text-right font-black">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/5">
              {currentHotels.map((hotel) => (
                <tr 
                  key={hotel._id} 
                  className="hover:bg-white/4 transition-all duration-200 group"
                >
                  {/* Image Cell */}
                  <td className="px-6 py-4">
                    <img
                      src={hotel.image?.[0] || "https://via.placeholder.com/150"}
                      className="h-14 w-20 rounded-xl object-cover border border-white/10 shadow-inner group-hover:scale-105 transition-transform"
                      alt="hotel preview"
                    />
                  </td>

                  {/* Info Cell */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-bold text-base tracking-tight group-hover:text-emerald-400 transition-colors">
                        {hotel.name}
                      </span>
                      <span className="text-slate-500 text-xs flex items-center gap-1.5 font-medium">
                        <MapPin size={12} className="text-rose-500/70" /> 
                        {hotel.city}, {hotel.country}
                      </span>
                    </div>
                  </td>

                  {/* Price Cell */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-emerald-400 font-mono font-black text-lg tracking-tighter">
                        ${hotel.cheapestPrice?.toLocaleString() || 0}
                      </span>
                      <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Starting from</span>
                    </div>
                  </td>

                  {/* Status Cell */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm transition-colors ${
                      hotel.featured 
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                        : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                    }`}>
                      {hotel.featured ? "Featured" : "Standard"}
                    </span>
                  </td>

                  {/* Actions Cell */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/admin/hotels/${hotel._id}`)}
                        className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-90"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/editHotel/${hotel._id}`)}
                        className="p-2.5 text-amber-400/80 hover:text-amber-400 hover:bg-amber-400/10 rounded-xl transition-all active:scale-90"
                        title="Edit Hotel"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(hotel._id)}
                        className="p-2.5 text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all active:scale-90"
                        title="Delete Hotel"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-6 border-t border-white/5 bg-white/2">
          <TaskListPagination
            handleNextPage={() => setPage(p => Math.min(p + 1, totalPages))}
            handlePreviousPage={() => setPage(p => Math.max(p - 1, 1))}
            handlePageChange={handlePageChange}
            page={page}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHotelManagement;