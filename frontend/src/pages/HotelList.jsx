import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const HotelList = () => {
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  // Lấy các tham số từ URL
  const searchParams = new URLSearchParams(location.search);
  const city = searchParams.get("city");

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        // Gọi đến đúng route search bạn vừa tạo ở Backend
        const res = await fetch(`${window.BASE_URL}/hotels/searchHotel?city=${city}`);
        const data = await res.json();
        setHotels(data);
      } catch (error) {
        console.log("Lỗi tải danh sách khách sạn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [city]); // Khi người dùng search thành phố khác, nó sẽ tự gọi lại API

  return (
    <div>
      <h2>Kết quả tìm kiếm tại: {city}</h2>
      <div className="grid grid-cols-3 gap-4">
        {hotels.map(hotel => (
          <HotelCard key={hotel._id} item={hotel} />
        ))}
      </div>
    </div>
  );
};

export default HotelList