import CategoryCardSection from '@/components/CategoryCardSection'
import CategoryCityTravel from '@/components/CategoryCityTravel'
import CategoryHotel from '@/components/CategoryHotel'
import ContentArea from '@/components/ContentArea'
import CustomerFeedBack from '@/components/CustomerFeedBack'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import WhyChooseUs from '@/components/WhyChooseUs'
import React from 'react'

const HomePage = () => {
  return (
    <div className="min-h-screen w-full bg-white relative">
  {/* Teal Glow Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #14b8a6 100%)
      `,
      backgroundSize: "100% 100%",
    }}
  />
  {/* Your Content/Components */}

    <div className='mx-auto z-50 relative '>
      <Navbar/> 
      <Hero />
      <ContentArea/>
      <CategoryCardSection/>
      <CategoryCityTravel/>
      <CategoryHotel/>
      <WhyChooseUs/>
      <CustomerFeedBack/>

      <Footer />
    </div>


    </div>
  )
}

export default HomePage