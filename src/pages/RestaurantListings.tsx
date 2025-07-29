
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface Restaurant {
  id: string
  name: string
  description: string
  cuisineType: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  image: string
  isOpen: boolean
}

const RestaurantListings: React.FC = () => {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('rating')

  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'ร้านส้มตำป้าแดง',
      description: 'ส้มตำ ลาบ ก้อย อาหารอีสานแท้',
      cuisineType: 'อาหารไทย',
      rating: 4.5,
      deliveryTime: '20-30 นาที',
      deliveryFee: 20,
      image: '/api/placeholder/400/250',
      isOpen: true
    },
    {
      id: '2',
      name: 'ร้านข้าวผัดลุงโจ้',
      description: 'ข้าวผัด ผัดไทย อาหารจานเดียว',
      cuisineType: 'อาหารไทย',
      rating: 4.3,
      deliveryTime: '15-25 นาที',
      deliveryFee: 15,
      image: '/api/placeholder/400/250',
      isOpen: true
    },
    {
      id: '3',
      name: 'Golden Dragon',
      description: 'อาหารจีนแท้ ติ่มซำ เป็ดปักกิ่ง',
      cuisineType: 'อาหารจีน',
      rating: 4.7,
      deliveryTime: '25-35 นาที',
      deliveryFee: 25,
      image: '/api/placeholder/400/250',
      isOpen: false
    },
    {
      id: '4',
      name: 'Pizza House',
      description: 'พิซซ่า เบอร์เกอร์ อาหารฝรั่ง',
      cuisineType: 'อาหารฝรั่ง',
      rating: 4.1,
      deliveryTime: '30-40 นาที',
      deliveryFee: 30,
      image: '/api/placeholder/400/250',
      isOpen: true
    },
    {
      id: '5',
      name: 'ครัวคุณยาย',
      description: 'อาหารไทยโบราณ แกงต่างๆ',
      cuisineType: 'อาหารไทย',
      rating: 4.4,
      deliveryTime: '20-30 นาที',
      deliveryFee: 20,
      image: '/api/placeholder/400/250',
      isOpen: true
    },
    {
      id: '6',
      name: 'Bubble Tea Cafe',
      description: 'ชาไข่มุก กาแฟ เครื่องดื่ม',
      cuisineType: 'เครื่องดื่ม',
      rating: 4.2,
      deliveryTime: '10-15 นาที',
      deliveryFee: 10,
      image: '/api/placeholder/400/250',
      isOpen: true
    }
  ]

  const cuisineTypes = ['all', 'อาหารไทย', 'อาหารจีน', 'อาหารฝรั่ง', 'เครื่องดื่ม']

  const filteredRestaurants = restaurants
    .filter(restaurant => filter === 'all' || restaurant.cuisineType === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'deliveryTime':
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
        case 'deliveryFee':
          return a.deliveryFee - b.deliveryFee
        default:
          return 0
      }
    })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">ร้านอาหารในวังสามหมอ</h1>
        <p className="text-gray-600">พบ {filteredRestaurants.length} ร้านอาหาร</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          {/* Cuisine Filter */}
          <div className="flex flex-wrap gap-2">
            {cuisineTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === type
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'ทั้งหมด' : type}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">เรียงตาม:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="rating">คะแนน</option>
              <option value="deliveryTime">เวลาส่ง</option>
              <option value="deliveryFee">ค่าส่ง</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <Link
            key={restaurant.id}
            to={`/restaurant/${restaurant.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-4xl">🏪</span>
              </div>
              {!restaurant.isOpen && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">ปิดอยู่</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-yellow-400">⭐</span>
                  <span className="ml-1">{restaurant.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-2">{restaurant.description}</p>
              <p className="text-primary-500 text-sm font-medium mb-3">{restaurant.cuisineType}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>🕒 {restaurant.deliveryTime}</span>
                <span>🚚 {restaurant.deliveryFee} ฿</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">ไม่พบร้านอาหารที่ตรงกับเงื่อนไข</p>
        </div>
      )}
    </div>
  )
}

export default RestaurantListings
