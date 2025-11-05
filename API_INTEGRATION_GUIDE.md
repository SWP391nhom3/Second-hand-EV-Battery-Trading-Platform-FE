# API Integration Guide - EV Battery Trading Platform# API Integration Guide

## 📋 Tổng Quan API## 📋 Tổng quan

API đã được cập nhật theo OpenAPI 3.0.4 spec. Dưới đây là hướng dẫn tích hợp các endpoint chính.Dự án đã được tích hợp với **EVehicleManagementAPI** (v1.0). Tất cả các API endpoints đã được cấu hình và sẵn sàng sử dụng.

---## 🔧 Cấu hình

## 🔐 Authentication### 1. Environment Variables

### SecurityTạo file `.env` từ `.env.example`:

- **Type**: Bearer Token (JWT)

- **Header**: `Authorization: Bearer {token}````bash

- **Format**: Nhập token theo định dạng: `Bearer {token}`cp .env.example .env

````

### Auth Endpoints

Cấu hình URL của API backend:

#### 1. Register

```javascript```env

POST /api/Auth/registerVITE_API_BASE_URL=https://localhost:59212

Body: {```

  email: string,

  password: string,### 2. Axios Configuration

  fullName: string

}File `src/configs/axios.js` đã được cấu hình với:

````

- Base URL từ environment variables

#### 2. Login- Request interceptor để tự động thêm JWT token

````javascript- Response interceptor để xử lý lỗi (401, 403, 404, 500)

POST /api/Auth/login- Timeout 10 giây

Body: {

  email: string,## 📦 API Services

  password: string

}Tất cả services đã được tạo trong thư mục `src/services/`:

Response: {

  token: string,### Authentication Service (`authService.js`)

  user: { ... }

}```javascript

```import { authService } from '@/services';



#### 3. Change Password// Login

```javascriptconst response = await authService.login({ email, password });

POST /api/Auth/change-password

Body: {// Register

  accountId: number,await authService.register({ email, password, fullName, ... });

  oldPassword: string,

  newPassword: string// Staff Login

}await authService.staffLogin({ email, password });

````

// Change Password

#### 4. Forgot Passwordawait authService.changePassword({ oldPassword, newPassword });

```````javascript

POST /api/Auth/forgot-password// Forgot Password

Body: {await authService.forgotPassword(email);

  email: string

}// Verify OTP

```await authService.verifyOTP({ email, code, purpose });



---// Google Auth

authService.googleAuthStart(); // Redirect to Google

## 📝 Post (Tin Đăng)

// Logout

### Post SchemaauthService.logout();

```typescript

interface Post {// Check Authentication

  postId: number;const isAuth = authService.isAuthenticated();

  memberId: number;const user = authService.getCurrentUser();

  vehicleId?: number | null;```

  batteryId?: number | null;

  title: string;### Post Service (`postService.js`)

  description?: string;

  price: number;```javascript

  postType: string; // "Direct" | "Staff-Assisted"import { postService } from "@/services";

  transactionType: string;

  staffId?: number | null;// Get all posts (with filters)

  contactInfo?: string;const posts = await postService.getPosts({

  status: string; // "Active" | "Inactive" | "Pending" | "Approved"  page: 1,

  createdAt: string;  pageSize: 10,

  updatedAt: string;  status: "Active",

  expiryDate?: string | null;  postType: "Battery",

  featured: boolean;});



  // Relations// Create post

  member?: Member;const newPost = await postService.createPost({

  vehicle?: Vehicle;  title: "Pin xe máy điện",

  battery?: Battery;  description: "...",

  staff?: Member;  price: 5000000,

  postPackageSubs?: PostPackageSub[];  postType: "Battery",

  postRequests?: PostRequest[];  transactionType: "DIRECT",

}  batteryId: 123,

```});



### Post Endpoints// Get post by ID

const post = await postService.getPostById(1);

#### 1. Get All Posts

```javascript// Update post

GET /api/Postawait postService.updatePost(1, updatedData);

Query Params:

  - pageNumber?: number// Delete post

  - pageSize?: numberawait postService.deletePost(1);

  - search?: string

  - minPrice?: number// Get featured posts

  - maxPrice?: numberconst featured = await postService.getFeaturedPosts();

  - status?: string

  - featured?: boolean// Get posts by member

  - postType?: stringconst myPosts = await postService.getPostsByMember(memberId);



Usage:// Assign staff to post

const posts = await postService.getPosts({await postService.assignStaff(postId, staffId);

  pageNumber: 1,```

  pageSize: 12,

  featured: true### Battery Service (`batteryService.js`)

});

``````javascript

import { batteryService } from "@/services";

#### 2. Get Post By ID

```javascript// CRUD operations

GET /api/Post/{id}const batteries = await batteryService.getBatteries();

const battery = await batteryService.getBatteryById(1);

Usage:await batteryService.createBattery(batteryData);

const post = await postService.getPostById(123);await batteryService.updateBattery(1, batteryData);

// Returns full Post object with nested Battery/Vehicle and Memberawait batteryService.deleteBattery(1);

```````

// Get batteries by member

#### 3. Create Postconst myBatteries = await batteryService.getBatteriesByMember(memberId);

````javascript

POST /api/Post// Search batteries

Body: {const results = await batteryService.searchBatteries({

  memberId: number,  brand: "Tesla",

  vehicleId?: number,  capacity: 75,

  batteryId?: number,});

  title: string,```

  description?: string,

  price: number,### Vehicle Service (`vehicleService.js`)

  postType: string,

  transactionType: string,```javascript

  contactInfo?: string,import { vehicleService } from "@/services";

  featured?: boolean

}// CRUD operations

const vehicles = await vehicleService.getVehicles();

Usage:const vehicle = await vehicleService.getVehicleById(1);

const newPost = await postService.createPost({await vehicleService.createVehicle(vehicleData);

  memberId: 1,await vehicleService.updateVehicle(1, vehicleData);

  batteryId: 5,await vehicleService.deleteVehicle(1);

  title: "Pin Tesla 85kWh",```

  description: "Pin còn mới 90%",

  price: 240000000,### Battery Model Service (`batteryModelService.js`)

  postType: "Direct",

  transactionType: "Sale",```javascript

  contactInfo: "0912345678"import { batteryModelService } from "@/services";

});

```// Get all battery models

const models = await batteryModelService.getBatteryModels();

#### 4. Update Post

```javascript// Get model by ID

PUT /api/Post/{id}const model = await batteryModelService.getBatteryModelById(1);

Body: Post object

// Create custom model

Usage:await batteryModelService.createCustomBatteryModel(customData);

await postService.updatePost(123, { ...postData });

```// Get filters

const filters = await batteryModelService.getAllFilters();

#### 5. Delete Post

```javascript// Search models

DELETE /api/Post/{id}const results = await batteryModelService.searchBatteryModels({ brand: "LG" });

````

Usage:

await postService.deletePost(123);### Vehicle Model Service (`vehicleModelService.js`)

````

```javascript

#### 6. Get Posts By Memberimport { vehicleModelService } from "@/services";

```javascript

GET /api/Post/member/{memberId}// Similar to batteryModelService

const models = await vehicleModelService.getVehicleModels();

Usage:const filters = await vehicleModelService.getAllFilters();

const memberPosts = await postService.getPostsByMember(1);```

````

### Payment Service (`paymentService.js`)

#### 7. Assign Staff to Post

`javascript`javascript

PUT /api/Post/{postId}/assign-staff/{staffId}import { paymentService } from "@/services";

Usage:// Create payment

await postService.assignStaff(123, 456);const payment = await paymentService.createPayment({

````amount: 5000000,

  method: "BankTransfer",

#### 8. Get Featured Posts  buyerId: 1,

```javascript  sellerId: 2,

GET /api/Post/featured});



Usage:// Get payments

const featuredPosts = await postService.getFeaturedPosts();const payments = await paymentService.getPayments();

```const payment = await paymentService.getPaymentById(1);



#### 9. Get Direct Posts// Get payments by buyer/seller

```javascriptconst buyerPayments = await paymentService.getPaymentsByBuyer(buyerId);

GET /api/Post/directconst sellerPayments = await paymentService.getPaymentsBySeller(sellerId);



Usage:// Update payment status

const directPosts = await postService.getDirectPosts();await paymentService.updatePaymentStatus(1, { status: "Completed" });

````

// Process payment

#### 10. Get Staff-Assisted Postsawait paymentService.processPayment(1);

````javascript

GET /api/Post/staff-assisted// Get statistics

const stats = await paymentService.getPaymentStatistics();

Usage:```

const assistedPosts = await postService.getStaffAssistedPosts();

```### Package Service (`packageService.js`)



---```javascript

import { packageService } from "@/services";

## 🔋 Battery

// Get active packages

### Battery Schemaconst packages = await packageService.getActivePackages();

```typescript

interface Battery {// Subscribe to package

  batteryId: number;await packageService.subscribeToPackage(packageId, {

  memberId: number;  postId: 1,

  brand: string;  memberId: 1,

  capacityKWh: number;});

  cycleCount: number;

  manufactureYear: number;// Get package subscriptions

  condition: string; // "excellent" | "good" | "fair" | "poor"const subs = await packageService.getPackageSubscriptions(packageId);

  description?: string;

  // Get statistics

  // Relationsconst stats = await packageService.getPackageStatistics();

  member?: Member;```

  posts?: Post[];

}### Post Request Service (`postRequestService.js`)

````

````javascript

### Battery Endpointsimport { postRequestService } from "@/services";



#### 1. Get All Batteries// Create post request (buyer contacts seller)

```javascriptconst request = await postRequestService.createPostRequest({

GET /api/Battery  postId: 1,

```  buyerId: 2,

  message: "Tôi muốn mua pin này",

#### 2. Get Battery By ID  offerPrice: 4500000,

```javascript});

GET /api/Battery/{id}

```// Get requests for a post

const requests = await postRequestService.getRequestsByPost(postId);

#### 3. Create Battery

```javascript// Get requests by buyer

POST /api/Batteryconst myRequests = await postRequestService.getRequestsByBuyer(buyerId);

Body: {

  memberId: number,// Accept/Reject request

  brand: string,await postRequestService.acceptRequest(requestId);

  capacityKWh: number,await postRequestService.rejectRequest(requestId);

  cycleCount: number,

  manufactureYear: number,// Get negotiations

  condition: string,const negotiations = await postRequestService.getNegotiationsByPost(postId);

  description?: string

}// Get statistics

```const stats = await postRequestService.getRequestStatistics();

````

#### 4. Get Batteries By Member

```javascript### Member Service (`memberService.js`)

GET /api/Battery/member/{memberId}

````javascript

Usage:import { memberService } from "@/services";

const batteries = await batteryService.getBatteriesByMember(1);

```// CRUD operations

const members = await memberService.getMembers();

#### 5. Search Batteriesconst member = await memberService.getMemberById(1);

```javascriptawait memberService.updateMember(1, memberData);

GET /api/Battery/search

Query Params:// Get top-rated members

  - brand?: stringconst topRated = await memberService.getTopRatedMembers();

  - minCapacity?: number```

  - maxCapacity?: number

### Construct Service (`constructService.js`)

Usage:

const results = await batteryService.searchBatteries({```javascript

  brand: "Tesla",import { constructService } from "@/services";

  minCapacity: 50,

  maxCapacity: 100// Get constructs

});const constructs = await constructService.getConstructs();

````

// Get by type/status

---const inspections = await constructService.getConstructsByType("Inspection");

const pending = await constructService.getConstructsByStatus("Pending");

## 🚗 Vehicle

// Get/Add fees

### Vehicle Schemaconst fees = await constructService.getConstructFees(constructId);

```````typescriptawait constructService.addConstructFee(constructId, feeData);

interface Vehicle {

  id: number;// Search nearby

  memberId: number;const nearby = await constructService.getNearbyConstructs({

  brand: string;  lat: 10.762622,

  model: string;  lng: 106.660172,

  manufactureYear: number;});

  mileageKm: number;

  batteryCapacity: number;// Get statistics

  condition: string;const stats = await constructService.getConstructStatistics();

  description?: string;```



  // Relations## 🎯 Constants

  member?: Member;

  posts?: Post[];File `src/constants/apiConstants.js` chứa tất cả enums và constants:

}

``````javascript

import {

### Vehicle Endpoints  POST_STATUS,

  POST_TYPE,

#### 1. Get All Vehicles  TRANSACTION_TYPE,

```javascript  PAYMENT_STATUS,

GET /api/Vehicle  PAYMENT_METHOD,

```  ROLE,

  BATTERY_CONDITION,

#### 2. Get Vehicle By ID  VEHICLE_CONDITION

```javascript} from '@/constants/apiConstants';

GET /api/Vehicle/{id}

```// Usage

if (post.status === POST_STATUS.ACTIVE) { ... }

#### 3. Create Vehicleif (payment.status === PAYMENT_STATUS.COMPLETED) { ... }

```javascript```

POST /api/Vehicle

Body: {## 🔐 Authentication Flow

  memberId: number,

  brand: string,### 1. Login

  model: string,

  manufactureYear: number,```javascript

  mileageKm: number,try {

  batteryCapacity: number,  const response = await authService.login({ email, password });

  condition: string,  // Token automatically saved to localStorage

  description?: string  // User data saved to localStorage

}  console.log("User:", response.user);

```  console.log("Token:", response.token);

} catch (error) {

---  console.error("Login failed:", error);

}

## 👤 Member```



### Member Schema### 2. Protected Requests

```typescript

interface Member {```javascript

  memberId: number;// Token automatically added to all requests via interceptor

  accountId: number;// No need to manually add Authorization header

  fullName: string;

  avatarUrl?: string;const posts = await postService.getPosts(); // Token auto-included

  address?: string;```

  joinedAt: string;

  rating: number;### 3. Logout

  status: string; // "Active" | "Inactive" | "Suspended"

  ```javascript

  // RelationsauthService.logout(); // Clears token and user data

  account?: Account;// Redirects to login page

  vehicles?: Vehicle[];```

  batteries?: Battery[];

  posts?: Post[];### 4. Check Authentication

  paymentsAsBuyer?: Payment[];

  paymentsAsSeller?: Payment[];```javascript

}if (!authService.isAuthenticated()) {

```  // Redirect to login

  navigate("/login");

### Member Endpoints}



#### 1. Get All Membersconst currentUser = authService.getCurrentUser();

```javascript```

GET /api/Member

```## 🚨 Error Handling



#### 2. Get Member By IDAxios interceptor tự động xử lý lỗi:

```javascript

GET /api/Member/{id}```javascript

try {

Usage:  const data = await postService.createPost(postData);

const member = await memberService.getMemberById(1);} catch (error) {

```  if (error.response) {

    // Server responded with error

#### 3. Get Top Rated Members    switch (error.response.status) {

```javascript      case 400:

GET /api/Member/top-rated        alert("Invalid data: " + error.response.data.message);

        break;

Usage:      case 401:

const topMembers = await memberService.getTopRatedMembers();        // Automatically logged out and redirected

```        break;

      case 403:

---        alert("You don't have permission");

        break;

## 📦 PostPackage (Gói Đăng Tin)      case 404:

        alert("Resource not found");

### PostPackage Schema        break;

```typescript      case 500:

interface PostPackage {        alert("Server error");

  packageId: number;        break;

  name: string;    }

  durationDay: number;  } else if (error.request) {

  price: number;    alert("No response from server. Check your connection.");

  priorityLevel: number;  } else {

  description?: string;    alert("Error: " + error.message);

    }

  // Relations}

  postPackageSubs?: PostPackageSub[];```

}

```## 📝 Best Practices



### PostPackage Endpoints### 1. Sử dụng try-catch



#### 1. Get All Packages```javascript

```javascriptconst MyComponent = () => {

GET /api/PostPackage  const [loading, setLoading] = useState(false);

```  const [error, setError] = useState(null);



#### 2. Get Active Packages  const fetchData = async () => {

```javascript    setLoading(true);

GET /api/PostPackage/active    setError(null);

    try {

Usage:      const data = await postService.getPosts();

const activePackages = await packageService.getActivePackages();      // Process data

```    } catch (err) {

      setError(err.message);

#### 3. Subscribe to Package    } finally {

```javascript      setLoading(false);

POST /api/PostPackage/{packageId}/subscribe    }

Body: {  };

  postId: number,};

  memberId: number,```

  paymentId: number

}### 2. Loading States



Usage:```javascript

await packageService.subscribeToPackage(1, {const [posts, setPosts] = useState([]);

  postId: 123,const [loading, setLoading] = useState(true);

  memberId: 456,

  paymentId: 789useEffect(() => {

});  const loadPosts = async () => {

```    try {

      const data = await postService.getPosts();

#### 4. Get Package Statistics      setPosts(data);

```javascript    } catch (error) {

GET /api/PostPackage/statistics      console.error(error);

    } finally {

Usage:      setLoading(false);

const stats = await packageService.getPackageStatistics();    }

```  };

  loadPosts();

---}, []);



## 💬 PostRequest (Yêu Cầu Mua)if (loading) return <LoadingSpinner />;

```````

### PostRequest Schema

````typescript### 3. Protected Routes

interface PostRequest {

  id: number;```javascript

  postId: number;const ProtectedRoute = ({ children }) => {

  buyerId: number;  if (!authService.isAuthenticated()) {

  constructId?: number | null;    return <Navigate to="/login" />;

  message?: string;  }

  offerPrice: number;  return children;

  status: string; // "Pending" | "Accepted" | "Rejected" | "Negotiating"};

  createdAt: string;

  // Usage in App.jsx

  // Relations<Route

  post?: Post;  path="/customer"

  buyer?: Member;  element={

  construct?: Construct;    <ProtectedRoute>

}      <CustomerPage />

```    </ProtectedRoute>

  }

### PostRequest Endpoints/>;

````

#### 1. Create Post Request

````javascript## 🔄 Database Schema Reference

POST /api/PostRequest

Body: {### Key Tables

  postId: number,

  buyerId: number,- **Accounts**: User authentication

  constructId?: number,- **Members**: User profiles (linked to Accounts)

  message?: string,- **Posts**: Battery/Vehicle listings

  offerPrice: number- **Batteries**: Battery details

}- **Vehicles**: Vehicle details

- **PostRequests**: Buyer requests to sellers

Usage:- **Payments**: Transaction payments

await postRequestService.createPostRequest({- **PostPackages**: Featured post packages

  postId: 123,- **Constructs**: Service constructs (inspection, repair, etc.)

  buyerId: 456,

  message: "Tôi muốn mua sản phẩm này",### Relationships

  offerPrice: 230000000

});- Account → Member (1:1)

```- Member → Posts (1:N)

- Member → Batteries (1:N)

#### 2. Get Requests By Post- Member → Vehicles (1:N)

```javascript- Post → PostRequests (1:N)

GET /api/PostRequest/post/{postId}- Post → Battery/Vehicle (N:1)

- Payment → Buyer/Seller Members (N:1)

Usage:

const requests = await postRequestService.getRequestsByPost(123);## 🧪 Testing API

````

### Using Browser Console

#### 3. Get Requests By Buyer

`javascript`javascript

GET /api/PostRequest/buyer/{buyerId}// Import in component

import { postService } from "@/services";

Usage:

const myRequests = await postRequestService.getRequestsByBuyer(456);// Test in useEffect or handler

```````const test = async () => {

  const posts = await postService.getPosts();

#### 4. Accept Request  console.log("Posts:", posts);

```javascript};

PUT /api/PostRequest/{id}/accept```



Usage:### Using API directly (for debugging)

await postRequestService.acceptRequest(789);

``````javascript

import api from "@/configs/axios";

#### 5. Reject Request

```javascriptconst response = await api.get("/api/Post");

PUT /api/PostRequest/{id}/rejectconsole.log(response.data);

```````

Usage:

await postRequestService.rejectRequest(789);## 📚 Additional Resources

````

- API Documentation: `https://localhost:59212/swagger`

#### 6. Get Negotiations- Database Schema: `EVehicleDB` (SQL Server)

```javascript- Swagger JSON: `https://localhost:59212/swagger/v1/swagger.json`

GET /api/PostRequest/negotiations/{postId}

## 🆘 Troubleshooting

Usage:

const negotiations = await postRequestService.getNegotiationsByPost(123);### CORS Issues

````

Nếu gặp lỗi CORS, thêm vào backend:

---

````csharp

## 💳 Paymentbuilder.Services.AddCors(options => {

    options.AddPolicy("AllowAll", builder => {

### Payment Schema        builder.AllowAnyOrigin()

```typescript               .AllowAnyMethod()

interface Payment {               .AllowAnyHeader();

  id: number;    });

  buyerId: number;});

  sellerId: number;```

  amount: number;

  method: string; // "BankTransfer" | "Cash" | "Online"### SSL Certificate Issues

  transferContent?: string;

  status: string; // "Pending" | "Completed" | "Failed"Nếu localhost HTTPS gặp vấn đề:

  createdAt: string;

  ```javascript

  // Relations// Temporary: Accept self-signed certificates

  buyer?: Member;// In axios.js

  seller?: Member;const api = axios.create({

  constructs?: Construct[];  baseURL: apiBaseURL,

  postPackageSubs?: PostPackageSub[];  httpsAgent: new https.Agent({

}    rejectUnauthorized: false,

```  }),

});

### Payment Endpoints```



#### 1. Get Payments By Buyer### Token Expiration

```javascript

GET /api/Payment/buyer/{buyerId}Token hết hạn sẽ tự động logout và redirect về `/login`.

````

---

#### 2. Get Payments By Seller

````javascript**Last Updated**: November 3, 2025

GET /api/Payment/seller/{sellerId}**API Version**: 1.0

```**Database**: EVehicleDB


#### 3. Update Payment Status
```javascript
PUT /api/Payment/{id}/status
Body: {
  status: string
}
````

#### 4. Process Payment

```javascript
POST / api / Payment / process / { id };
```

---

## 🏗️ Construct (Dịch Vụ Hỗ Trợ)

### Construct Endpoints

#### 1. Get Constructs By Type

```javascript
GET / api / Construct / type / { type };
```

#### 2. Search Constructs

```javascript
GET /api/Construct/search
Query Params:
  - name?: string
  - type?: string
  - address?: string
```

#### 3. Get Nearby Constructs

```javascript
GET /api/Construct/nearby
Query Params:
  - address: string
```

---

## 📊 Usage Examples

### Example 1: Display Products Page

```javascript
// ProductsPage.jsx
import { useState, useEffect } from "react";
import postService from "../../services/postService";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await postService.getPosts({
          pageNumber: 1,
          pageSize: 12,
        });

        // Transform API response
        const transformedProducts = response.map((post) => ({
          id: post.postId,
          name: post.title,
          price: post.price,
          brand: post.battery?.brand || post.vehicle?.brand,
          image: post.imageUrl || "default.jpg",
          seller: post.member?.fullName,
        }));

        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ... render products
};
```

### Example 2: Product Detail Page

```javascript
// ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import postService from "../../services/postService";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const post = await postService.getPostById(id);

        setProduct({
          id: post.postId,
          name: post.title,
          description: post.description,
          price: post.price,
          postType: post.postType,
          battery: post.battery,
          vehicle: post.vehicle,
          seller: post.member,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // ... render product detail
};
```

### Example 3: Create Post

```javascript
// CreatePostModal.jsx
import postService from "../../services/postService";

const handleSubmit = async (values) => {
  try {
    const postData = {
      memberId: currentUser.memberId,
      batteryId: values.batteryId || null,
      vehicleId: values.vehicleId || null,
      title: values.title,
      description: values.description,
      price: values.price,
      postType: values.postType, // "Direct" or "Staff-Assisted"
      transactionType: values.transactionType,
      contactInfo: values.contactInfo,
    };

    const newPost = await postService.createPost(postData);
    message.success("Đăng tin thành công!");
  } catch (error) {
    message.error("Đăng tin thất bại!");
  }
};
```

---

## 🔄 Data Transformation Tips

### 1. Check for Null Values

```javascript
const brand = post.battery?.brand || post.vehicle?.brand || "Unknown";
```

### 2. Handle Optional Relations

```javascript
if (post.battery) {
  // Battery post
  specs = {
    capacity: post.battery.capacityKWh,
    cycleCount: post.battery.cycleCount,
  };
} else if (post.vehicle) {
  // Vehicle post
  specs = {
    model: post.vehicle.model,
    mileage: post.vehicle.mileageKm,
  };
}
```

### 3. Format Dates

```javascript
const formattedDate = new Date(post.createdAt).toLocaleDateString("vi-VN");
```

### 4. Calculate Derived Values

```javascript
// Battery health from cycle count
const batteryHealth = post.battery?.cycleCount
  ? Math.max(100 - post.battery.cycleCount / 30, 50)
  : 90;

// Usage years
const usageYears = post.battery?.manufactureYear
  ? new Date().getFullYear() - post.battery.manufactureYear
  : 0;
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: 404 Not Found

**Cause**: Invalid ID or resource doesn't exist
**Solution**: Always check if ID exists before making request

### Issue 2: 400 Bad Request

**Cause**: Missing required fields or invalid data format
**Solution**: Validate data before sending, match schema exactly

### Issue 3: 401 Unauthorized

**Cause**: Missing or invalid JWT token
**Solution**: Check if user is logged in and token is valid

### Issue 4: Network Error

**Cause**: Server is down or CORS issue
**Solution**: Check server status and axios configuration

---

## 📚 Additional Resources

- **Swagger UI**: Access at `/swagger` on API server
- **Postman Collection**: Import OpenAPI spec to Postman
- **API Base URL**: Configure in `src/configs/axios.js`

---

## 🎯 Best Practices

1. **Always handle errors**

```javascript
try {
  const data = await service.getData();
} catch (error) {
  if (error.response?.status === 404) {
    message.error("Không tìm thấy dữ liệu");
  } else {
    message.error("Có lỗi xảy ra");
  }
}
```

2. **Use loading states**

```javascript
const [loading, setLoading] = useState(false);
setLoading(true);
// ... fetch data
setLoading(false);
```

3. **Validate before submit**

```javascript
if (!formData.title || !formData.price) {
  message.error("Vui lòng điền đầy đủ thông tin");
  return;
}
```

4. **Transform data consistently**

```javascript
// Create a transformation utility
const transformPost = (post) => ({
  id: post.postId,
  name: post.title,
  // ... consistent mapping
});
```

---

**Last Updated**: November 5, 2025
**API Version**: v1
**OpenAPI Spec**: 3.0.4
