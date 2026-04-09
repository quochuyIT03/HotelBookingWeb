import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const [status, setStatus] = useState('loading'); // loading, authorized, unauthorized

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      setStatus('authorized');
    } else {
      setStatus('unauthorized');
      // Dùng replace để xóa lịch sử, chặn nút Back
      window.location.replace("/"); 
    }
  }, []);

  if (status === 'loading') return null; // Hiện trang trắng khi đang check
  if (status === 'unauthorized') return null; // Hiện trang trắng nếu không có quyền

  return <Outlet />; // Đúng admin thì mới hiện nội dung bên trong
};

export default AdminProtectedRoute;