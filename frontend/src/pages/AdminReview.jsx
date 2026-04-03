import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Trash2,
  Pin,
  PinOff,
  Star,
  Loader2,
  Search,
  Filter,
  Hotel as HotelIcon,
  MessageCircle,
  StarHalf,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStar, setFilterStar] = useState("all");

  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/reviews");
      if (res.data.success) setReviews(res.data.data);
    } catch (error) {
      console.log(error);

      toast.error("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, total: 0, pinned: 0 };
    const total = reviews.length;
    const avg = (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(
      1,
    );
    const pinned = reviews.filter((r) => r.isPinned).length;
    return { avg, total, pinned };
  }, [reviews]);

  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch =
      rev.hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStar =
      filterStar === "all" || rev.rating.toString() === filterStar;
    return matchesSearch && matchesStar;
  });

  // --- LOGIC PHÂN TRANG ---
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const currentReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset về trang 1 khi lọc hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStar]);

  const handleDelete = async (id) => {
    toast.info("Xác nhận xóa đánh giá này?", {
      action: {
        label: "Xóa ngay",
        onClick: async () => {
          try {
            const adminId = JSON.parse(localStorage.getItem("user"))._id;
            await axios.delete(`http://localhost:5001/api/reviews/${id}`, {
              data: { userId: adminId },
            });
            setReviews((prev) => prev.filter((item) => item._id !== id));
            toast.success("Đã gỡ bỏ đánh giá!");
          } catch (error) {
            console.log(error);

            toast.error("Lỗi khi xóa!");
          }
        },
      },
    });
  };

  const handleTogglePin = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:5001/api/reviews/pin/${id}`,
      );
      if (res.data.success) {
        setReviews((prev) =>
          prev.map((item) =>
            item._id === id
              ? { ...item, isPinned: res.data.data.isPinned }
              : item,
          ),
        );
        toast.success(
          res.data.data.isPinned ? "📌 Đã ghim đánh giá!" : "📍 Đã bỏ ghim",
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Thao tác thất bại");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3 italic uppercase">
            <MessageCircle className="text-emerald-500" size={32} /> Reviews Lab
          </h1>
          <p className="text-slate-500 font-medium font-mono text-sm tracking-wider">
            Hệ thống điều phối & kiểm duyệt phản hồi khách hàng.
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Total Reviews"
          value={stats.total}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
        />
        <StatCard
          icon={<StarHalf size={24} />}
          label="Average Score"
          value={stats.avg}
          color="text-amber-400"
          bgColor="bg-amber-500/10"
        />
        <StatCard
          icon={<Pin size={24} />}
          label="Pinned Content"
          value={stats.pinned}
          color="text-emerald-400"
          bgColor="bg-emerald-500/10"
        />
      </div>

      {/* FILTERS AREA */}
      <div className="bg-[#0f0f12] p-5 rounded-[2rem] border border-white/5 shadow-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm tên khách sạn, nội dung hoặc người dùng..."
            className="w-full pl-12 pr-4 h-14 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto bg-white/5 border border-white/10 rounded-2xl px-4 h-14">
          <Filter size={18} className="text-emerald-500" />
          <select
            className="bg-transparent text-white outline-none cursor-pointer font-bold text-sm"
            value={filterStar}
            onChange={(e) => setFilterStar(e.target.value)}
          >
            <option value="all" className="bg-[#1a1a1e]">
              Tất cả rating
            </option>
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s} className="bg-[#1a1a1e]">
                {s} Sao
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* REVIEWS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-100 items-start">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <div
              key={review._id}
              className={`group relative bg-[#0f0f12] border ${
                review.isPinned
                  ? "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                  : "border-white/5"
              } rounded-[2.5rem] p-6 transition-all duration-500 hover:border-emerald-500/20 h-fit`} // Thêm h-fit ở đây cho chắc
            >
              {review.isPinned && (
                <div className="absolute top-6 right-6">
                  <Pin
                    size={16}
                    className="text-emerald-400 fill-emerald-400 animate-pulse"
                  />
                </div>
              )}

              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={
                          review.user?.avatar ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        }
                        alt="avatar"
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/5 group-hover:ring-emerald-500/30 transition-all"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#0f0f12]" />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase text-sm tracking-tighter">
                        {review.user?.username}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1 uppercase tracking-widest mt-0.5">
                        <HotelIcon size={10} className="text-emerald-500" />{" "}
                        {review.hotel?.name}
                      </p>
                    </div>
                  </div>
                  <RatingBadge rating={review.rating} />
                </div>

                <div className="bg-white/2 border border-white/5 rounded-2xl p-4 italic relative">
                  <span className="absolute -top-3 left-4 text-emerald-500 text-4xl opacity-20 font-serif">
                    "
                  </span>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                    {review.comment ||
                      "Khách hàng không để lại bình luận văn bản."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                    ID: #{review._id.slice(-6)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTogglePin(review._id)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-tighter ${review.isPinned ? "bg-emerald-500 text-black" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}
                    >
                      {review.isPinned ? (
                        <PinOff size={14} />
                      ) : (
                        <Pin size={14} />
                      )}
                      {review.isPinned ? "Unpin" : "Pin"}
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-2 text-center py-32 bg-[#0f0f12] rounded-[3rem] border-2 border-dashed border-white/5">
            <MessageCircle className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-medium tracking-wide">
              Hệ thống chưa ghi nhận đánh giá nào khớp với bộ lọc.
            </p>
          </div>
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-8">
          <button
            className="p-3 rounded-xl bg-white/5 text-white hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-20"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  currentPage === index + 1
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="p-3 rounded-xl bg-white/5 text-white hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-20"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color, bgColor }) => (
  <div className="p-8 rounded-[2.5rem] border border-white/5 shadow-xl bg-[#0f0f12] flex items-center gap-6 group hover:border-emerald-500/20 transition-all">
    <div
      className={`p-5 rounded-2xl ${bgColor} ${color} transition-transform group-hover:scale-110`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
        {label}
      </p>
      <p className="text-3xl font-black text-white mt-1">{value}</p>
    </div>
  </div>
);

const RatingBadge = ({ rating }) => {
  const isHigh = rating >= 4;
  const isMed = rating >= 3;
  return (
    <div
      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black italic tracking-tighter ${isHigh ? "bg-emerald-500/10 text-emerald-400" : isMed ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"}`}
    >
      {rating.toFixed(1)} <Star size={12} fill="currentColor" />
    </div>
  );
};

export default AdminReviews;
