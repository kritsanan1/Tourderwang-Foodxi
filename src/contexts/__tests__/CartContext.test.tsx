
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartProvider, useCart } from '../CartContext'
import { AuthProvider } from '../AuthContext'

const TestComponent = () => {
  const { items, addItem, removeItem, clearCart, getTotal } = useCart()
  
  const testItem = {
    id: '1',
    name: 'Test Pizza',
    price: 100,
    restaurant_id: 'restaurant-1',
    description: 'Test description',
    image_url: '',
    category: 'Pizza',
    available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  return (
    <div>
      <div data-testid="cart-count">{items.length}</div>
      <div data-testid="cart-total">{getTotal()}</div>
      <button onClick={() => addItem(testItem)}>Add Item</button>
      <button onClick={() => removeItem('1')}>Remove Item</button>
      <button onClick={clearCart}>Clear Cart</button>
      {items.map(item => (
        <div key={item.id} data-testid={`item-${item.id}`}>
          {item.name} - Quantity: {item.quantity}
        </div>
      ))}
    </div>
  )
}

const renderWithProviders = () => {
  return render(
    <AuthProvider>
      <CartProvider>
        <TestComponent />
      </CartProvider>
    </AuthProvider>
  )
}

describe('CartContext', () => {
  test('starts with empty cart', () => {
    renderWithProviders()
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0')
  })

  test('adds item to cart', () => {
    renderWithProviders()
    
    fireEvent.click(screen.getByText('Add Item'))
    
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('100')
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Pizza - Quantity: 1')
  })

  test('increases quantity when adding same item', () => {
    renderWithProviders()
    
    fireEvent.click(screen.getByText('Add Item'))
    fireEvent.click(screen.getByText('Add Item'))
    
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('200')
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Pizza - Quantity: 2')
  })

  test('removes item from cart', () => {
    renderWithProviders()
    
    fireEvent.click(screen.getByText('Add Item'))
    fireEvent.click(screen.getByText('Add Item'))
    fireEvent.click(screen.getByText('Remove Item'))
    
    expect(screen.getByTestId('cart-total')).toHaveTextContent('100')
    expect(screen.getByTestId('item-1')).toHaveTextContent('Test Pizza - Quantity: 1')
  })

  test('clears entire cart', () => {
    renderWithProviders()
    
    fireEvent.click(screen.getByText('Add Item'))
    fireEvent.click(screen.getByText('Clear Cart'))
    
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0')
  })
})
