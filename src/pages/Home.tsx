
import React from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'

const Home: React.FC = () => {
  const categories = [
    { name: 'อาหารไทย', icon: '🍛', count: 15 },
    { name: 'อาหารจีน', icon: '🥟', count: 8 },
    { name: 'อาหารฝรั่ง', icon: '🍕', count: 12 },
    { name: 'เครื่องดื่ม', icon: '🧋', count: 6 },
    { name: 'ของหวาน', icon: '🍰', count: 10 },
    { name: 'อาหารเจ', icon: '🥗', count: 5 },
  ]

  const popularDishes = [
    { name: 'ส้มตำไทย', price: 40, image: '/api/placeholder/300/200', restaurant: 'ร้านส้มตำป้าแดง', rating: 4.5 },
    { name: 'ข้าวผัดกุ้ง', price: 60, image: '/api/placeholder/300/200', restaurant: 'ร้านข้าวผัดลุงโจ้', rating: 4.3 },
    { name: 'ต้มยำกุ้ง', price: 80, image: '/api/placeholder/300/200', restaurant: 'ร้านอาหารป้าแสง', rating: 4.7 },
    { name: 'แกงเขียวหวาน', price: 70, image: '/api/placeholder/300/200', restaurant: 'ร้านครัวคุณยาย', rating: 4.4 },
  ]

  const promotions = [
    { title: 'ลดราคา 50%', subtitle: 'สำหรับลูกค้าใหม่', color: 'bg-red-500' },
    { title: 'ฟรีค่าส่ง', subtitle: 'เมื่อสั่งครบ 200 บาท', color: 'bg-green-500' },
    { title: 'แลกคะแนน', subtitle: 'รับส่วนลด 20%', color: 'bg-blue-500' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Tourderwang
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              สั่งอาหารออนไลน์ที่วังสามหมอ อุดรธานี
            </p>
            <div className="max-w-2xl mx-auto md:hidden">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Promotions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {promotions.map((promo, index) => (
            <div key={index} className={`${promo.color} text-white p-6 rounded-lg shadow-md`}>
              <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
              <p className="opacity-90">{promo.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">หมวดหมู่อาหาร</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/restaurants"
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} ร้าน</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Dishes */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">เมนูยอดนิยม</h2>
            <Link to="/restaurants" className="text-primary-500 hover:text-primary-600 font-medium">
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">📸</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{dish.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{dish.restaurant}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary-500">{dish.price} ฿</span>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-yellow-400">⭐</span>
                      <span className="ml-1">{dish.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">พร้อมสั่งอาหารแล้วหรือยัง?</h2>
          <p className="text-gray-600 mb-6">เลือกจากร้านอาหารมากมายในวังสามหมอ</p>
          <Link
            to="/restaurants"
            className="inline-block bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
          >
            เริ่มสั่งอาหาร
          </Link>
        </section>
      </div>
    </div>
  )
}

export default Home
