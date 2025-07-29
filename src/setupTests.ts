
import '@testing-library/jest-dom'

// Mock Supabase
jest.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        order: jest.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      insert: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      update: jest.fn(() => Promise.resolve({ data: {}, error: null })),
      delete: jest.fn(() => Promise.resolve({ data: {}, error: null }))
    }))
  },
  restaurantService: {
    getAll: jest.fn(() => Promise.resolve([])),
    getById: jest.fn(() => Promise.resolve(null)),
    search: jest.fn(() => Promise.resolve([]))
  },
  menuService: {
    getByRestaurantId: jest.fn(() => Promise.resolve([])),
    search: jest.fn(() => Promise.resolve([]))
  },
  orderService: {
    create: jest.fn(() => Promise.resolve({})),
    getByUserId: jest.fn(() => Promise.resolve([])),
    getById: jest.fn(() => Promise.resolve(null))
  }
}))

// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: 'test-id' })
}))

// Mock environment variables
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:5000'
  }
})
