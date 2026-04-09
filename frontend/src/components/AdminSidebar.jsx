import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "./ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Hotel,
  CalendarCheck,
  Settings,
  ChevronUp,
  DoorClosed,
  MessageCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, Outlet, useLocation } from "react-router";

const AdminSidebar = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const getUser = JSON.parse(localStorage.getItem("user"));
        if (!getUser?._id) return;

        const res = await fetch(
          `http://localhost:5001/api/users/${getUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  // Chỉnh hover nhẹ nhàng trên nền tối và active màu Indigo cho nổi bật
  const menuItemClass =
    "transition-all duration-100 rounded-lg hover:bg-white/80 text-slate-300 data-[active=true]:bg-indigo-600 data-[active=true]:text-white";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#0a0a0c]">
        {/* SIDEBAR - Nền đen chuẩn */}
        <Sidebar
          collapsible="icon"
          className="group border-r border-white/5 w-64 transition-all duration-200 group-data-[collapsible=icon]:w-16 bg-[#0f0f12]"
        >
          {/* HEADER - Đã fix màu chữ tiêu đề */}
          <SidebarHeader className="ml-0.5 pt-3 pb-3 text-left bg-[#0f0f12]">
            <div className="flex flex-1 justify-between items-center px-2">
              <p className="font-bold text-2xl truncate group-data-[collapsible=icon]:hidden text-white">
                Admin Panel
              </p>
              <SidebarTrigger className="hover:cursor-pointer text-slate-400 hover:text-white hover:bg-white/10 rounded-md p-1" />
            </div>
          </SidebarHeader>

          <SidebarSeparator className="bg-white/5" />

          <SidebarContent className="bg-[#0f0f12]">
            {/* Dashboard */}
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                Dashboard
              </SidebarGroupLabel>

              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    data-active={location.pathname === "/admin"}
                    className={menuItemClass}
                  >
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
                    >
                      <LayoutDashboard size={20} />
                      <span className="group-data-[collapsible=icon]:hidden font-medium">
                        Trang chủ
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            {/* Management */}
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                Management
              </SidebarGroupLabel>

              <SidebarMenu className="gap-1">
                {[
                  { to: "/admin/usersManagement", icon: Users, label: "Users" },
                  { to: "/admin/hotelsManagement", icon: Hotel, label: "Hotels" },
                  { to: "/admin/roomsManagement", icon: DoorClosed, label: "Rooms" },
                  { to: "/admin/bookingsManagement", icon: CalendarCheck, label: "Bookings" },
                  { to: "/admin/reviewsManagement", icon: MessageCircle, label: "Reviews" },
                ].map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      data-active={location.pathname.includes(item.to.split('/').pop())}
                      className={menuItemClass}
                    >
                      <Link
                        to={item.to}
                        className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
                      >
                        <item.icon size={20} />
                        <span className="group-data-[collapsible=icon]:hidden font-medium">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>

            {/* System */}
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-slate-500 font-bold text-[11px] uppercase tracking-wider">
                System
              </SidebarGroupLabel>

              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={menuItemClass}
                    asChild
                    data-active={location.pathname.includes("adminSettings")}
                  >
                    <Link
                      to="/admin/adminSettings"
                      className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
                    >
                      <Settings size={20} />
                      <span className="group-data-[collapsible=icon]:hidden font-medium">
                        Settings
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          {/* FOOTER */}
          <SidebarFooter className="bg-[#0f0f12] border-t border-white/5 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group-data-[collapsible=icon]:justify-center transition-colors">
                  <div className="h-9 w-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center overflow-hidden shrink-0">
                    {user?.avatar ? (
                      <img src={user?.avatar} className="w-full h-full object-cover" alt="avatar" />
                    ) : (
                      <span className="text-xs font-bold text-indigo-400">
                        {user?.profile?.fullname?.charAt(0) || "A"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden overflow-hidden">
                    <span className="font-bold text-white truncate lowercase italic">
                      {user?.profile?.fullname || "Admin"}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronUp className="h-4 w-4 text-slate-600 ml-auto group-data-[collapsible=icon]:hidden" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="end" className="w-56 bg-[#1a1a1c] border-white/10 text-white p-2 rounded-xl shadow-2xl">
                <DropdownMenuItem asChild className="rounded-lg hover:bg-white/5 cursor-pointer p-3">
                    <Link to="/admin/adminProfile" className="flex items-center gap-2 text-sm font-medium">Profile</Link>
                </DropdownMenuItem>
                <div className="h-px bg-white/5 my-1" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg hover:bg-red-500/10 text-red-500 cursor-pointer p-3 text-sm font-medium">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* CONTENT AREA */}
        <SidebarInset className="flex-1 bg-[#0a0a0c]">
          <div className="p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminSidebar;