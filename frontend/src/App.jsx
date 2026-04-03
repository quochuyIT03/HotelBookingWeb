import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminPage from "./pages/AdminPage";
import AdminSidebar from "./components/AdminSidebar";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminProfile from "./pages/AdminProfile";
import AdminHotelManagement from "./pages/AdminHotelManagement";
import AdminBookingManagement from "./pages/AdminBookingManagement";
import AdminSettings from "./pages/AdminSettings";
import AddHotel from "./pages/AddHotel";
import EditHotel from "./pages/EditHotel";
import AdminRoomManagement from "./pages/AdminRoomManagement";
import HotelDetail from "./pages/HotelDetail";
import AddRoom from "./pages/AddRoom";
import EditRoom from "./pages/EditRoom";
import HotelPage from "./pages/HotelPage";
import HotelDetails from "./pages/HotelDetails";
import Checkout from "./pages/Checkout";
import MyBookings from "./pages/MyBookings";
import HotelList from "./pages/HotelList";
import AdminReviews from "./pages/AdminReview";
import Contact from "./pages/Contact";
import FavoritePage from "./pages/FavoritePage";
import AboutUs from "./pages/AboutUs";

function App() {
  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="*" element={<NotFound />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/hotels" element={<HotelPage />} />

          <Route path="/hotel/:id" element={<HotelDetails />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/hotels" element={<HotelList />} />
          
          <Route path="/my-bookings" element={<MyBookings />} />

          <Route path="/my-favorite" element={<FavoritePage />} />

          <Route path="/about" element={<AboutUs />} />

          <Route path="/admin" element={<AdminSidebar />}>
            <Route index element={<AdminPage />} />
            <Route path="usersManagement" element={<AdminUserManagement/>}/>
            <Route path="adminProfile" element={<AdminProfile/>}/>
            <Route path="hotelsManagement" element={<AdminHotelManagement/>}/>
            <Route path="bookingsManagement" element={<AdminBookingManagement/>}/>
            <Route path="reviewsManagement" element={<AdminReviews/>}/>
            <Route path="adminSettings" element={<AdminSettings/>}/>
            <Route path="addHotel" element={<AddHotel/>}/>
            <Route path="editHotel/:id" element={<EditHotel/>}/>
            <Route path="roomsManagement" element={<AdminRoomManagement/>}/>
            <Route path="hotels/:id" element={<HotelDetail />}/>
            <Route path="hotels/:id/rooms/add" element={<AddRoom />}/>
            <Route path="rooms/edit/:id" element={<EditRoom/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
