
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  subscription_status: 'free' | 'premium'
  created_at: string
  updated_at: string
}

export interface Restaurant {
  id: string
  name: string
  address: string
  cuisine_type: string
  rating: number
  image_url?: string
  phone?: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category: string
  available: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  restaurant_id: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  delivery_address: string
  phone: string
  notes?: string
  created_at: string
  updated_at: string
  restaurant?: Restaurant
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  price: number
  created_at: string
  menu_item?: MenuItem
}

export interface Review {
  id: string
  user_id: string
  restaurant_id: string
  order_id: string
  rating: number
  comment?: string
  created_at: string
  updated_at: string
}

// Cart item type for local state
export interface CartItem {
  menu_item: MenuItem
  quantity: number
}

// Database functions
export const restaurantService = {
  async getAll(): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data
  },

  async searchByName(query: string): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true)
      .ilike('name', `%${query}%`)
      .order('rating', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

export const menuService = {
  async getByRestaurantId(restaurantId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('available', true)
      .order('category', { ascending: true })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .eq('available', true)
      .single()
    
    if (error) throw error
    return data
  }
}

export const orderService = {
  async create(orderData: {
    restaurant_id: string
    total_amount: number
    delivery_address: string
    phone: string
    notes?: string
    items: { menu_item_id: string; quantity: number; price: number }[]
  }): Promise<Order> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        restaurant_id: orderData.restaurant_id,
        total_amount: orderData.total_amount,
        delivery_address: orderData.delivery_address,
        phone: orderData.phone,
        notes: orderData.notes
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return order
  },

  async getUserOrders(): Promise<Order[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        restaurant:restaurants(*),
        order_items(*, menu_item:menu_items(*))
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Order | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        restaurant:restaurants(*),
        order_items(*, menu_item:menu_items(*))
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  }
}

export const reviewService = {
  async getByRestaurantId(restaurantId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(reviewData: {
    restaurant_id: string
    order_id: string
    rating: number
    comment?: string
  }): Promise<Review> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        restaurant_id: reviewData.restaurant_id,
        order_id: reviewData.order_id,
        rating: reviewData.rating,
        comment: reviewData.comment
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}
