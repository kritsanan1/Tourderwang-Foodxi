
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SearchBar from '../SearchBar'
import { restaurantService, menuService } from '../../lib/supabase'

const MockedSearchBar = () => (
  <BrowserRouter>
    <SearchBar />
  </BrowserRouter>
)

// Mock the services
jest.mock('../../lib/supabase')

const mockedRestaurantService = restaurantService as jest.Mocked<typeof restaurantService>
const mockedMenuService = menuService as jest.Mocked<typeof menuService>

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders search input', () => {
    render(<MockedSearchBar />)
    expect(screen.getByPlaceholderText('ค้นหาร้านอาหารหรือเมนู...')).toBeInTheDocument()
  })

  test('shows loading state during search', async () => {
    mockedRestaurantService.search.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    mockedMenuService.search.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<MockedSearchBar />)
    
    const input = screen.getByPlaceholderText('ค้นหาร้านอาหารหรือเมนู...')
    await userEvent.type(input, 'pizza')

    await waitFor(() => {
      expect(screen.getByText('กำลังค้นหา...')).toBeInTheDocument()
    })
  })

  test('displays search results', async () => {
    const mockRestaurants = [
      { id: '1', name: 'Pizza Palace', cuisine_type: 'Italian', rating: 4.5 }
    ]
    const mockMenuItems = [
      { id: '1', name: 'Margherita Pizza', restaurant_id: '1', price: 250 }
    ]

    mockedRestaurantService.search.mockResolvedValue(mockRestaurants)
    mockedMenuService.search.mockResolvedValue(mockMenuItems)

    render(<MockedSearchBar />)
    
    const input = screen.getByPlaceholderText('ค้นหาร้านอาหารหรือเมนู...')
    await userEvent.type(input, 'pizza')

    await waitFor(() => {
      expect(screen.getByText('Pizza Palace')).toBeInTheDocument()
      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument()
    })
  })

  test('shows no results message when search returns empty', async () => {
    mockedRestaurantService.search.mockResolvedValue([])
    mockedMenuService.search.mockResolvedValue([])

    render(<MockedSearchBar />)
    
    const input = screen.getByPlaceholderText('ค้นหาร้านอาหารหรือเมนู...')
    await userEvent.type(input, 'nonexistent')

    await waitFor(() => {
      expect(screen.getByText('ไม่พบผลการค้นหา')).toBeInTheDocument()
    })
  })

  test('clears search when clicking clear button', async () => {
    render(<MockedSearchBar />)
    
    const input = screen.getByPlaceholderText('ค้นหาร้านอาหารหรือเมนู...')
    await userEvent.type(input, 'test')

    const clearButton = screen.getByText('✕')
    await userEvent.click(clearButton)

    expect(input).toHaveValue('')
  })
})
