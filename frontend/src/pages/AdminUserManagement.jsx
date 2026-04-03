import EditUserModal from "@/components/EditUserModal";
import TaskListPagination from "@/components/TaskListPagination";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, ShieldCheck, Trash2, User, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const AdminUserManagement = () => {
  const [sortField, setSortField] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState("edit");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/users");
      const data = await res.json();
      setUsers(data.data);
    } catch (error) {
      console.log("Lỗi fetch users: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 SORT LOGIC
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    let valueA = a[sortField]?.toString().toLowerCase();
    let valueB = b[sortField]?.toString().toLowerCase();
    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // 🔥 PAGINATION
  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const currentUsers = sortedUsers.slice(startIndex, startIndex + pageSize);

  useEffect(() => { setPage(1); }, [sortField, sortOrder]);

  const handlePageChange = (newPage) => setPage(newPage);

  // 🔥 ACTIONS
  const handleDelete = async (id, role) => {
    if (role === "superadmin") return toast.error("Không thể xóa Superadmin!");
    if (!window.confirm("Xác nhận xóa người dùng này?")) return;

    try {
      const res = await fetch(`http://localhost:5001/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        toast.success("Đã xóa user");
      }
    } catch (error) {
      console.log(error)
      toast.error("Xóa thất bại");
    }
  };

  const handleSubmit = async (formData, file) => {
    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("role", formData.role);
      data.append("profile", JSON.stringify({
        fullname: formData.fullname,
        phone: formData.phone,
        location: formData.location,
      }));

      if (mode === "add") data.append("password", formData.password || "123456");
      if (file) data.append("avatar", file);
      else if (mode === "edit") data.append("avatar", formData.avatar);

      const url = mode === "edit" 
        ? `http://localhost:5001/api/users/${selectedUser._id}` 
        : `http://localhost:5001/api/users`;

      const res = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success(mode === "edit" ? "Cập nhật thành công" : "Thêm thành công");
      fetchData();
      setIsOpen(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const roleStyles = (role) => {
    switch (role) {
      case "superadmin": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "admin": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Accounts Management</h1>
          <p className="text-slate-500 text-sm">Quản lý và phân quyền người dùng hệ thống.</p>
        </div>
        <Button
          onClick={() => { setMode("add"); setSelectedUser(null); setIsOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
        >
          <Plus className="mr-2 h-5 w-5" /> Thêm User mới
        </Button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-[#0f0f12] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/2 text-slate-400 text-xs uppercase tracking-widest border-b border-white/5">
                <th className="px-6 py-5 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("username")}>
                  <div className="flex items-center gap-2">
                    User Info {sortField === "username" ? (sortOrder === "asc" ? <ArrowUp size={14}/> : <ArrowDown size={14}/>) : <ArrowUpDown size={14} className="opacity-20"/>}
                  </div>
                </th>
                <th className="px-6 py-5 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("role")}>
                  <div className="flex items-center gap-2">
                    Role {sortField === "role" ? (sortOrder === "asc" ? <ArrowUp size={14}/> : <ArrowDown size={14}/>) : <ArrowUpDown size={14} className="opacity-20"/>}
                  </div>
                </th>
                <th className="px-6 py-5">Avatar</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white font-bold tracking-tight">{user.username}</span>
                      <span className="text-slate-500 text-xs">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${roleStyles(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-800 border border-white/10 overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500"><User size={20}/></div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* HIỆN LUÔN CÁC NÚT ACTIONS */}
                    <div className="flex justify-end gap-2">
                      {user.role === "superadmin" ? (
                        <div className="p-2 text-emerald-500 bg-emerald-500/10 rounded-lg" title="Superadmin Protected">
                          <ShieldCheck size={18}/>
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => { setSelectedUser(user); setMode("edit"); setIsOpen(true); }}
                            className="p-2 text-amber-400 hover:bg-amber-400/20 bg-amber-400/5 rounded-lg transition-all active:scale-90"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(user._id, user.role)}
                            className="p-2 text-rose-500 hover:bg-rose-500/20 bg-rose-500/5 rounded-lg transition-all active:scale-90"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION AREA - FIX MÀU CHỮ */}
        <div className="p-6 border-t border-white/5 bg-white/1 text-white">
          <div className="admin-pagination-dark"> 
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

      <EditUserModal
        open={isOpen}
        setOpen={setIsOpen}
        user={selectedUser}
        currentUser={currentUser}
        onSubmit={handleSubmit}
        mode={mode}
      />
    </div>
  );
};

export default AdminUserManagement;