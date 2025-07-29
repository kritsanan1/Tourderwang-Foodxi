
# Structure Analysis & Recommendations

## Current Project Organization

### Existing Structure Assessment

The current project follows a hybrid structure combining both Expo-based mobile development and React web development patterns. This creates some organizational complexity that can be optimized.

#### Current Directory Layout
```
Tourderwang-Food/
├── app/                     # Expo file-based routing (mobile)
├── src/                     # React web application
├── components/              # Expo components
├── hooks/                   # Shared hooks
├── constants/               # App constants
├── assets/                  # Static assets
├── database/                # Database schemas
└── scripts/                 # Utility scripts
```

### Issues with Current Structure

1. **Dual Architecture Complexity**
   - Both Expo (`app/`) and React (`src/`) structures coexist
   - Duplicated component patterns
   - Unclear primary development target

2. **Component Separation**
   - Expo components in root `/components`
   - Web components in `/src/components`
   - No clear component hierarchy

3. **Asset Management**
   - Assets scattered across multiple directories
   - No clear asset organization strategy

## Recommended Structure

### Option 1: Web-First Architecture (Recommended)

```
tourderwang-food/
├── public/                          # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── ui/                     # Basic UI elements
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Input/
│   │   │   └── Modal/
│   │   ├── layout/                 # Layout components
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   └── Sidebar/
│   │   └── features/               # Feature-specific components
│   │       ├── restaurant/
│   │       ├── cart/
│   │       ├── orders/
│   │       └── auth/
│   ├── pages/                      # Route components
│   │   ├── Home/
│   │   ├── Restaurants/
│   │   ├── Restaurant/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Orders/
│   │   ├── Profile/
│   │   └── Auth/
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useOrders.ts
│   │   └── useRestaurants.ts
│   ├── contexts/                   # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── ThemeContext.tsx
│   ├── services/                   # API services
│   │   ├── api/
│   │   │   ├── auth.ts
│   │   │   ├── restaurants.ts
│   │   │   ├── orders.ts
│   │   │   └── reviews.ts
│   │   ├── supabase.ts
│   │   └── storage.ts
│   ├── utils/                      # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── types/                      # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── restaurant.ts
│   │   ├── order.ts
│   │   └── index.ts
│   ├── styles/                     # Global styles
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── utilities.css
│   └── App.tsx
├── database/                       # Database related files
│   ├── schema.sql
│   ├── seed.sql
│   └── migrations/
├── docs/                          # Documentation
│   ├── api.md
│   ├── deployment.md
│   └── development.md
├── tests/                         # Test files
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
└── config/                        # Configuration files
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    └── eslint.config.js
```

### Option 2: Feature-Based Architecture

```
src/
├── features/
│   ├── authentication/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   ├── restaurants/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   ├── orders/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   └── cart/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── pages/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── services/
└── app/
    ├── layout/
    ├── providers/
    └── router/
```

## Migration Plan

### Phase 1: Cleanup and Consolidation (Week 1)

#### Step 1: Remove Expo Mobile Components
```bash
# Move or remove unused Expo components
rm -rf app/
rm -rf components/ui/
rm -rf hooks/useColorScheme.*
```

#### Step 2: Consolidate Assets
```bash
# Move assets to public directory
mkdir -p public/images public/icons public/fonts
mv assets/images/* public/images/
mv assets/fonts/* public/fonts/
```

#### Step 3: Update Import Paths
```typescript
// Before
import { ThemedText } from '@/components/ThemedText';

// After
import { Text } from '@/components/ui/Text';
```

### Phase 2: Component Reorganization (Week 2)

#### Step 1: Create UI Component Library
```bash
mkdir -p src/components/ui/{Button,Card,Input,Modal,Text}
```

#### Step 2: Feature-based Components
```bash
mkdir -p src/components/features/{restaurant,cart,orders,auth}
```

#### Step 3: Migrate Existing Components
```typescript
// Move and refactor components
src/components/Navbar.tsx → src/components/layout/Navbar/
src/components/Footer.tsx → src/components/layout/Footer/
src/components/SearchBar.tsx → src/components/features/restaurant/SearchBar/
```

### Phase 3: Service Layer Implementation (Week 3)

#### Step 1: Create Service Layer
```bash
mkdir -p src/services/{api,storage}
```

#### Step 2: Extract API Logic
```typescript
// Before (in components)
const { data } = await supabase.from('restaurants').select('*');

// After (in services)
import { restaurantService } from '@/services/api/restaurants';
const restaurants = await restaurantService.getAll();
```

#### Step 3: Implement Error Handling
```typescript
// services/api/base.ts
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
```

### Phase 4: Type System Enhancement (Week 4)

#### Step 1: Create Comprehensive Types
```typescript
// src/types/restaurant.ts
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  cuisine_type: string;
  rating: number;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  available: boolean;
}
```

#### Step 2: Implement Validation Schemas
```typescript
// src/utils/validators.ts
import { z } from 'zod';

export const restaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),
  address: z.string().min(5, 'Valid address is required'),
  cuisine_type: z.string(),
  rating: z.number().min(0).max(5),
});
```

## Benefits of Recommended Structure

### 1. **Scalability**
- Clear separation of concerns
- Easy to add new features
- Modular architecture

### 2. **Maintainability**
- Predictable file locations
- Consistent naming conventions
- Reduced coupling between components

### 3. **Developer Experience**
- Easier onboarding for new developers
- Clear import paths
- Better IDE support

### 4. **Performance**
- Better tree-shaking with modular imports
- Easier code splitting
- Optimized bundle sizes

## Implementation Guidelines

### File Naming Conventions
```
Components: PascalCase (e.g., RestaurantCard.tsx)
Hooks: camelCase with 'use' prefix (e.g., useRestaurants.ts)
Utilities: camelCase (e.g., formatPrice.ts)
Types: PascalCase (e.g., Restaurant.ts)
Constants: UPPER_SNAKE_CASE (e.g., API_ENDPOINTS.ts)
```

### Import Organization
```typescript
// 1. External libraries
import React from 'react';
import { Router } from 'react-router-dom';

// 2. Internal components
import { Button } from '@/components/ui/Button';
import { RestaurantCard } from '@/components/features/restaurant';

// 3. Hooks and utilities
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/utils/formatters';

// 4. Types
import type { Restaurant } from '@/types/restaurant';
```

### Component Structure Template
```typescript
// src/components/features/restaurant/RestaurantCard/RestaurantCard.tsx
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatters';
import type { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (id: string) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelect,
}) => {
  return (
    <Card>
      <h3>{restaurant.name}</h3>
      <p>{restaurant.cuisine_type}</p>
      <Button onClick={() => onSelect(restaurant.id)}>
        View Menu
      </Button>
    </Card>
  );
};

// src/components/features/restaurant/RestaurantCard/index.ts
export { RestaurantCard } from './RestaurantCard';
```

This structure analysis provides a clear path forward for organizing the codebase in a more maintainable and scalable way while following modern React development best practices.
