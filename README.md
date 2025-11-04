# 🔋 Second-hand EV Battery Trading Platform - Frontend

A modern React-based platform for trading second-hand electric vehicle batteries and vehicles.

## 🚀 Tech Stack

- **React 18** - UI Library
- **Vite** - Build Tool & Dev Server
- **React Router** - Routing
- **Ant Design** - UI Components
- **Axios** - HTTP Client
- **React Toastify** - Notifications
- **CSS Modules** - Styling

## 📦 Features

- ✅ User Authentication (Login, Register, Google OAuth)
- ✅ Post Management (Create, Update, Delete)
- ✅ Battery & Vehicle Listings
- ✅ Payment Processing
- ✅ Post Packages (Featured listings)
- ✅ Customer Dashboard
- ✅ Staff Dashboard
- ✅ Admin Dashboard
- ✅ Buyer/Seller Request Management
- ✅ Service Constructs

## 🔧 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your API URL
VITE_API_BASE_URL=https://localhost:59212
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/       # Reusable components
│   ├── auth/        # Login, Register forms
│   ├── customer/    # Customer dashboard
│   ├── staff/       # Staff dashboard
│   ├── products/    # Product components
│   └── layout/      # Header, Footer, Layout
├── pages/           # Page components
│   ├── home/
│   ├── products/
│   ├── customer/
│   ├── staff/
│   └── admin/
├── services/        # API services (11 services)
│   ├── authService.js
│   ├── postService.js
│   ├── batteryService.js
│   ├── vehicleService.js
│   └── ...
├── constants/       # Constants & Enums
│   └── apiConstants.js
├── configs/         # Configuration
│   └── axios.js     # Axios instance with interceptors
└── utils/           # Utility functions
```

## 🔌 API Integration

This project is fully integrated with **EVehicleManagementAPI v1.0**.

### Quick Usage

```javascript
// Import services
import { authService, postService, batteryService } from "@/services";
import { POST_STATUS, PAYMENT_METHOD } from "@/constants/apiConstants";

// Login
const response = await authService.login({ email, password });

// Get posts
const posts = await postService.getPosts({ page: 1, pageSize: 10 });

// Create post
const newPost = await postService.createPost({
  title: "Pin xe máy điện",
  price: 5000000,
  postType: "Battery",
});
```

### Documentation

- 📖 **[API Integration Guide](./API_INTEGRATION_GUIDE.md)** - Complete integration guide
- ⚡ **[Quick Reference](./API_QUICK_REFERENCE.md)** - Quick reference for API services
- 💡 **[Examples](./API_EXAMPLES.md)** - Component integration examples
- 📊 **[Architecture](./API_ARCHITECTURE.md)** - System architecture diagrams
- ✅ **[Checklist](./API_INTEGRATION_CHECKLIST.md)** - Integration checklist
- 📋 **[Summary](./API_INTEGRATION_SUMMARY.md)** - Overall summary

## 🔐 Authentication

The app uses JWT token-based authentication:

1. User logs in with email/password
2. API returns JWT token
3. Token is stored in localStorage
4. Token is automatically added to all requests via Axios interceptor
5. On 401 error, user is automatically logged out

## 🌐 API Endpoints

**Total: 94 endpoints** across 11 modules:

- Auth (12 endpoints)
- Post (9 endpoints)
- Battery (7 endpoints)
- Vehicle (5 endpoints)
- Payment (11 endpoints)
- PostRequest (12 endpoints)
- Member (6 endpoints)
- Construct (13 endpoints)
- PostPackage (9 endpoints)
- BatteryModel (5 endpoints)
- VehicleModel (5 endpoints)

## 🎯 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🛠 Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=https://localhost:59212

# App Configuration
VITE_APP_NAME="EV Battery Trading Platform"
VITE_APP_VERSION=1.0.0

# Environment
VITE_ENV=development
```

## 📝 Key Services

### Authentication Service

```javascript
authService.login(credentials);
authService.register(data);
authService.logout();
authService.isAuthenticated();
authService.getCurrentUser();
```

### Post Service

```javascript
postService.getPosts(params);
postService.createPost(data);
postService.updatePost(id, data);
postService.deletePost(id);
postService.getFeaturedPosts();
```

### Battery Service

```javascript
batteryService.getBatteries();
batteryService.createBattery(data);
batteryService.searchBatteries(params);
```

### Payment Service

```javascript
paymentService.createPayment(data);
paymentService.processPayment(id);
paymentService.getPaymentStatistics();
```

## 🔒 Protected Routes

```javascript
import { authService } from "@/services";

const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};
```

## 🚨 Error Handling

Axios interceptor automatically handles:

- 401 → Auto logout and redirect to login
- 403 → Forbidden access
- 404 → Not found
- 500 → Server error
- Network errors

## 🎨 UI Components

Built with Ant Design:

- Forms (Login, Register, Create Post)
- Tables (Post management, Payment history)
- Modals (Post details, Payment confirmation)
- Cards (Product cards, Package cards)
- Tabs (Dashboard tabs)
- Notifications (Toast messages)

## 📱 Responsive Design

- Mobile-first approach
- CSS Modules for component-scoped styles
- Responsive breakpoints for all screen sizes

## 🔄 State Management

Currently using React hooks:

- `useState` for local state
- `useEffect` for side effects
- Context API for global state (optional)

## 🧪 Testing

```bash
# Run tests (when configured)
npm test
```

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Output will be in /dist folder
# Deploy to your preferred hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and confidential.

## 👥 Team

SWP391 - Group 3

## 🆘 Support

For API documentation, visit:

```
https://localhost:59212/swagger
```

---

**Last Updated**: November 3, 2025  
**Version**: 1.0.0  
**Status**: ✅ Ready for Integration
