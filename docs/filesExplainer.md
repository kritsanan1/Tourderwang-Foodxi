
# File Structure Explainer

## Project Overview
Tourderwang is a React-based food delivery application built with TypeScript, Vite, and Tailwind CSS. The project follows a modern web application structure with clear separation of concerns.

## Directory Structure

```
📁 Tourderwang-Food/
├── 📄 .env                                    🟢 Environment configuration for Supabase
├── 📄 .env.example                           🟢 Environment variables template
├── 📄 .gitignore                             🟢 Git ignore patterns
├── 📄 .replit                                🟢 Replit configuration file
├── 📄 README.md                              🟢 Project documentation
├── 📄 TASKS_LIST.md                          🟢 Development task tracking
├── 📄 app.json                               🟢 Expo app configuration
├── 📄 eslint.config.js                       🟢 ESLint configuration
├── 📄 expo-env.d.ts                          🟢 Expo TypeScript definitions
├── 📄 index.html                             🟢 Main HTML template
├── 📄 package-lock.json                      🟢 Package lock file
├── 📄 package.json                           🟢 Project dependencies and scripts
├── 📄 postcss.config.js                      🟢 PostCSS configuration
├── 📄 replit.nix                             🟢 Nix package configuration
├── 📄 tailwind.config.js                     🟢 Tailwind CSS configuration
├── 📄 tsconfig.json                          🟢 TypeScript configuration
├── 📄 vite.config.ts                         🟢 Vite build configuration
├── 📁 app/                                   
│   ├── 📄 _layout.tsx                        🟢 Root layout component
│   ├── 📄 +not-found.tsx                     🟢 404 error page
│   └── 📁 (tabs)/
│       ├── 📄 _layout.tsx                    🟢 Tab layout component
│       ├── 📄 explore.tsx                    🟢 Explore tab page
│       └── 📄 index.tsx                      🟢 Home tab page
├── 📁 assets/
│   ├── 📁 fonts/
│   │   └── 📄 SpaceMono-Regular.ttf          🟢 Custom font file
│   └── 📁 images/
│       ├── 📄 adaptive-icon.png              🟢 Adaptive app icon
│       ├── 📄 favicon.png                    🟢 Browser favicon
│       ├── 📄 icon.png                       🟢 App icon
│       ├── 📄 partial-react-logo.png         🟢 Partial React logo
│       ├── 📄 react-logo.png                 🟢 React logo
│       ├── 📄 react-logo@2x.png              🟢 React logo (2x resolution)
│       ├── 📄 react-logo@3x.png              🟢 React logo (3x resolution)
│       └── 📄 splash-icon.png                🟢 Splash screen icon
├── 📁 components/
│   ├── 📄 Collapsible.tsx                    🟡 Collapsible UI component
│   ├── 📄 ExternalLink.tsx                   🟢 External link component
│   ├── 📄 HapticTab.tsx                      🟢 Haptic feedback tab component
│   ├── 📄 HelloWave.tsx                      🟢 Animated wave component
│   ├── 📄 ParallaxScrollView.tsx             🟡 Parallax scroll view component
│   ├── 📄 ThemedText.tsx                     🟢 Themed text component
│   ├── 📄 ThemedView.tsx                     🟢 Themed view component
│   └── 📁 ui/
│       ├── 📄 IconSymbol.ios.tsx             🟢 iOS icon symbols
│       ├── 📄 IconSymbol.tsx                 🟢 Cross-platform icon symbols
│       ├── 📄 TabBarBackground.ios.tsx       🟢 iOS tab bar background
│       └── 📄 TabBarBackground.tsx           🟢 Cross-platform tab bar background
├── 📁 constants/
│   └── 📄 Colors.ts                          🟢 Color theme constants
├── 📁 database/
│   ├── 📄 schema.sql                         🟢 Database schema definition
│   └── 📄 seed.sql                           🟢 Database seed data
├── 📁 hooks/
│   ├── 📄 useColorScheme.ts                  🟢 Color scheme hook
│   ├── 📄 useColorScheme.web.ts              🟢 Web-specific color scheme hook
│   └── 📄 useThemeColor.ts                   🟢 Theme color hook
├── 📁 scripts/
│   └── 📄 reset-project.js                   🟢 Project reset script
└── 📁 src/                                   Main source directory
    ├── 📄 App.tsx                            🔴 Main application component with routing
    ├── 📄 env.d.ts                           🟢 Environment type definitions
    ├── 📄 index.css                          🟢 Global styles and Tailwind imports
    ├── 📄 main.tsx                           🟢 Application entry point
    ├── 📁 components/
    │   ├── 📄 Footer.tsx                     🟢 Global footer component
    │   ├── 📄 Navbar.tsx                     🟡 Navigation bar with auth integration
    │   └── 📄 SearchBar.tsx                  🟢 Restaurant search component
    ├── 📁 contexts/
    │   ├── 📄 AuthContext.tsx                🔴 Authentication state management
    │   └── 📄 CartContext.tsx                🟡 Shopping cart state management
    ├── 📁 lib/
    │   └── 📄 supabase.ts                    🟢 Supabase client configuration
    └── 📁 pages/
        ├── 📄 Cart.tsx                       🟡 Shopping cart page
        ├── 📄 Checkout.tsx                   🟡 Order checkout page
        ├── 📄 Home.tsx                       🟢 Homepage with hero section
        ├── 📄 Login.tsx                      🟡 User login page
        ├── 📄 OrderTracking.tsx              🟢 Order status tracking page
        ├── 📄 Register.tsx                   🟡 User registration page
        ├── 📄 RestaurantListings.tsx         🟢 Restaurant list display
        ├── 📄 RestaurantMenu.tsx             🟡 Individual restaurant menu
        └── 📄 UserProfile.tsx                🟡 User profile management
```

## Statistics
- **Total Files:** 61 files
- **Complexity Distribution:**
  - 🟢 Low Complexity (0-3 imports): 49 files (80.3%)
  - 🟡 Medium Complexity (4-7 imports): 9 files (14.8%)
  - 🔴 High Complexity (8+ imports): 3 files (4.9%)

## Key Architectural Patterns
- **Component-based architecture** with React functional components
- **Context API** for state management (Auth, Cart)
- **File-based routing** with React Router
- **Type safety** with TypeScript throughout
- **Modern styling** with Tailwind CSS
- **Database integration** with Supabase
