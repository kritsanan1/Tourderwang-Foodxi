
# System Architecture Documentation

## Overview

Tourderwang is a modern food delivery platform built with a React frontend and Supabase backend. The architecture follows a component-based design with clear separation of concerns and real-time capabilities.

## High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Client App    │    │   Supabase       │    │  External APIs  │
│  (React/Vite)   │◄──►│   (Backend)      │◄──►│ (Payment, etc.) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│   CDN/Static    │    │   PostgreSQL     │
│    Assets       │    │    Database      │
└─────────────────┘    └──────────────────┘
```

## Frontend Architecture

### Component Hierarchy
```
App.tsx (Router Provider)
├── AuthProvider (Authentication Context)
├── CartProvider (Shopping Cart Context)
├── Navbar (Global Navigation)
├── Routes
│   ├── Home (Landing Page)
│   ├── RestaurantListings (Restaurant List)
│   ├── RestaurantMenu (Individual Restaurant)
│   ├── Cart (Shopping Cart)
│   ├── Checkout (Order Processing)
│   ├── OrderTracking (Real-time Updates)
│   ├── UserProfile (Account Management)
│   ├── Login (Authentication)
│   └── Register (User Registration)
└── Footer (Global Footer)
```

### State Management
- **Authentication State**: Managed by `AuthContext`
- **Shopping Cart**: Managed by `CartContext`
- **Component State**: Local React state with hooks
- **Server State**: Supabase real-time subscriptions

### Routing Structure
```
/ (Home)
├── /restaurants (Restaurant Listings)
├── /restaurant/:id (Restaurant Menu)
├── /cart (Shopping Cart) [Protected]
├── /checkout (Order Checkout) [Protected]
├── /orders (Order Tracking) [Protected]
├── /profile (User Profile) [Protected]
├── /login (User Login)
└── /register (User Registration)
```

## Backend Architecture (Supabase)

### Database Schema
```sql
-- Core Tables
users (UserID, Name, Email, Phone, Address, SubscriptionStatus)
restaurants (RestaurantID, Name, Address, CuisineType, Rating)
menu_items (MenuID, RestaurantID, ItemName, Description, Price, Image)
orders (OrderID, UserID, RestaurantID, TotalAmount, Status, CreatedAt)
order_items (OrderItemID, OrderID, MenuItemID, Quantity, Price)
reviews (ReviewID, UserID, RestaurantID, Rating, Comment, CreatedAt)
```

### Authentication Flow
```
1. User Registration/Login
   ├── Email Verification
   ├── JWT Token Generation
   └── Session Management

2. Protected Routes
   ├── Token Validation
   ├── User Context Setup
   └── Route Access Control

3. Session Management
   ├── Auto-refresh Tokens
   ├── Logout Handling
   └── Persistent Sessions
```

### API Endpoints (Supabase Auto-generated)
```
Authentication:
POST /auth/v1/signup
POST /auth/v1/token
POST /auth/v1/logout

REST API:
GET    /rest/v1/restaurants
GET    /rest/v1/menu_items
POST   /rest/v1/orders
GET    /rest/v1/orders
PUT    /rest/v1/orders/:id
GET    /rest/v1/reviews
POST   /rest/v1/reviews

Real-time:
WebSocket /realtime/v1
```

## Data Flow Diagrams

### Order Placement Flow
```
User → Add to Cart → CartContext → Checkout Page → Supabase → Database
  ↓
Order Confirmation → Email/SMS → Real-time Updates → OrderTracking Page
```

### Authentication Flow
```
User Input → Login/Register → Supabase Auth → JWT Token → AuthContext
    ↓
Protected Routes → Token Validation → User Session → Route Access
```

### Restaurant Data Flow
```
Database → Supabase → API Call → React Component → UI Rendering
    ↓
Search/Filter → Client-side Processing → Updated UI
```

## Security Architecture

### Row Level Security (RLS)
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

-- Public read access for restaurants and menus
CREATE POLICY "Restaurants are publicly readable" ON restaurants
FOR SELECT USING (is_active = true);

-- Order access restricted to owner
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT USING (auth.uid() = user_id);
```

### Client-side Security
- JWT token storage in secure cookies
- Protected routes with authentication checks
- Environment variable protection
- HTTPS enforcement in production

## Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Route-based lazy loading
- **Asset Optimization**: Image compression and lazy loading
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching**: Service worker for static assets

### Backend Optimizations
- **Database Indexing**: Strategic indexes on foreign keys
- **Connection Pooling**: Supabase handles connection management
- **Real-time Optimization**: Efficient WebSocket usage
- **CDN Integration**: Static asset delivery

## Deployment Architecture

### Development Environment
```
Local Machine → Vite Dev Server (Port 5000) → Supabase (Development)
```

### Production Environment (Replit)
```
GitHub Repository → Replit Deployment → CDN → Users
                         ↓
              Supabase (Production) → PostgreSQL
```

### Environment Configuration
```
Development:
- VITE_SUPABASE_URL=dev-project-url
- VITE_SUPABASE_ANON_KEY=dev-anon-key

Production:
- VITE_SUPABASE_URL=prod-project-url
- VITE_SUPABASE_ANON_KEY=prod-anon-key
```

## Technology Stack

### Frontend Technologies
- **React 19**: UI library with modern hooks
- **TypeScript**: Type safety and developer experience
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing

### Backend Technologies
- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Primary database
- **PostgREST**: Auto-generated REST API
- **Realtime**: WebSocket subscriptions

### Development Tools
- **ESLint**: Code quality and consistency
- **Jest**: Unit and integration testing
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## Scalability Considerations

### Horizontal Scaling
- Stateless React components
- Supabase auto-scaling capabilities
- CDN for static asset distribution

### Vertical Scaling
- Database query optimization
- Component-level performance optimization
- Bundle size optimization

### Monitoring and Analytics
- Error tracking integration ready
- Performance monitoring setup
- User analytics framework

## Integration Points

### External Services
- **Payment Gateway**: Thai payment providers
- **Email Service**: Supabase built-in email
- **SMS Service**: For order notifications
- **Maps Service**: For delivery tracking

### API Integration Patterns
```typescript
// Supabase Client Pattern
const { data, error } = await supabase
  .from('restaurants')
  .select('*')
  .eq('is_active', true);

// Real-time Subscription Pattern
const subscription = supabase
  .from('orders')
  .on('UPDATE', payload => {
    updateOrderStatus(payload.new);
  })
  .subscribe();
```

## Future Architecture Considerations

### Microservices Migration
- Payment service extraction
- Notification service separation
- Analytics service isolation

### Progressive Web App (PWA)
- Service worker implementation
- Offline functionality
- Push notifications

### Mobile Application
- React Native code sharing
- Expo integration
- Platform-specific optimizations
