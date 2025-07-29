
import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { CartItem, MenuItem } from '../lib/supabase'

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextType extends CartState {
  addItem: (item: MenuItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (id: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) => item.menu_item.id === action.payload.id
      )

      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.menu_item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...state.items, { menu_item: action.payload, quantity: 1 }]
      }

      return {
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.menu_item.price * item.quantity,
          0
        ),
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        (item) => item.menu_item.id !== action.payload
      )
      return {
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.menu_item.price * item.quantity,
          0
        ),
      }
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items
        .map((item) =>
          item.menu_item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0)

      return {
        items: newItems,
        total: newItems.reduce(
          (sum, item) => sum + item.menu_item.price * item.quantity,
          0
        ),
      }
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 }

    case 'LOAD_CART':
      return {
        items: action.payload,
        total: action.payload.reduce(
          (sum, item) => sum + item.menu_item.price * item.quantity,
          0
        ),
      }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: MenuItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItemQuantity = (id: string) => {
    const item = state.items.find((item) => item.menu_item.id === id)
    return item ? item.quantity : 0
  }

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
