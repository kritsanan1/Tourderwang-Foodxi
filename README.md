# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# Tourderwang Food Delivery Platform

A modern, localized food delivery application designed specifically for Wang Sam Mo, Udonthani, Thailand. Built with React, TypeScript, and Supabase, featuring Thai language support and local restaurant integration.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git** (latest version)
- **Supabase Account** (for backend services)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/tourderwang-food.git
cd tourderwang-food
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```bash
# Edit .env file with your Supabase credentials
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🔧 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ | `eyJhbGciOiJIUzI1NiIs...` |

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready application |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run test` | Run Jest test suite |

## 🏗️ Architecture Overview

### Frontend Stack
- **React 19** - UI library with modern hooks
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend Services
- **Supabase** - Authentication, database, and real-time features
- **PostgreSQL** - Primary database
- **Row Level Security** - Data protection

### Key Features
- 🔐 **Authentication** - Email/social login with JWT
- 🍜 **Restaurant Management** - Browse local restaurants
- 🛒 **Shopping Cart** - Add/remove items, quantity management
- 📱 **Responsive Design** - Mobile-first approach
- 🌐 **Localization** - Thai language support
- ⚡ **Real-time Updates** - Live order tracking

## 🔄 Development Workflow

### Branch Naming Convention
```
[type]/[ticket-number]-[brief-description]

Examples:
feature/TW-123-add-payment-integration
bugfix/TW-456-fix-cart-total-calculation
hotfix/TW-789-fix-login-redirect
```

### Git Workflow
1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Push branch and create Pull Request
4. Request code review
5. Merge after approval

### Code Style Guidelines
- **ESLint** configuration enforced
- **Prettier** for consistent formatting
- **TypeScript strict mode** enabled
- **Component naming** - PascalCase for components
- **File naming** - kebab-case for utility files

## 📋 Pull Request Template

```markdown
## Changes Made
- [ ] Brief description of changes
- [ ] List of modified files
- [ ] New features added

## Testing
- [ ] Unit tests passing
- [ ] Manual testing completed
- [ ] Cross-browser compatibility checked

## Screenshots
[Include relevant screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🚀 Deployment

### Replit Deployment
1. Connect your GitHub repository to Replit
2. Configure environment variables in Replit Secrets
3. Use the Deploy button in Replit interface
4. Monitor deployment logs for any issues

### Environment Configuration
- Set all required environment variables in deployment platform
- Ensure database migrations are applied
- Verify API endpoints are accessible

## 🛠️ Troubleshooting

### Common Issues

**Port Access Error**
```bash
# If you see "host not allowed" error
# This is fixed in vite.config.ts with allowedHosts: 'all'
```

**Module Type Warning**
```bash
# Package.json includes "type": "module" to resolve ES module warnings
```

**Supabase Connection Issues**
- Verify environment variables are correctly set
- Check Supabase project status
- Ensure RLS policies are properly configured

**Build Failures**
- Clear node_modules and reinstall dependencies
- Check TypeScript errors in console
- Verify all imports are correctly typed

## 📚 Documentation

- [File Structure](./docs/filesExplainer.md) - Detailed file organization
- [Architecture](./docs/architecture.md) - System design overview
- [Scripts](./docs/scripts.md) - Available npm scripts
- [Database Schema](./database/schema.sql) - Database structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions or issues:
- Check existing [Issues](https://github.com/your-username/tourderwang-food/issues)
- Create a new issue with detailed description
- Contact the development team

---

Made with ❤️ for the Wang Sam Mo community
