
import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
}

interface CartItem extends MenuItem {
  quantity: number
}

const RestaurantMenu: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด')

  // Mock restaurant data
  const restaurant = {
    id: id || '1',
    name: 'ร้านส้มตำป้าแดง',
    description: 'ส้มตำ ลาบ ก้อย อาหารอีสานแท้',
    rating: 4.5,
    deliveryTime: '20-30 นาที',
    deliveryFee: 20,
    minimumOrder: 100
  }

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'ส้มตำไทย',
      description: 'ส้มตำรสชาติแท้ เผ็ดร้อน หวาน เปรี้ยว',
      price: 40,
      image: '/api/placeholder/300/200',
      category: 'ส้มตำ',
      available: true
    },
    {
      id: '2',
      name: 'ส้มตำปู',
      description: 'ส้มตำใส่ปูนา รสชาติเข้มข้น',
      price: 60,
      image: '/api/placeholder/300/200',
      category: 'ส้มตำ',
      available: true
    },
    {
      id: '3',
      name: 'ลابหมู',
      description: 'ลาบหมูสูตรโบราณ เครื่องเทศหอมเข้มข้น',
      price: 80,
      image: '/api/placeholder/300/200',
      category: 'ลาบ',
      available: true
    },
    {
      id: '4',
      name: 'ลาบเนื้อ',
      description: 'ลาบเนื้อสดใหม่ รสชาติอร่อย',
      price: 90,
      image: '/api/placeholder/300/200',
      category: 'ลาบ',
      available: false
    },
    {
      id: '5',
      name: 'ก้อยกุ้ง',
      description: 'ก้อยกุ้งสด เปรี้ยวหวาน เผ็ดกำลังดี',
      price: 120,
      image: '/api/placeholder/300/200',
      category: 'ก้อย',
      available: true
    },
    {
      id: '6',
      name: 'ข้าวเหนียว',
      description: 'ข้าวเหนียวสด นุ่ม หอม',
      price: 15,
      image: '/api/placeholder/300/200',
      category: 'ข้าว',
      available: true
    }
  ]

  const categories = ['ทั้งหมด', ...Array.from(new Set(menuItems.map(item => item.category)))]

  const filteredItems = selectedCategory === 'ทั้งหมด' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId)
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      } else {
        return prevCart.filter(cartItem => cartItem.id !== itemId)
      }
    })
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Restaurant Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <Link to="/restaurants" className="text-primary-500 hover:text-primary-600 mb-4 inline-block">
          ← กลับไปรายการร้านอาหาร
        </Link>
        
        <div className="flex items-start space-x-4">
          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-2xl">🏪</span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
            <p className="text-gray-600 mb-2">{restaurant.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="text-yellow-400">⭐</span>
                <span className="ml-1">{restaurant.rating}</span>
              </div>
              <span>🕒 {restaurant.deliveryTime}</span>
              <span>🚚 {restaurant.deliveryFee} ฿</span>
              <span>📦 ขั้นต่ำ {restaurant.minimumOrder} ฿</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu */}
        <div className="lg:col-span-3">
          {/* Category Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-500">📸</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-500">{item.price} ฿</span>
                    
                    {item.available ? (
                      <div className="flex items-center space-x-2">
                        {cart.find(cartItem => cartItem.id === item.id) ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center"
                            >
                              −
                            </button>
                            <span className="font-medium">
                              {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-8 h-8 rounded-full bg-primary-500 text-white hover:bg-primary-600 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                          >
                            เพิ่ม
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 px-4 py-2">หมด</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ตรวจสอบออเดอร์</h3>
            
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">ยังไม่มีสินค้าในตระกร้า</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-gray-600 text-xs">{item.price} ฿ × {item.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-6 h-6 rounded-full bg-primary-500 text-white hover:bg-primary-600 flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>รวม ({getTotalItems()} รายการ)</span>
                    <span className="font-semibold">{getTotalPrice()} ฿</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>ค่าส่ง</span>
                    <span>{restaurant.deliveryFee} ฿</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center font-bold text-lg">
                    <span>ยอดรวมทั้งสิ้น</span>
                    <span className="text-primary-500">{getTotalPrice() + restaurant.deliveryFee} ฿</span>
                  </div>
                  
                  {getTotalPrice() >= restaurant.minimumOrder ? (
                    <button className="w-full mt-4 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors">
                      สั่งอาหาร
                    </button>
                  ) : (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        สั่งอีก {restaurant.minimumOrder - getTotalPrice()} ฿ เพื่อจัดส่ง
                      </p>
                      <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed">
                        สั่งอาหาร
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantMenu
