
import React from 'react'
import { Link } from 'react-router-dom'

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
    { name: 'ส้มตำไทย', price: 40, image: '/api/placeholder/300/200', restaurant: 'ร้านส้มตำป้าแดง' },
    { name: 'ข้าวผ่ดกุ้ง', price: 60, image: '/api/placeholder/300/200', restaurant: 'ร้านข้าวผัดลุงโจ้' },
    { name: 'ต้มยำกุ้ง', price: 80, image: '/api/placeholder/300/200', restaurant: 'ร้านต้มยำแม่นาง' },
    { name: 'ผัดไทย', price: 50, image: '/api/placeholder/300/200', restaurant: 'ร้านผัดไทยเจ๊นาค' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              อร่อยถึงบ้าน
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              สั่งอาหารจากร้านโปรดในวังสามหมอ ได้ทุกเวลา
            </p>
            <Link
              to="/restaurants"
              className="inline-block bg-white text-primary-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
            >
              เริ่มสั่งอาหาร
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            หมวดหมู่อาหาร
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/restaurants?category=${encodeURIComponent(category.name)}`}
                className="bg-gray-50 hover:bg-primary-50 rounded-xl p-6 text-center transition-colors group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 group-hover:text-primary-600">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.count} ร้าน
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            เมนูยอดนิยม
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">รูปภาพอาหาร</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {dish.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {dish.restaurant}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600 font-bold text-lg">
                      ฿{dish.price}
                    </span>
                    <button className="bg-primary-500 hover:bg-primary-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                      สั่งเลย
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมเริ่มสั่งอาหารแล้วหรือยัง?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            ลงทะเบียนวันนี้ และรับส่วนลด 20% สำหรับออเดอร์แรก
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors"
          >
            สมัครสมาชิก
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
