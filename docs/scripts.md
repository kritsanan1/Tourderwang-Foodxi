
# Scripts Documentation

This document provides detailed information about all available npm scripts in the Tourderwang project.

## Available Scripts

| Script | Description | Parameters | Example | Troubleshooting |
|--------|-------------|------------|---------|-----------------|
| `dev` | Starts the Vite development server with hot module replacement | None | `npm run dev` | If port 5000 is busy, Vite will automatically use the next available port |
| `build` | Compiles TypeScript and builds production bundle | None | `npm run build` | Ensure all TypeScript errors are resolved before building |
| `preview` | Serves the production build locally for testing | `--port <number>` | `npm run preview --port 4173` | Requires `npm run build` to be executed first |
| `start` | Alias for `dev` - starts development server | None | `npm run start` | Same as `npm run dev` |
| `test` | Runs Jest test suite in watch mode | `--coverage`, `--silent` | `npm run test --coverage` | Ensure Jest is properly configured in package.json |
| `lint` | Runs ESLint on TypeScript/TSX files with error reporting | `--fix` | `npm run lint --fix` | Check eslint.config.js for rule configuration |
| `reset-project` | Resets the project to initial state (Expo specific) | None | `npm run reset-project` | This will move starter code to app-example directory |

## Detailed Script Information

### Development Scripts

#### `npm run dev`
- **Purpose**: Primary development command for local development
- **Port**: Runs on port 5000 (configured in vite.config.ts)
- **Features**: 
  - Hot Module Replacement (HMR)
  - Fast refresh for React components
  - TypeScript compilation
  - Tailwind CSS processing
- **Output Example**:
```bash
  VITE v7.0.6  ready in 349 ms

  ➜  Local:   http://localhost:5000/
  ➜  Network: http://172.31.113.130:5000/
  ➜  press h + enter to show help
```

#### `npm run start`
- **Purpose**: Alternative entry point for development
- **Behavior**: Identical to `npm run dev`
- **Use Case**: Compatibility with deployment platforms expecting `start` script

### Build Scripts

#### `npm run build`
- **Purpose**: Creates optimized production bundle
- **Process**: 
  1. TypeScript compilation (`tsc`)
  2. Vite bundling and optimization
  3. Asset processing and minification
- **Output Directory**: `dist/`
- **Troubleshooting**:
  - TypeScript errors will prevent build completion
  - Check console for specific error messages
  - Ensure all imports are properly resolved

#### `npm run preview`
- **Purpose**: Serves production build locally for testing
- **Requirements**: Must run `npm run build` first
- **Default Port**: 4173
- **Use Case**: Testing production build before deployment

### Quality Assurance Scripts

#### `npm run lint`
- **Purpose**: Code quality and style checking
- **Configuration**: `eslint.config.js`
- **Scope**: `.ts` and `.tsx` files
- **Features**:
  - Unused disable directives reporting
  - Maximum warnings limit (0)
  - TypeScript-aware linting
- **Common Fixes**:
```bash
npm run lint --fix  # Auto-fix formatting issues
```

#### `npm run test`
- **Purpose**: Unit and integration testing
- **Framework**: Jest with Expo preset
- **Mode**: Watch mode (reruns on file changes)
- **Coverage**: Use `--coverage` flag for coverage reports
- **Configuration**: Jest config in `package.json`

### Utility Scripts

#### `npm run reset-project`
- **Purpose**: Expo-specific project reset
- **Action**: Moves starter code to `app-example/`
- **Result**: Creates blank `app/` directory
- **Use Case**: Starting fresh with Expo file-based routing

## Environment-Specific Commands

### Development Environment
```bash
# Start development with environment variables
VITE_DEBUG=true npm run dev

# Development with specific port
npm run dev -- --port 3000
```

### Production Environment
```bash
# Build with production optimizations
NODE_ENV=production npm run build

# Preview with production environment
NODE_ENV=production npm run preview
```

## Workflow Integration

### Pre-commit Hooks
```bash
# Recommended pre-commit workflow
npm run lint          # Check code quality
npm run test          # Run tests
npm run build         # Ensure build works
```

### CI/CD Pipeline
```bash
# Typical CI/CD script sequence
npm ci                # Clean install
npm run lint          # Quality check
npm run test          # Test suite
npm run build         # Production build
```

## Performance Optimization

### Build Analysis
```bash
# Analyze bundle size
npm run build -- --analyze

# Debug build process
npm run build -- --debug
```

### Development Performance
```bash
# Start with reduced logging
npm run dev -- --silent

# Development with source maps
npm run dev -- --sourcemap
```

## Common Issues and Solutions

### Port Conflicts
```bash
# If default port is busy
Error: Port 5000 is already in use
Solution: Vite will automatically find next available port
```

### Memory Issues
```bash
# For large projects, increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### TypeScript Errors
```bash
# Check TypeScript compilation separately
npx tsc --noEmit

# Fix common TypeScript issues
npm run lint --fix
```

### Cache Issues
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# Clear all caches
rm -rf node_modules/.cache
npm run build
```

## Script Customization

### Adding Custom Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "dev:debug": "VITE_DEBUG=true npm run dev",
    "build:analyze": "npm run build -- --analyze",
    "test:coverage": "npm run test -- --coverage --watchAll=false"
  }
}
```

### Environment Variables in Scripts
```json
{
  "scripts": {
    "dev:staging": "VITE_API_URL=https://staging-api.com npm run dev",
    "build:production": "NODE_ENV=production npm run build"
  }
}
```
