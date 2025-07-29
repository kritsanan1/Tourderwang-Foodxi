
import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

export default function Cart() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">ตะกร้าสินค้า</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2 8h14M9 21a1 1 0 100-2 1 1 0 000 2zM20 21a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              ตะกร้าของคุณว่างเปล่า
            </h2>
            <p className="text-gray-500 mb-6">
              เริ่มเลือกอาหารอร่อยจากร้านอาหารต่างๆ
            </p>
            <Link
              to="/restaurants"
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition duration-200"
            >
              เลือกร้านอาหาร
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ตะกร้าสินค้า</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 transition duration-200"
          >
            ล้างตะกร้า
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            {items.map((item) => (
              <div
                key={item.menu_item.id}
                className="flex items-center justify-between border-b border-gray-200 py-4 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.menu_item.image_url || '/placeholder-food.jpg'}
                    alt={item.menu_item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.menu_item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.menu_item.description}
                    </p>
                    <p className="text-primary-500 font-semibold">
                      ฿{item.menu_item.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.menu_item.id, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition duration-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.menu_item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition duration-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.menu_item.id)}
                    className="text-red-500 hover:text-red-700 transition duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">
                ยอดรวม:
              </span>
              <span className="text-2xl font-bold text-primary-500">
                ฿{total.toFixed(2)}
              </span>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition duration-200 flex items-center justify-center"
            >
              ดำเนินการชำระเงิน
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
