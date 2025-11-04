# API Integration Guide

## 📋 Tổng quan

Dự án đã được tích hợp với **EVehicleManagementAPI** (v1.0). Tất cả các API endpoints đã được cấu hình và sẵn sàng sử dụng.

## 🔧 Cấu hình

### 1. Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cấu hình URL của API backend:

```env
VITE_API_BASE_URL=https://localhost:59212
```

### 2. Axios Configuration

File `src/configs/axios.js` đã được cấu hình với:

- Base URL từ environment variables
- Request interceptor để tự động thêm JWT token
- Response interceptor để xử lý lỗi (401, 403, 404, 500)
- Timeout 10 giây

## 📦 API Services

Tất cả services đã được tạo trong thư mục `src/services/`:

### Authentication Service (`authService.js`)

```javascript
import { authService } from '@/services';

// Login
const response = await authService.login({ email, password });

// Register
await authService.register({ email, password, fullName, ... });

// Staff Login
await authService.staffLogin({ email, password });

// Change Password
await authService.changePassword({ oldPassword, newPassword });

// Forgot Password
await authService.forgotPassword(email);

// Verify OTP
await authService.verifyOTP({ email, code, purpose });

// Google Auth
authService.googleAuthStart(); // Redirect to Google

// Logout
authService.logout();

// Check Authentication
const isAuth = authService.isAuthenticated();
const user = authService.getCurrentUser();
```

### Post Service (`postService.js`)

```javascript
import { postService } from "@/services";

// Get all posts (with filters)
const posts = await postService.getPosts({
  page: 1,
  pageSize: 10,
  status: "Active",
  postType: "Battery",
});

// Create post
const newPost = await postService.createPost({
  title: "Pin xe máy điện",
  description: "...",
  price: 5000000,
  postType: "Battery",
  transactionType: "DIRECT",
  batteryId: 123,
});

// Get post by ID
const post = await postService.getPostById(1);

// Update post
await postService.updatePost(1, updatedData);

// Delete post
await postService.deletePost(1);

// Get featured posts
const featured = await postService.getFeaturedPosts();

// Get posts by member
const myPosts = await postService.getPostsByMember(memberId);

// Assign staff to post
await postService.assignStaff(postId, staffId);
```

### Battery Service (`batteryService.js`)

```javascript
import { batteryService } from "@/services";

// CRUD operations
const batteries = await batteryService.getBatteries();
const battery = await batteryService.getBatteryById(1);
await batteryService.createBattery(batteryData);
await batteryService.updateBattery(1, batteryData);
await batteryService.deleteBattery(1);

// Get batteries by member
const myBatteries = await batteryService.getBatteriesByMember(memberId);

// Search batteries
const results = await batteryService.searchBatteries({
  brand: "Tesla",
  capacity: 75,
});
```

### Vehicle Service (`vehicleService.js`)

```javascript
import { vehicleService } from "@/services";

// CRUD operations
const vehicles = await vehicleService.getVehicles();
const vehicle = await vehicleService.getVehicleById(1);
await vehicleService.createVehicle(vehicleData);
await vehicleService.updateVehicle(1, vehicleData);
await vehicleService.deleteVehicle(1);
```

### Battery Model Service (`batteryModelService.js`)

```javascript
import { batteryModelService } from "@/services";

// Get all battery models
const models = await batteryModelService.getBatteryModels();

// Get model by ID
const model = await batteryModelService.getBatteryModelById(1);

// Create custom model
await batteryModelService.createCustomBatteryModel(customData);

// Get filters
const filters = await batteryModelService.getAllFilters();

// Search models
const results = await batteryModelService.searchBatteryModels({ brand: "LG" });
```

### Vehicle Model Service (`vehicleModelService.js`)

```javascript
import { vehicleModelService } from "@/services";

// Similar to batteryModelService
const models = await vehicleModelService.getVehicleModels();
const filters = await vehicleModelService.getAllFilters();
```

### Payment Service (`paymentService.js`)

```javascript
import { paymentService } from "@/services";

// Create payment
const payment = await paymentService.createPayment({
  amount: 5000000,
  method: "BankTransfer",
  buyerId: 1,
  sellerId: 2,
});

// Get payments
const payments = await paymentService.getPayments();
const payment = await paymentService.getPaymentById(1);

// Get payments by buyer/seller
const buyerPayments = await paymentService.getPaymentsByBuyer(buyerId);
const sellerPayments = await paymentService.getPaymentsBySeller(sellerId);

// Update payment status
await paymentService.updatePaymentStatus(1, { status: "Completed" });

// Process payment
await paymentService.processPayment(1);

// Get statistics
const stats = await paymentService.getPaymentStatistics();
```

### Package Service (`packageService.js`)

```javascript
import { packageService } from "@/services";

// Get active packages
const packages = await packageService.getActivePackages();

// Subscribe to package
await packageService.subscribeToPackage(packageId, {
  postId: 1,
  memberId: 1,
});

// Get package subscriptions
const subs = await packageService.getPackageSubscriptions(packageId);

// Get statistics
const stats = await packageService.getPackageStatistics();
```

### Post Request Service (`postRequestService.js`)

```javascript
import { postRequestService } from "@/services";

// Create post request (buyer contacts seller)
const request = await postRequestService.createPostRequest({
  postId: 1,
  buyerId: 2,
  message: "Tôi muốn mua pin này",
  offerPrice: 4500000,
});

// Get requests for a post
const requests = await postRequestService.getRequestsByPost(postId);

// Get requests by buyer
const myRequests = await postRequestService.getRequestsByBuyer(buyerId);

// Accept/Reject request
await postRequestService.acceptRequest(requestId);
await postRequestService.rejectRequest(requestId);

// Get negotiations
const negotiations = await postRequestService.getNegotiationsByPost(postId);

// Get statistics
const stats = await postRequestService.getRequestStatistics();
```

### Member Service (`memberService.js`)

```javascript
import { memberService } from "@/services";

// CRUD operations
const members = await memberService.getMembers();
const member = await memberService.getMemberById(1);
await memberService.updateMember(1, memberData);

// Get top-rated members
const topRated = await memberService.getTopRatedMembers();
```

### Construct Service (`constructService.js`)

```javascript
import { constructService } from "@/services";

// Get constructs
const constructs = await constructService.getConstructs();

// Get by type/status
const inspections = await constructService.getConstructsByType("Inspection");
const pending = await constructService.getConstructsByStatus("Pending");

// Get/Add fees
const fees = await constructService.getConstructFees(constructId);
await constructService.addConstructFee(constructId, feeData);

// Search nearby
const nearby = await constructService.getNearbyConstructs({
  lat: 10.762622,
  lng: 106.660172,
});

// Get statistics
const stats = await constructService.getConstructStatistics();
```

## 🎯 Constants

File `src/constants/apiConstants.js` chứa tất cả enums và constants:

```javascript
import {
  POST_STATUS,
  POST_TYPE,
  TRANSACTION_TYPE,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
  ROLE,
  BATTERY_CONDITION,
  VEHICLE_CONDITION
} from '@/constants/apiConstants';

// Usage
if (post.status === POST_STATUS.ACTIVE) { ... }
if (payment.status === PAYMENT_STATUS.COMPLETED) { ... }
```

## 🔐 Authentication Flow

### 1. Login

```javascript
try {
  const response = await authService.login({ email, password });
  // Token automatically saved to localStorage
  // User data saved to localStorage
  console.log("User:", response.user);
  console.log("Token:", response.token);
} catch (error) {
  console.error("Login failed:", error);
}
```

### 2. Protected Requests

```javascript
// Token automatically added to all requests via interceptor
// No need to manually add Authorization header

const posts = await postService.getPosts(); // Token auto-included
```

### 3. Logout

```javascript
authService.logout(); // Clears token and user data
// Redirects to login page
```

### 4. Check Authentication

```javascript
if (!authService.isAuthenticated()) {
  // Redirect to login
  navigate("/login");
}

const currentUser = authService.getCurrentUser();
```

## 🚨 Error Handling

Axios interceptor tự động xử lý lỗi:

```javascript
try {
  const data = await postService.createPost(postData);
} catch (error) {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 400:
        alert("Invalid data: " + error.response.data.message);
        break;
      case 401:
        // Automatically logged out and redirected
        break;
      case 403:
        alert("You don't have permission");
        break;
      case 404:
        alert("Resource not found");
        break;
      case 500:
        alert("Server error");
        break;
    }
  } else if (error.request) {
    alert("No response from server. Check your connection.");
  } else {
    alert("Error: " + error.message);
  }
}
```

## 📝 Best Practices

### 1. Sử dụng try-catch

```javascript
const MyComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postService.getPosts();
      // Process data
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
};
```

### 2. Loading States

```javascript
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadPosts = async () => {
    try {
      const data = await postService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  loadPosts();
}, []);

if (loading) return <LoadingSpinner />;
```

### 3. Protected Routes

```javascript
const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Usage in App.jsx
<Route
  path="/customer"
  element={
    <ProtectedRoute>
      <CustomerPage />
    </ProtectedRoute>
  }
/>;
```

## 🔄 Database Schema Reference

### Key Tables

- **Accounts**: User authentication
- **Members**: User profiles (linked to Accounts)
- **Posts**: Battery/Vehicle listings
- **Batteries**: Battery details
- **Vehicles**: Vehicle details
- **PostRequests**: Buyer requests to sellers
- **Payments**: Transaction payments
- **PostPackages**: Featured post packages
- **Constructs**: Service constructs (inspection, repair, etc.)

### Relationships

- Account → Member (1:1)
- Member → Posts (1:N)
- Member → Batteries (1:N)
- Member → Vehicles (1:N)
- Post → PostRequests (1:N)
- Post → Battery/Vehicle (N:1)
- Payment → Buyer/Seller Members (N:1)

## 🧪 Testing API

### Using Browser Console

```javascript
// Import in component
import { postService } from "@/services";

// Test in useEffect or handler
const test = async () => {
  const posts = await postService.getPosts();
  console.log("Posts:", posts);
};
```

### Using API directly (for debugging)

```javascript
import api from "@/configs/axios";

const response = await api.get("/api/Post");
console.log(response.data);
```

## 📚 Additional Resources

- API Documentation: `https://localhost:59212/swagger`
- Database Schema: `EVehicleDB` (SQL Server)
- Swagger JSON: `https://localhost:59212/swagger/v1/swagger.json`

## 🆘 Troubleshooting

### CORS Issues

Nếu gặp lỗi CORS, thêm vào backend:

```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", builder => {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
```

### SSL Certificate Issues

Nếu localhost HTTPS gặp vấn đề:

```javascript
// Temporary: Accept self-signed certificates
// In axios.js
const api = axios.create({
  baseURL: apiBaseURL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});
```

### Token Expiration

Token hết hạn sẽ tự động logout và redirect về `/login`.

---

**Last Updated**: November 3, 2025
**API Version**: 1.0
**Database**: EVehicleDB
