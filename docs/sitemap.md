
# Tourderwang Application Sitemap

## Navigation Structure

```
🏠 Home (/)
├── 🔍 Search Results (/search?q={query})
├── 🍽️ Restaurants (/restaurants)
│   ├── 📍 By Location (/restaurants?location={area})
│   ├── 🍜 By Cuisine (/restaurants?cuisine={type})
│   └── ⭐ By Rating (/restaurants?rating={min})
├── 🏪 Restaurant Detail (/restaurant/{id})
│   ├── 📋 Menu (/restaurant/{id}/menu)
│   ├── ℹ️ Info (/restaurant/{id}/info)
│   └── 💬 Reviews (/restaurant/{id}/reviews)
├── 🛒 Cart (/cart) [Protected]
├── 💳 Checkout (/checkout) [Protected]
│   ├── 📝 Order Summary (/checkout/summary)
│   ├── 💰 Payment (/checkout/payment)
│   └── ✅ Confirmation (/checkout/confirmation)
├── 📦 Orders (/orders) [Protected]
│   ├── 🔄 Active Orders (/orders/active)
│   ├── 📋 Order History (/orders/history)
│   └── 📍 Track Order (/orders/{id}/track)
├── 👤 User Account
│   ├── 🔐 Login (/login)
│   ├── 📝 Register (/register)
│   ├── 👤 Profile (/profile) [Protected]
│   ├── ⚙️ Settings (/profile/settings) [Protected]
│   └── 🚪 Logout (action)
└── ℹ️ Static Pages
    ├── 📞 Contact (/contact)
    ├── ❓ FAQ (/faq)
    ├── 📋 Terms (/terms)
    ├── 🔒 Privacy (/privacy)
    └── ❌ 404 Error (/404)
```

## User Journey Mapping

### 1. New Customer Journey
```
Landing Page → Browse Restaurants → Select Restaurant → View Menu
     ↓
Add Items to Cart → Register/Login → Checkout → Place Order
     ↓
Order Confirmation → Track Order → Receive Food → Rate Experience
```

### 2. Returning Customer Journey
```
Landing Page → Login (Auto) → Search/Browse → Quick Reorder
     ↓
Modify Cart → Checkout → Order Tracking → Delivery
```

### 3. Restaurant Discovery Journey
```
Home Page → Search by Cuisine → Filter by Location/Rating
     ↓
Compare Restaurants → Read Reviews → Select Restaurant → Browse Menu
```

## Page Descriptions

### Public Pages

#### Home Page (/)
- **Purpose**: Landing page with hero section, featured restaurants, and search
- **Components**: Hero banner, restaurant categories, popular dishes, search bar
- **CTAs**: "Order Now", "Browse Restaurants", "Sign Up"

#### Restaurant Listings (/restaurants)
- **Purpose**: Browse all available restaurants with filtering options
- **Components**: Restaurant cards, filters, sorting, pagination
- **Filters**: Location, cuisine type, rating, delivery time, price range

#### Restaurant Detail (/restaurant/{id})
- **Purpose**: Detailed restaurant information and menu browsing
- **Components**: Restaurant header, menu sections, reviews, restaurant info
- **Actions**: Add to cart, read reviews, view restaurant details

#### Authentication Pages
- **Login (/login)**: Email/password and social login options
- **Register (/register)**: Account creation with email verification

### Protected Pages

#### Shopping Cart (/cart)
- **Purpose**: Review selected items before checkout
- **Components**: Cart items list, quantity controls, price summary
- **Actions**: Update quantities, remove items, proceed to checkout

#### Checkout (/checkout)
- **Purpose**: Complete order placement and payment
- **Components**: Delivery address, payment method, order summary
- **Flow**: Address → Payment → Confirmation

#### Order Management (/orders)
- **Purpose**: View and track current and past orders
- **Components**: Order cards, status indicators, tracking information
- **Actions**: Track order, reorder, rate restaurant

#### User Profile (/profile)
- **Purpose**: Manage account information and preferences
- **Components**: Personal info, delivery addresses, payment methods
- **Actions**: Edit profile, manage addresses, view order history

## Navigation Patterns

### Primary Navigation
- Logo (links to home)
- Search bar (global)
- Main menu: Restaurants, Orders, Profile
- Cart icon with item count
- User menu (login/profile)

### Mobile Navigation
- Hamburger menu for main navigation
- Bottom tab bar for key actions
- Floating cart button
- Pull-to-refresh on listings

### Breadcrumbs
```
Home > Restaurants > Thai Cuisine > Somtum Shop > Menu
Home > Orders > Order #12345 > Tracking
Home > Profile > Settings > Payment Methods
```

## URL Structure

### Route Parameters
- `{id}` - Restaurant or order identifier
- `{category}` - Cuisine category slug
- `{location}` - Area or district identifier

### Query Parameters
- `?q={search}` - Search query
- `?cuisine={type}` - Filter by cuisine
- `?location={area}` - Filter by location
- `?rating={min}` - Filter by minimum rating
- `?sort={field}` - Sort order
- `?page={number}` - Pagination

### Example URLs
```
https://tourderwang.app/
https://tourderwang.app/restaurants?cuisine=thai&location=wangsammo
https://tourderwang.app/restaurant/rest_123/menu
https://tourderwang.app/search?q=ส้มตำ
https://tourderwang.app/orders/ord_456/track
```

## SEO-Friendly URLs

### Restaurant Pages
- `/restaurants/thai-food-wang-sam-mo`
- `/restaurant/somtum-shop-udonthani`
- `/menu/authentic-thai-cuisine`

### Category Pages
- `/thai-restaurants-wang-sam-mo`
- `/fast-food-delivery-udonthani`
- `/vegetarian-restaurants-near-me`

## Accessibility Navigation

### Keyboard Navigation
- Tab order follows logical page flow
- Skip links for main content
- Focus indicators on all interactive elements

### Screen Reader Support
- Descriptive link text
- Navigation landmarks
- Page titles and headings structure

### Mobile Accessibility
- Touch targets minimum 44px
- Swipe gestures for navigation
- Voice search integration

## Error Pages

### 404 Not Found
- Friendly error message in Thai
- Search suggestions
- Popular restaurants links
- Navigation back to home

### 500 Server Error
- Maintenance message
- Contact information
- Estimated resolution time

### Network Error
- Offline message
- Retry functionality
- Cached content display

## Deep Linking

### Order Tracking
- Direct links to order status
- Shareable tracking URLs
- Email/SMS integration

### Restaurant Sharing
- Social media sharing URLs
- Menu item direct links
- Review deep links

### Search Results
- Shareable search URLs
- Filter state preservation
- Bookmark support
