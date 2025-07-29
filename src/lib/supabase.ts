
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
}

export interface Restaurant {
  id: string
  name: string
  address: string
  cuisine_type: string
  rating: number
  image_url?: string
  created_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  name: string
  description: string
  price: number
  image_url?: string
  category: string
  available: boolean
}

export interface Order {
  id: string
  user_id: string
  restaurant_id: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled'
  created_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  price: number
}

export interface Review {
  id: string
  user_id: string
  restaurant_id: string
  rating: number
  comment: string
  created_at: string
}
