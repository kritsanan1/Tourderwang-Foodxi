
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface OrderStatus {
  id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled'
  created_at: string
  estimated_delivery: string
  restaurant: {
    name: string
    address: string
    phone: string
  }
  delivery_address: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  driver?: {
    name: string
    phone: string
    vehicle: string
    location?: { lat: number; lng: number }
  }
  total_amount: number
}

const statusSteps = [
  { key: 'pending', label: 'รอยืนยัน', icon: '⏳' },
  { key: 'confirmed', label: 'ยืนยันแล้ว', icon: '✅' },
  { key: 'preparing', label: 'กำลังเตรียม', icon: '👨‍🍳' },
  { key: 'ready', label: 'พร้อมส่ง', icon: '📦' },
  { key: 'picked_up', label: 'กำลังจัดส่ง', icon: '🚗' },
  { key: 'delivered', label: 'จัดส่งแล้ว', icon: '🎉' }
]

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liveUpdates, setLiveUpdates] = useState(true)

  useEffect(() => {
    if (!orderId) return

    const loadOrder = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            restaurant:restaurants(*),
            order_items:order_items(
              quantity,
              price,
              menu_item:menu_items(name)
            )
          `)
          .eq('id', orderId)
          .single()

        if (error) throw error

        setOrder({
          ...data,
          items: data.order_items.map((item: any) => ({
            name: item.menu_item.name,
            quantity: item.quantity,
            price: item.price
          }))
        })
      } catch (err) {
        console.error('Error loading order:', err)
        setError('ไม่พบข้อมูลออเดอร์')
      } finally {
        setLoading(false)
      }
    }

    loadOrder()

    // Set up real-time subscription
    const subscription = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          setOrder(prev => prev ? { ...prev, ...payload.new } : null)
          
          // Show notification for status changes
          if (payload.new.status !== payload.old.status) {
            showStatusNotification(payload.new.status)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [orderId])

  const showStatusNotification = (newStatus: string) => {
    const statusInfo = statusSteps.find(step => step.key === newStatus)
    if (statusInfo && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('อัปเดตสถานะออเดอร์', {
        body: `ออเดอร์ของคุณ: ${statusInfo.label}`,
        icon: '/favicon.png'
      })
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  const getCurrentStepIndex = () => {
    if (!order) return 0
    return statusSteps.findIndex(step => step.key === order.status)
  }

  const estimateRemainingTime = () => {
    if (!order) return null
    
    const now = new Date()
    const estimated = new Date(order.estimated_delivery)
    const diff = estimated.getTime() - now.getTime()
    
    if (diff <= 0) return 'กำลังจัดส่ง'
    
    const minutes = Math.floor(diff / (1000 * 60))
    if (minutes < 60) return `${minutes} นาที`
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours} ชั่วโมง ${remainingMinutes} นาที`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'ไม่พบข้อมูลออเดอร์'}
          </h1>
          <button
            onClick={() => window.location.href = '/orders'}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition duration-200"
          >
            กลับไปหน้าออเดอร์
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ติดตามออเดอร์ #{order.id.slice(-8)}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>สั่งเมื่อ: {new Date(order.created_at).toLocaleString('th-TH')}</span>
            <span>•</span>
            <span>เวลาที่คาดว่าจะส่งถึง: {estimateRemainingTime()}</span>
          </div>
        </div>

        {/* Notification Permission */}
        {'Notification' in window && Notification.permission === 'default' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">รับการแจ้งเตือนสถานะออเดอร์</h3>
                <p className="text-sm text-blue-700">อนุญาตการแจ้งเตือนเพื่อรับข้อมูลสถานะล่าสุด</p>
              </div>
              <button
                onClick={requestNotificationPermission}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                อนุญาต
              </button>
            </div>
          </div>
        )}

        {/* Status Progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">สถานะออเดอร์</h2>
          <div className="relative">
            <div className="flex justify-between items-center">
              {statusSteps.map((step, index) => {
                const currentIndex = getCurrentStepIndex()
                const isCompleted = index <= currentIndex
                const isCurrent = index === currentIndex
                
                return (
                  <div key={step.key} className="flex flex-col items-center relative">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2
                      ${isCompleted 
                        ? 'bg-primary-500 border-primary-500 text-white' 
                        : 'bg-gray-100 border-gray-300'
                      }
                      ${isCurrent ? 'ring-4 ring-primary-200' : ''}
                    `}>
                      {step.icon}
                    </div>
                    <div className={`
                      mt-2 text-sm text-center
                      ${isCompleted ? 'text-primary-600 font-medium' : 'text-gray-500'}
                    `}>
                      {step.label}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className={`
                        absolute top-6 left-full w-full h-0.5
                        ${index < currentIndex ? 'bg-primary-500' : 'bg-gray-300'}
                      `} style={{ transform: 'translateX(-50%)' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Restaurant Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">ร้านอาหาร</h3>
            <div className="space-y-2">
              <p className="font-medium">{order.restaurant.name}</p>
              <p className="text-gray-600 text-sm">📍 {order.restaurant.address}</p>
              <p className="text-gray-600 text-sm">📞 {order.restaurant.phone}</p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">ที่อยู่จัดส่ง</h3>
            <p className="text-gray-600">{order.delivery_address}</p>
            
            {order.driver && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">ผู้ส่งของ</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>👤 {order.driver.name}</p>
                  <p>📞 {order.driver.phone}</p>
                  <p>🚗 {order.driver.vehicle}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">รายการอาหาร</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500 ml-2">x{item.quantity}</span>
                </div>
                <span className="font-medium">{item.price * item.quantity} ฿</span>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>ยอดรวมทั้งสิ้น</span>
                <span className="text-primary-500">{order.total_amount} ฿</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Updates Toggle */}
        <div className="bg-white rounded-lg shadow-md p-4 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">อัปเดตสดใส</span>
              <p className="text-sm text-gray-600">รับข้อมูลสถานะล่าสุดแบบเรียลไทม์</p>
            </div>
            <button
              onClick={() => setLiveUpdates(!liveUpdates)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${liveUpdates ? 'bg-primary-500' : 'bg-gray-300'}
              `}
            >
              <span className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${liveUpdates ? 'translate-x-6' : 'translate-x-1'}
              `} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
