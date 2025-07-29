
import { restaurantService, menuService, orderService } from '../supabase'

// Mock the actual supabase client
jest.mock('../supabase', () => {
  const mockSupabase = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ 
            data: [{ id: '1', name: 'Test Restaurant' }], 
            error: null 
          }))
        })),
        order: jest.fn(() => Promise.resolve({ 
          data: [{ id: '1', name: 'Test Restaurant' }], 
          error: null 
        })),
        or: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ 
            data: [{ id: '1', name: 'Test Item' }], 
            error: null 
          }))
        }))
      })),
      insert: jest.fn(() => Promise.resolve({ 
        data: { id: '1', name: 'New Item' }, 
        error: null 
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ 
          data: { id: '1', name: 'Updated Item' }, 
          error: null 
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ 
          data: null, 
          error: null 
        }))
      }))
    }))
  }

  return {
    supabase: mockSupabase,
    restaurantService: {
      getAll: jest.fn(() => Promise.resolve([
        { id: '1', name: 'Test Restaurant', cuisine_type: 'Thai', rating: 4.5 }
      ])),
      getById: jest.fn(() => Promise.resolve(
        { id: '1', name: 'Test Restaurant', cuisine_type: 'Thai', rating: 4.5 }
      )),
      search: jest.fn(() => Promise.resolve([
        { id: '1', name: 'Pizza Place', cuisine_type: 'Italian', rating: 4.2 }
      ]))
    },
    menuService: {
      getByRestaurantId: jest.fn(() => Promise.resolve([
        { id: '1', name: 'Test Dish', price: 100, restaurant_id: '1' }
      ])),
      search: jest.fn(() => Promise.resolve([
        { id: '1', name: 'Pizza', price: 200, restaurant_id: '1' }
      ]))
    },
    orderService: {
      create: jest.fn(() => Promise.resolve({
        id: '1',
        user_id: 'user-1',
        restaurant_id: 'restaurant-1',
        total: 300,
        status: 'pending'
      })),
      getByUserId: jest.fn(() => Promise.resolve([
        { id: '1', status: 'delivered', total: 250 }
      ])),
      getById: jest.fn(() => Promise.resolve({
        id: '1',
        status: 'preparing',
        total: 300
      }))
    }
  }
})

describe('Restaurant Service', () => {
  test('getAll returns list of restaurants', async () => {
    const restaurants = await restaurantService.getAll()
    expect(restaurants).toHaveLength(1)
    expect(restaurants[0]).toHaveProperty('name', 'Test Restaurant')
  })

  test('getById returns specific restaurant', async () => {
    const restaurant = await restaurantService.getById('1')
    expect(restaurant).toHaveProperty('id', '1')
    expect(restaurant).toHaveProperty('name', 'Test Restaurant')
  })

  test('search returns filtered restaurants', async () => {
    const results = await restaurantService.search('pizza')
    expect(results).toHaveLength(1)
    expect(results[0]).toHaveProperty('name', 'Pizza Place')
  })
})

describe('Menu Service', () => {
  test('getByRestaurantId returns menu items for restaurant', async () => {
    const items = await menuService.getByRestaurantId('1')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveProperty('name', 'Test Dish')
    expect(items[0]).toHaveProperty('restaurant_id', '1')
  })

  test('search returns filtered menu items', async () => {
    const results = await menuService.search('pizza')
    expect(results).toHaveLength(1)
    expect(results[0]).toHaveProperty('name', 'Pizza')
  })
})

describe('Order Service', () => {
  test('create creates new order', async () => {
    const orderData = {
      user_id: 'user-1',
      restaurant_id: 'restaurant-1',
      items: [{ id: '1', quantity: 2 }],
      total: 300
    }
    
    const order = await orderService.create(orderData)
    expect(order).toHaveProperty('id', '1')
    expect(order).toHaveProperty('status', 'pending')
  })

  test('getByUserId returns user orders', async () => {
    const orders = await orderService.getByUserId('user-1')
    expect(orders).toHaveLength(1)
    expect(orders[0]).toHaveProperty('status', 'delivered')
  })

  test('getById returns specific order', async () => {
    const order = await orderService.getById('1')
    expect(order).toHaveProperty('id', '1')
    expect(order).toHaveProperty('status', 'preparing')
  })
})
