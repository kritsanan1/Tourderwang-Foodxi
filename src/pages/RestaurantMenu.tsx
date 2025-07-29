
import React from 'react'
import { useParams } from 'react-router-dom'

const RestaurantMenu: React.FC = () => {
  const { id } = useParams()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">เมนูร้านอาหาร #{id}</h1>
      <div className="text-center text-gray-600 py-20">
        <p className="text-xl">กำลังพัฒนา - เมนูจะแสดงที่นี่</p>
      </div>
    </div>
  )
}

export default RestaurantMenu
