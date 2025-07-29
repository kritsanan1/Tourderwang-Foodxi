
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { orderService } from '../lib/supabase'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    delivery_address: '',
    phone: '',
    notes: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Group items by restaurant
      const restaurantItems = items.reduce((acc, item) => {
        const restaurantId = item.menu_item.restaurant_id
        if (!acc[restaurantId]) {
          acc[restaurantId] = []
        }
        acc[restaurantId].push(item)
        return acc
      }, {} as Record<string, typeof items>)

      // Create orders for each restaurant
      const orderPromises = Object.entries(restaurantItems).map(
        ([restaurantId, restaurantItems]) => {
          const restaurantTotal = restaurantItems.reduce(
            (sum, item) => sum + item.menu_item.price * item.quantity,
            0
          )

          return orderService.create({
            restaurant_id: restaurantId,
            total_amount: restaurantTotal,
            delivery_address: formData.delivery_address,
            phone: formData.phone,
            notes: formData.notes,
            items: restaurantItems.map((item) => ({
              menu_item_id: item.menu_item.id,
              quantity: item.quantity,
              price: item.menu_item.price,
            })),
          })
        }
      )

      await Promise.all(orderPromises)
      clearCart()
      navigate('/orders', {
        state: { message: 'สั่งอาหารสำเร็จ! ติดตามสถานะได้ที่หน้าออเดอร์' },
      })
    } catch (error) {
      console.error('Error creating order:', error)
      alert('เกิดข้อผิดพลาดในการสั่งอาหาร กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ยืนยันการสั่งซื้อ</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              สรุปคำสั่งซื้อ
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.menu_item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.menu_item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      จำนวน {item.quantity} x ฿{item.menu_item.price}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ฿{(item.menu_item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    ยอดรวม:
                  </span>
                  <span className="text-xl font-bold text-primary-500">
                    ฿{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ข้อมูลการจัดส่ง
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="delivery_address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ที่อยู่จัดส่ง *
                </label>
                <textarea
                  id="delivery_address"
                  name="delivery_address"
                  required
                  rows={3}
                  value={formData.delivery_address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="กรุณากรอกที่อยู่จัดส่งที่ชัดเจน"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  เบอร์โทรศัพท์ *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0xx-xxx-xxxx"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  หมายเหตุ (ไม่บังคับ)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="หมายเหตุเพิ่มเติม เช่น ไม่ใส่ผักชี, เผ็ดน้อย"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <svg
                    className="w-5 h-5 text-yellow-400 mr-2 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      การชำระเงิน
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      ปัจจุบันรองรับการชำระเงินปลายทางเท่านั้น
                      ระบบการชำระเงินออนไลน์จะเปิดให้บริการเร็วๆ นี้
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-500 hover:bg-primary-600'
                }`}
              >
                {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
