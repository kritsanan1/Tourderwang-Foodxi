
import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  created_at: string
}

interface Address {
  id: string
  label: string
  address: string
  is_default: boolean
}

interface OrderHistory {
  id: string
  created_at: string
  status: string
  total_amount: number
  restaurant_name: string
  items_count: number
}

interface UserPreferences {
  cuisine_preferences: string[]
  dietary_restrictions: string[]
  spice_level: 'mild' | 'medium' | 'hot'
  notifications: {
    order_updates: boolean
    promotions: boolean
    new_restaurants: boolean
  }
}

export default function UserProfile() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([])
  const [preferences, setPreferences] = useState<UserPreferences>({
    cuisine_preferences: [],
    dietary_restrictions: [],
    spice_level: 'medium',
    notifications: {
      order_updates: true,
      promotions: true,
      new_restaurants: false
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({ label: '', address: '' })

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Load user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (profileData) {
        setProfile(profileData)
      }

      // Load addresses
      const { data: addressData } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false })

      if (addressData) {
        setAddresses(addressData)
      }

      // Load order history
      const { data: orderData } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          total_amount,
          restaurant:restaurants(name),
          order_items:order_items(quantity)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (orderData) {
        setOrderHistory(orderData.map(order => ({
          id: order.id,
          created_at: order.created_at,
          status: order.status,
          total_amount: order.total_amount,
          restaurant_name: order.restaurant?.name || 'ไม่ระบุ',
          items_count: order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
        })))
      }

      // Load preferences
      const { data: preferencesData } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (preferencesData) {
        setPreferences(preferencesData)
      }

    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id)

      if (error) throw error

      setProfile(prev => prev ? { ...prev, ...updates } : null)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล')
    } finally {
      setSaving(false)
    }
  }

  const addAddress = async () => {
    if (!newAddress.address.trim()) return

    try {
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: user?.id,
          label: newAddress.label || 'ที่อยู่ใหม่',
          address: newAddress.address,
          is_default: addresses.length === 0
        })
        .select()
        .single()

      if (error) throw error

      setAddresses(prev => [...prev, data])
      setNewAddress({ label: '', address: '' })
      setShowAddAddress(false)
    } catch (error) {
      console.error('Error adding address:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มที่อยู่')
    }
  }

  const setDefaultAddress = async (addressId: string) => {
    try {
      // Remove default from all addresses
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user?.id)

      // Set new default
      await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)

      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          is_default: addr.id === addressId
        }))
      )
    } catch (error) {
      console.error('Error setting default address:', error)
    }
  }

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      setSaving(true)
      const updatedPreferences = { ...preferences, ...newPreferences }
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          ...updatedPreferences
        })

      if (error) throw error

      setPreferences(updatedPreferences)
    } catch (error) {
      console.error('Error updating preferences:', error)
      alert('เกิดข้อผิดพลาดในการอัปเดตการตั้งค่า')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: '👤' },
    { id: 'addresses', label: 'ที่อยู่', icon: '📍' },
    { id: 'orders', label: 'ประวัติการสั่ง', icon: '📋' },
    { id: 'preferences', label: 'การตั้งค่า', icon: '⚙️' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">บัญชีของฉัน</h1>
          <p className="text-gray-600">จัดการข้อมูลส่วนตัวและการตั้งค่า</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition duration-200
                      ${activeTab === tab.id
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={signOut}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                >
                  <span className="mr-3">🚪</span>
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">ข้อมูลส่วนตัว</h2>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">👤</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{profile?.name || 'ไม่ระบุชื่อ'}</h3>
                        <p className="text-gray-600">{profile?.email}</p>
                        <p className="text-sm text-gray-500">
                          สมาชิกตั้งแต่: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ชื่อ-นามสกุล
                        </label>
                        <input
                          type="text"
                          value={profile?.name || ''}
                          onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          หมายเลขโทรศัพท์
                        </label>
                        <input
                          type="tel"
                          value={profile?.phone || ''}
                          onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => updateProfile({
                        name: profile?.name,
                        phone: profile?.phone
                      })}
                      disabled={saving}
                      className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition duration-200 disabled:opacity-50"
                    >
                      {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                    </button>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">ที่อยู่การจัดส่ง</h2>
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition duration-200"
                    >
                      เพิ่มที่อยู่ใหม่
                    </button>
                  </div>

                  {showAddAddress && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="font-medium mb-4">เพิ่มที่อยู่ใหม่</h3>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="ป้ายชื่อ (เช่น บ้าน, ที่ทำงาน)"
                          value={newAddress.label}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                        <textarea
                          placeholder="ที่อยู่เต็ม"
                          value={newAddress.address}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={addAddress}
                            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition duration-200"
                          >
                            บันทึก
                          </button>
                          <button
                            onClick={() => setShowAddAddress(false)}
                            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition duration-200"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`
                          border rounded-lg p-4
                          ${address.is_default ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{address.label}</h3>
                              {address.is_default && (
                                <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded">
                                  ค่าเริ่มต้น
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mt-1">{address.address}</p>
                          </div>
                          {!address.is_default && (
                            <button
                              onClick={() => setDefaultAddress(address.id)}
                              className="text-primary-500 hover:text-primary-600 text-sm"
                            >
                              ตั้งเป็นค่าเริ่มต้น
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">ประวัติการสั่งอาหาร</h2>
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{order.restaurant_name}</h3>
                            <p className="text-sm text-gray-600">
                              {order.items_count} รายการ • {new Date(order.created_at).toLocaleDateString('th-TH')}
                            </p>
                            <div className="mt-2">
                              <span className={`
                                text-xs px-2 py-1 rounded-full
                                ${order.status === 'delivered' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                                }
                              `}>
                                {order.status === 'delivered' ? 'จัดส่งแล้ว' : 'กำลังดำเนินการ'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{order.total_amount} ฿</p>
                            <button className="text-primary-500 hover:text-primary-600 text-sm mt-1">
                              ดูรายละเอียด
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">การตั้งค่าและความชอบ</h2>
                  <div className="space-y-8">
                    {/* Cuisine Preferences */}
                    <div>
                      <h3 className="font-medium mb-4">ประเภทอาหารที่ชอบ</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['อาหารไทย', 'อาหารจีน', 'อาหารฝรั่ง', 'อาหารญี่ปุ่น', 'อาหารเกาหลี', 'เครื่องดื่ม'].map((cuisine) => (
                          <label key={cuisine} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={preferences.cuisine_preferences.includes(cuisine)}
                              onChange={(e) => {
                                const newPrefs = e.target.checked
                                  ? [...preferences.cuisine_preferences, cuisine]
                                  : preferences.cuisine_preferences.filter(c => c !== cuisine)
                                updatePreferences({ cuisine_preferences: newPrefs })
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{cuisine}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Dietary Restrictions */}
                    <div>
                      <h3 className="font-medium mb-4">ข้อจำกัดทางอาหาร</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['เจ', 'ไม่กินหมู', 'ไม่กินเนื้อ', 'ไม่กินอาหารทะเล', 'ไม่กินไข่', 'ไม่กินนม'].map((restriction) => (
                          <label key={restriction} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={preferences.dietary_restrictions.includes(restriction)}
                              onChange={(e) => {
                                const newRestrictions = e.target.checked
                                  ? [...preferences.dietary_restrictions, restriction]
                                  : preferences.dietary_restrictions.filter(r => r !== restriction)
                                updatePreferences({ dietary_restrictions: newRestrictions })
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{restriction}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Spice Level */}
                    <div>
                      <h3 className="font-medium mb-4">ระดับความเผ็ด</h3>
                      <div className="flex space-x-4">
                        {[
                          { value: 'mild', label: 'ไม่เผ็ด', emoji: '😌' },
                          { value: 'medium', label: 'เผ็ดปานกลาง', emoji: '😊' },
                          { value: 'hot', label: 'เผ็ดมาก', emoji: '🥵' }
                        ].map((level) => (
                          <label key={level.value} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="spice_level"
                              value={level.value}
                              checked={preferences.spice_level === level.value}
                              onChange={(e) => updatePreferences({ spice_level: e.target.value as any })}
                            />
                            <span className="text-sm">
                              {level.emoji} {level.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Notifications */}
                    <div>
                      <h3 className="font-medium mb-4">การแจ้งเตือน</h3>
                      <div className="space-y-3">
                        {[
                          { key: 'order_updates', label: 'อัปเดตสถานะออเดอร์' },
                          { key: 'promotions', label: 'โปรโมชั่นและส่วนลด' },
                          { key: 'new_restaurants', label: 'ร้านอาหารใหม่' }
                        ].map((notification) => (
                          <label key={notification.key} className="flex items-center justify-between">
                            <span className="text-sm">{notification.label}</span>
                            <button
                              onClick={() => updatePreferences({
                                notifications: {
                                  ...preferences.notifications,
                                  [notification.key]: !preferences.notifications[notification.key as keyof typeof preferences.notifications]
                                }
                              })}
                              className={`
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                ${preferences.notifications[notification.key as keyof typeof preferences.notifications] 
                                  ? 'bg-primary-500' 
                                  : 'bg-gray-300'
                                }
                              `}
                            >
                              <span className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${preferences.notifications[notification.key as keyof typeof preferences.notifications] 
                                  ? 'translate-x-6' 
                                  : 'translate-x-1'
                                }
                              `} />
                            </button>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
