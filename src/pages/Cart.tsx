
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { menuService } from '../lib/supabase'

interface MenuItem {
  id: string
  name: string
  price: number
  image_url?: string
  restaurant_id: string
}

interface PromoCode {
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  minimum_order: number
  description: string
}

export default function Cart() {
  const { user } = useAuth()
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const navigate = useNavigate()
  
  const [recommendedItems, setRecommendedItems] = useState<MenuItem[]>([])
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [promoError, setPromoError] = useState('')
  const [deliveryFee, setDeliveryFee] = useState(25)
  const [loading, setLoading] = useState(false)

  // Available promo codes (in real app, this would come from backend)
  const availablePromos: PromoCode[] = [
    {
      code: 'WELCOME10',
      discount_type: 'percentage',
      discount_value: 10,
      minimum_order: 100,
      description: 'ลด 10% สำหรับลูกค้าใหม่'
    },
    {
      code: 'SAVE50',
      discount_type: 'fixed',
      discount_value: 50,
      minimum_order: 200,
      description: 'ลด 50฿ เมื่อสั่งครบ 200฿'
    },
    {
      code: 'FREESHIP',
      discount_type: 'fixed',
      discount_value: 25,
      minimum_order: 150,
      description: 'ฟรีค่าส่ง เมื่อสั่งครับ 150฿'
    }
  ]

  useEffect(() => {
    if (items.length > 0) {
      loadRecommendations()
    }
  }, [items])

  const loadRecommendations = async () => {
    try {
      // Get restaurant IDs from current cart items
      const restaurantIds = [...new Set(items.map(item => item.menu_item.restaurant_id))]
      
      // Load popular items from the same restaurants
      const recommendations = await menuService.getPopularFromRestaurants(restaurantIds, 4)
      
      // Filter out items already in cart
      const cartItemIds = items.map(item => item.menu_item.id)
      const filteredRecommendations = recommendations.filter(
        item => !cartItemIds.includes(item.id)
      )
      
      setRecommendedItems(filteredRecommendations)
    } catch (error) {
      console.error('Error loading recommendations:', error)
    }
  }

  const applyPromoCode = () => {
    const promo = availablePromos.find(p => p.code === promoCode.toUpperCase())
    
    if (!promo) {
      setPromoError('รหัสโปรโมชั่นไม่ถูกต้อง')
      return
    }
    
    if (total < promo.minimum_order) {
      setPromoError(`ยอดสั่งซื้อขั้นต่ำ ${promo.minimum_order}฿`)
      return
    }
    
    setAppliedPromo(promo)
    setPromoError('')
    setPromoCode('')
    
    // Special handling for free shipping
    if (promo.code === 'FREESHIP') {
      setDeliveryFee(0)
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    setDeliveryFee(25) // Reset delivery fee
  }

  const calculateDiscount = () => {
    if (!appliedPromo) return 0
    
    if (appliedPromo.discount_type === 'percentage') {
      return Math.round(total * (appliedPromo.discount_value / 100))
    } else {
      return appliedPromo.discount_value
    }
  }

  const getFinalTotal = () => {
    const discount = calculateDiscount()
    return total - discount + deliveryFee
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    
    const checkoutData = {
      items,
      subtotal: total,
      discount: calculateDiscount(),
      deliveryFee,
      total: getFinalTotal(),
      promoCode: appliedPromo?.code
    }
    
    navigate('/checkout', { state: checkoutData })
  }

  const addRecommendedItem = async (item: MenuItem) => {
    setLoading(true)
    try {
      // In a real app, you'd add this through the cart context
      // For now, we'll simulate the action
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove from recommendations after adding
      setRecommendedItems(prev => prev.filter(rec => rec.id !== item.id))
    } catch (error) {
      console.error('Error adding item:', error)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-12">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ตะกร้าสินค้าว่างเปล่า
            </h1>
            <p className="text-gray-600 mb-8">
              เริ่มเลือกอาหารอร่อยจากร้านในพื้นที่
            </p>
            <Link
              to="/restaurants"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition duration-200"
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
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ตะกร้าสินค้า</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.menu_item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.menu_item.image_url || '/placeholder-food.jpg'}
                    alt={item.menu_item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {item.menu_item.name}
                    </h3>
                    <p className="text-primary-500 font-medium">
                      {item.menu_item.price} ฿
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.menu_item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="font-medium text-lg w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menu_item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-primary-500 text-white hover:bg-primary-600 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.menu_item.id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {/* Recommended Items */}
            {recommendedItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">คุณอาจชอบ</h3>
                <div className="grid grid-cols-2 gap-4">
                  {recommendedItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <img
                        src={item.image_url || '/placeholder-food.jpg'}
                        alt={item.name}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-primary-500 font-medium">
                          {item.price} ฿
                        </span>
                        <button
                          onClick={() => addRecommendedItem(item)}
                          disabled={loading}
                          className="bg-primary-500 text-white px-3 py-1 rounded text-sm hover:bg-primary-600 transition duration-200 disabled:opacity-50"
                        >
                          เพิ่ม
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">สรุปการสั่งซื้อ</h3>
              
              {/* Promo Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รหัสโปรโมชั่น
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="ใส่รหัสโปรโมชั่น"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="bg-primary-500 text-white px-4 py-2 rounded-md text-sm hover:bg-primary-600 transition duration-200"
                  >
                    ใช้
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-sm mt-1">{promoError}</p>
                )}
                {appliedPromo && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 text-sm font-medium">
                        {appliedPromo.description}
                      </span>
                      <button
                        onClick={removePromoCode}
                        className="text-green-700 hover:text-green-900"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Available Promos */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  โปรโมชั่นที่ใช้ได้
                </h4>
                <div className="space-y-2">
                  {availablePromos.filter(promo => 
                    total >= promo.minimum_order && (!appliedPromo || appliedPromo.code !== promo.code)
                  ).map((promo) => (
                    <button
                      key={promo.code}
                      onClick={() => {
                        setPromoCode(promo.code)
                        applyPromoCode()
                      }}
                      className="w-full text-left p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-200"
                    >
                      <div className="font-medium text-sm">{promo.code}</div>
                      <div className="text-xs text-gray-600">{promo.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span>ยอดรวม</span>
                  <span>{total} ฿</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>ส่วนลด ({appliedPromo.code})</span>
                    <span>-{calculateDiscount()} ฿</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>ค่าส่ง</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'ฟรี' : `${deliveryFee} ฿`}
                  </span>
                </div>
                
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>ยอดรวมทั้งสิ้น</span>
                  <span className="text-primary-500">{getFinalTotal()} ฿</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition duration-200"
              >
                ดำเนินการชำระเงิน
              </button>

              <button
                onClick={() => navigate('/restaurants')}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
              >
                เลือกเพิ่มเติม
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
