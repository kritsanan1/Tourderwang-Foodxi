import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import { Restaurant, restaurantService } from '../lib/supabase'

export default function Home() {
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedRestaurants = async () => {
      try {
        const restaurants = await restaurantService.getAll()
        setFeaturedRestaurants(restaurants.slice(0, 3)) // Show top 3 restaurants
      } catch (error) {
        console.error('Error loading featured restaurants:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedRestaurants()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            สั่งอาหารอร่อยจากวังสามหมอ
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            เชื่อมต่อคุณกับร้านอาหารท้องถิ่นที่ดีที่สุด
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ทำไมต้องเลือก Tourderwang?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                จัดส่งรวดเร็ว
              </h3>
              <p className="text-gray-600">
                จัดส่งภายใน 30-45 นาที ตรงเวลาทุกครั้ง
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ร้านอาหารท้องถิ่น
              </h3>
              <p className="text-gray-600">
                เลือกจากร้านอาหารคุณภาพในวังสามหมอ
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                คุณภาพเยี่ยม
              </h3>
              <p className="text-gray-600">
                อาหารสดใหม่ คุณภาพสูง จากร้านที่ผ่านการคัดเลือก
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Restaurants Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              ร้านอาหารยอดนิยม
            </h2>
            <Link
              to="/restaurants"
              className="text-primary-500 hover:text-primary-600 transition duration-200"
            >
              ดูทั้งหมด →
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                      <div className="h-4 bg-gray-300 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={restaurant.image_url || '/placeholder-restaurant.jpg'}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {restaurant.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-500 flex items-center">
                        ⭐ {restaurant.rating}
                      </span>
                      <Link
                        to={`/restaurant/${restaurant.id}`}
                        className="text-primary-500 hover:text-primary-600 transition duration-200"
                      >
                        ดูเมนู
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            พร้อมสั่งอาหารแล้วหรือยัง?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            สมัครสมาชิกวันนี้ รับส่วนลดพิเศษสำหรับออเดอร์แรก
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
          >
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </div>
  )
}