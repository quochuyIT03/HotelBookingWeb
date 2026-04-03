import React from "react";
import { ShieldCheck, CircleDollarSign, Hotel, Headset } from "lucide-react";

const features = [
  {
    icon: <CircleDollarSign className="w-10 h-10 text-blue-600" />,
    title: "Giá tốt nhất",
    desc: "Chúng tôi cam kết mang lại mức giá cạnh tranh và nhiều ưu đãi hấp dẫn nhất."
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-green-600" />,
    title: "Thanh toán an toàn",
    desc: "Hệ thống bảo mật đạt chuẩn quốc tế, bảo vệ thông tin giao dịch của bạn tuyệt đối."
  },
  {
    icon: <Hotel className="w-10 h-10 text-purple-600" />,
    title: "10.000+ Khách sạn",
    desc: "Mạng lưới đối tác rộng khắp toàn quốc, từ homestay đến resort hạng sang."
  },
  {
    icon: <Headset className="w-10 h-10 text-orange-600" />,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ chuyên viên tận tâm luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào, bất cứ nơi đâu."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
          Tại sao nên đặt phòng với chúng tôi?
        </h2>
        <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((item, index) => (
          <div 
            key={index} 
            className="group p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="mb-6 inline-block p-4 rounded-2xl bg-gray-50 group-hover:bg-blue-50 transition-colors duration-300">
              {item.icon}
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-800">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;