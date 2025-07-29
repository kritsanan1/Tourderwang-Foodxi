
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../Home'
import { restaurantService } from '../../lib/supabase'

const MockedHome = () => (
  <BrowserRouter>
    <Home />
  </BrowserRouter>
)

jest.mock('../../lib/supabase')
const mockedRestaurantService = restaurantService as jest.Mocked<typeof restaurantService>

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders hero section', () => {
    mockedRestaurantService.getAll.mockResolvedValue([])
    
    render(<MockedHome />)
    
    expect(screen.getByText('ยินดีต้อนรับสู่ Tourderwang')).toBeInTheDocument()
    expect(screen.getByText('สั่งอาหารจากร้านดังในวังสามหมอ')).toBeInTheDocument()
  })

  test('displays loading state for featured restaurants', async () => {
    mockedRestaurantService.getAll.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    )
    
    render(<MockedHome />)
    
    await waitFor(() => {
      expect(screen.getByText('ร้านอาหารแนะนำ')).toBeInTheDocument()
      // Check for loading skeletons
      expect(document.querySelectorAll('.animate-pulse')).toHaveLength(3)
    })
  })

  test('displays featured restaurants when loaded', async () => {
    const mockRestaurants = [
      {
        id: '1',
        name: 'ร้านอาหารบ้านไผ่',
        description: 'อาหารไทยแท้',
        cuisine_type: 'Thai',
        rating: 4.5,
        image_url: 'test-image.jpg',
        address: 'Wang Sam Mo',
        phone: '042-123-4567',
        is_active: true,
        delivery_fee: 25,
        minimum_order: 100,
        estimated_delivery_time: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    mockedRestaurantService.getAll.mockResolvedValue(mockRestaurants)
    
    render(<MockedHome />)
    
    await waitFor(() => {
      expect(screen.getByText('ร้านอาหารบ้านไผ่')).toBeInTheDocument()
      expect(screen.getByText('อาหารไทยแท้')).toBeInTheDocument()
    })
  })

  test('renders cuisine categories', () => {
    mockedRestaurantService.getAll.mockResolvedValue([])
    
    render(<MockedHome />)
    
    expect(screen.getByText('หมวดหมู่อาหาร')).toBeInTheDocument()
    expect(screen.getByText('อาหารไทย')).toBeInTheDocument()
    expect(screen.getByText('อาหารอีสาน')).toBeInTheDocument()
    expect(screen.getByText('ก๋วยเตี๋ยว')).toBeInTheDocument()
  })

  test('displays how it works section', () => {
    mockedRestaurantService.getAll.mockResolvedValue([])
    
    render(<MockedHome />)
    
    expect(screen.getByText('วิธีการใช้งาน')).toBeInTheDocument()
    expect(screen.getByText('เลือกร้านอาหาร')).toBeInTheDocument()
    expect(screen.getByText('สั่งอาหาร')).toBeInTheDocument()
    expect(screen.getByText('รับอาหาร')).toBeInTheDocument()
  })
})
