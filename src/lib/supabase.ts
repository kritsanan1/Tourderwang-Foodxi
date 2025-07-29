
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  phone: string
  cuisine_type: string
  rating: number
  delivery_time_min: number
  delivery_time_max: number
  delivery_fee: number
  minimum_order: number
  image_url?: string
  is_open: boolean
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  is_available: boolean
  preparation_time: number
  spice_level?: 'mild' | 'medium' | 'hot'
  dietary_tags?: string[]
  popularity_score?: number
  restaurant?: Restaurant
  created_at: string
  updated_at: string
}

export interface CartItem {
  menu_item: MenuItem
  quantity: number
}

export interface Order {
  id: string
  user_id: string
  restaurant_id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled'
  delivery_address: string
  delivery_notes?: string
  subtotal: number
  delivery_fee: number
  discount_amount: number
  total_amount: number
  payment_method: string
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  promo_code?: string
  estimated_delivery_time: string
  actual_delivery_time?: string
  created_at: string
  updated_at: string
}

export interface SearchFilters {
  cuisineType?: string
  priceRange?: string
  rating?: number
  deliveryTime?: string
  isOpen?: boolean
  location?: { lat: number; lng: number; radius: number }
  spiceLevel?: string
  dietaryRestrictions?: string[]
}

// Restaurant Service
export const restaurantService = {
  async getAll(): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_open', true)
      .order('rating', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async search(query: string, filters: SearchFilters = {}): Promise<Restaurant[]> {
    let queryBuilder = supabase
      .from('restaurants')
      .select('*')

    // Text search
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%,cuisine_type.ilike.%${query}%`)
    }

    // Apply filters
    if (filters.cuisineType) {
      queryBuilder = queryBuilder.eq('cuisine_type', filters.cuisineType)
    }

    if (filters.rating && filters.rating > 0) {
      queryBuilder = queryBuilder.gte('rating', filters.rating)
    }

    if (filters.isOpen) {
      queryBuilder = queryBuilder.eq('is_open', true)
    }

    // Price range filter (based on average menu item price)
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''))
      if (max) {
        queryBuilder = queryBuilder.gte('average_price', parseInt(min))
        queryBuilder = queryBuilder.lte('average_price', parseInt(max))
      } else {
        queryBuilder = queryBuilder.gte('average_price', parseInt(min))
      }
    }

    // Delivery time filter
    if (filters.deliveryTime) {
      const [min, max] = filters.deliveryTime.split('-').map(t => parseInt(t))
      if (max) {
        queryBuilder = queryBuilder.lte('delivery_time_max', max)
      }
    }

    queryBuilder = queryBuilder.order('rating', { ascending: false })

    const { data, error } = await queryBuilder

    if (error) throw error
    return data || []
  },

  async getNearby(latitude: number, longitude: number, radius: number = 5): Promise<Restaurant[]> {
    // Using PostGIS for geospatial queries
    const { data, error } = await supabase.rpc('restaurants_nearby', {
      lat: latitude,
      lng: longitude,
      radius_km: radius
    })

    if (error) throw error
    return data || []
  },

  async getPopular(limit: number = 10): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_open', true)
      .order('rating', { ascending: false })
      .order('total_orders', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }
}

// Menu Service
export const menuService = {
  async getByRestaurantId(restaurantId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
      .order('category')
      .order('popularity_score', { ascending: false })

    if (error) throw error
    return data || []
  },

  async search(query: string, filters: SearchFilters = {}): Promise<MenuItem[]> {
    let queryBuilder = supabase
      .from('menu_items')
      .select(`
        *,
        restaurant:restaurants(*)
      `)

    // Text search
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    }

    // Apply filters
    if (filters.cuisineType) {
      queryBuilder = queryBuilder.eq('restaurant.cuisine_type', filters.cuisineType)
    }

    if (filters.spiceLevel) {
      queryBuilder = queryBuilder.eq('spice_level', filters.spiceLevel)
    }

    if (filters.dietaryRestrictions && filters.dietaryRestrictions.length > 0) {
      queryBuilder = queryBuilder.overlaps('dietary_tags', filters.dietaryRestrictions)
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''))
      if (max) {
        queryBuilder = queryBuilder.gte('price', parseInt(min))
        queryBuilder = queryBuilder.lte('price', parseInt(max))
      } else {
        queryBuilder = queryBuilder.gte('price', parseInt(min))
      }
    }

    queryBuilder = queryBuilder
      .eq('is_available', true)
      .order('popularity_score', { ascending: false })

    const { data, error } = await queryBuilder

    if (error) throw error
    return data || []
  },

  async getPopular(limit: number = 10): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        restaurant:restaurants(name)
      `)
      .eq('is_available', true)
      .order('popularity_score', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  async getPopularFromRestaurants(restaurantIds: string[], limit: number = 4): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        restaurant:restaurants(name)
      `)
      .in('restaurant_id', restaurantIds)
      .eq('is_available', true)
      .order('popularity_score', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  async getRecommendations(userId: string, limit: number = 6): Promise<MenuItem[]> {
    // This would use a recommendation algorithm based on user preferences and order history
    const { data, error } = await supabase.rpc('get_menu_recommendations', {
      user_id: userId,
      limit_count: limit
    })

    if (error) {
      // Fallback to popular items
      return this.getPopular(limit)
    }
    return data || []
  }
}

// Order Service
export const orderService = {
  async create(orderData: Partial<Order>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        restaurant:restaurants(*),
        order_items:order_items(
          quantity,
          price,
          menu_item:menu_items(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getByUserId(userId: string, limit: number = 20): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        restaurant:restaurants(name),
        order_items:order_items(quantity)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  async updateStatus(id: string, status: Order['status']): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error
  },

  // Real-time subscription for order updates
  subscribeToOrder(orderId: string, callback: (order: Order) => void) {
    return supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => callback(payload.new as Order)
      )
      .subscribe()
  }
}

// Analytics Service
export const analyticsService = {
  async trackEvent(eventName: string, properties: Record<string, any>) {
    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_name: eventName,
          properties,
          timestamp: new Date().toISOString(),
          user_id: (await supabase.auth.getUser()).data.user?.id
        })

      if (error) console.error('Analytics error:', error)
    } catch (error) {
      console.error('Analytics error:', error)
    }
  },

  async trackPageView(page: string) {
    await this.trackEvent('page_view', { page })
  },

  async trackSearch(query: string, filters: SearchFilters, resultsCount: number) {
    await this.trackEvent('search', { query, filters, resultsCount })
  },

  async trackAddToCart(menuItem: MenuItem, quantity: number) {
    await this.trackEvent('add_to_cart', {
      menu_item_id: menuItem.id,
      restaurant_id: menuItem.restaurant_id,
      price: menuItem.price,
      quantity
    })
  },

  async trackOrderPlaced(order: Order) {
    await this.trackEvent('order_placed', {
      order_id: order.id,
      restaurant_id: order.restaurant_id,
      total_amount: order.total_amount,
      payment_method: order.payment_method
    })
  }
}

// Notification Service
export const notificationService = {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  },

  async showNotification(title: string, options: NotificationOptions) {
    if (await this.requestPermission()) {
      new Notification(title, {
        icon: '/favicon.png',
        badge: '/favicon.png',
        ...options
      })
    }
  },

  async subscribeToOrderUpdates(orderId: string) {
    return orderService.subscribeToOrder(orderId, (order) => {
      const statusMessages = {
        confirmed: 'ร้านอาหารยืนยันออเดอร์แล้ว',
        preparing: 'กำลังเตรียมอาหารของคุณ',
        ready: 'อาหารพร้อมส่งแล้ว',
        picked_up: 'ผู้ส่งกำลังนำอาหารมาส่ง',
        delivered: 'จัดส่งเรียบร้อยแล้ว!'
      }

      const message = statusMessages[order.status as keyof typeof statusMessages]
      if (message) {
        this.showNotification('อัปเดตสถานะออเดอร์', {
          body: message,
          tag: `order-${orderId}`
        })
      }
    })
  }
}

// Geolocation Service
export const locationService = {
  async getCurrentPosition(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        () => {
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  },

  async calculateDeliveryTime(
    restaurantLat: number,
    restaurantLng: number,
    deliveryLat: number,
    deliveryLng: number
  ): Promise<number> {
    // Simple distance calculation (in real app, use mapping service)
    const distance = this.calculateDistance(
      restaurantLat,
      restaurantLng,
      deliveryLat,
      deliveryLng
    )

    // Estimate delivery time based on distance (rough calculation)
    const baseTime = 15 // base preparation time
    const travelTime = Math.ceil(distance * 3) // 3 minutes per km
    
    return baseTime + travelTime
  },

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  },

  toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }
}

// Export default supabase client
export default supabase
