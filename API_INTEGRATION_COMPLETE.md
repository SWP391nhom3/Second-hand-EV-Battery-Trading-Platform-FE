# API Integration Documentation

**Last Updated:** November 7, 2025  
**API Version:** v1  
**Base URL:** `https://localhost:7294/api` (configured in axios.js)

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Service Modules](#service-modules)
- [Constants & Enums](#constants--enums)
- [Common Patterns](#common-patterns)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

---

## Overview

This project now has **complete integration** with the backend API. All endpoints from the OpenAPI specification have been implemented and organized into service modules.

### Service Files Structure

```
src/
├── configs/
│   └── axios.js              # Axios configuration with interceptors
├── constants/
│   └── apiConstants.js       # All API endpoints & enums
└── services/
    ├── authService.js        # Authentication & authorization
    ├── postService.js        # Post management
    ├── postRequestService.js # Post inquiries/negotiations
    ├── packageService.js     # Post packages/subscriptions
    ├── paymentService.js     # Payments & checkout
    ├── batteryService.js     # Battery management
    ├── batteryModelService.js# Battery models & filters
    ├── vehicleService.js     # Vehicle management
    ├── vehicleModelService.js# Vehicle models & filters
    ├── memberService.js      # Member profiles
    ├── constructService.js   # Facility management
    └── index.js              # Service exports
```

---

## Authentication

### Auth Service (`authService.js`)

#### Customer Authentication

```javascript
import authService from "@/services/authService";

// Register new customer
const registerData = {
  email: "user@example.com",
  password: "SecurePassword123",
  fullName: "John Doe",
};
const result = await authService.register(registerData);

// Login
const credentials = {
  email: "user@example.com",
  password: "SecurePassword123",
};
const response = await authService.login(credentials);
// Token & user data automatically stored in localStorage

// Check authentication status
if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser();
  console.log("Logged in as:", user.fullName);
}

// Logout
authService.logout();
```

#### Staff/Admin Authentication

```javascript
// Staff login (separate endpoint)
await authService.staffLogin({
  email: "staff@example.com",
  password: "StaffPassword123",
});

// Admin creates staff account
await authService.createStaff({
  email: "newstaff@example.com",
  password: "TempPassword123",
  phone: "0123456789",
});
```

#### Google OAuth Flow

```javascript
// Step 1: Redirect to Google
authService.googleAuthStart();

// Step 2: After callback, complete registration (if new user)
await authService.googleRegisterComplete({
  pendingToken: "token_from_callback",
  fullName: "John Doe",
  password: "SecurePassword123",
});

// OR: Request OTP for existing user
await authService.googleLoginOTP({
  email: "user@example.com",
});

// Step 3: Verify OTP
await authService.verifyOTP({
  email: "user@example.com",
  code: "123456",
  purpose: "GoogleLogin",
});
```

#### Password Management

```javascript
// Change password
await authService.changePassword({
  accountId: 1,
  oldPassword: "OldPassword123",
  newPassword: "NewPassword123",
});

// Forgot password (sends OTP)
await authService.forgotPassword("user@example.com");

// Verify OTP and reset
await authService.verifyOTP({
  email: "user@example.com",
  code: "123456",
  purpose: "PasswordReset",
});
```

#### Role Checking

```javascript
// Check user role
if (authService.isAdmin()) {
  // Show admin features
}

if (authService.isStaff()) {
  // Show staff features
}

if (authService.isCustomer()) {
  // Show customer features
}
```

---

## Service Modules

### 1. Post Service (`postService.js`)

#### Basic Post Operations

```javascript
import postService from "@/services/postService";

// Create new post
const postData = {
  memberId: 1,
  title: "Tesla Model 3 Battery Pack",
  description: "Excellent condition, 500 cycles",
  price: 15000000,
  postType: "Battery",
  batteryId: 10,
  // OR create new battery inline:
  battery: {
    memberId: 1,
    batteryModelId: 5,
    capacityKWh: 75,
    cycleCount: 500,
    manufactureYear: 2020,
    condition: "Excellent",
    description: "Well maintained",
  },
};
const newPost = await postService.createPost(postData);

// Get all posts with filters
const posts = await postService.getPosts({
  page: 1,
  pageSize: 20,
  status: "Active",
  postType: "Battery",
  transactionType: "DIRECT",
});

// Get post details
const post = await postService.getPostById(1);

// Update post
await postService.updatePost(1, {
  price: 14000000,
  description: "Updated description",
});

// Delete post
await postService.deletePost(1);
```

#### Query Posts

```javascript
// Get member's posts
const myPosts = await postService.getPostsByMember(memberId);

// Get featured posts
const featured = await postService.getFeaturedPosts();

// Get direct transaction posts
const directPosts = await postService.getDirectPosts();

// Get staff-assisted posts
const assistedPosts = await postService.getStaffAssistedPosts();

// Get checkout URL for package purchase
const checkoutData = await postService.getCheckoutUrl(postId);
```

#### Staff Operations

```javascript
// Assign staff to post
await postService.assignStaff(postId, staffId);
```

#### Admin Operations

```javascript
// Get all posts with status filter
const allPosts = await postService.getAdminAllPosts({ status: "PENDING" });

// Get pending posts
const pending = await postService.getAdminPendingPosts();

// Approve post
await postService.approvePost(postId, packageId); // packageId optional

// Reject post
await postService.rejectPost(postId, "Reason for rejection");
```

---

### 2. Post Request Service (`postRequestService.js`)

Handles buyer inquiries and negotiations.

```javascript
import postRequestService from "@/services/postRequestService";

// Create inquiry
const request = await postRequestService.createPostRequest({
  postId: 1,
  buyerId: 2,
  message: "Is the battery still available?",
  offerPrice: 13000000,
  constructId: null, // Optional facility
});

// Get requests for a post
const requests = await postRequestService.getRequestsByPost(postId);

// Get buyer's requests
const myRequests = await postRequestService.getRequestsByBuyer(buyerId);

// Seller accepts request
await postRequestService.acceptRequest(requestId);

// Seller rejects request
await postRequestService.rejectRequest(requestId);

// Get negotiation history
const negotiations = await postRequestService.getNegotiationsByPost(postId);

// Get statistics
const stats = await postRequestService.getRequestStatistics();
```

---

### 3. Package Service (`packageService.js`)

Manages post packages and subscriptions.

```javascript
import packageService from "@/services/packageService";

// Get active packages
const packages = await packageService.getActivePackages();

// Get package details
const pkg = await packageService.getPackageById(1);

// Subscribe to package
await packageService.subscribeToPackage(packageId, {
  postId: 10, // Optional
  memberId: 1,
  paymentId: 5,
});

// Get package statistics (admin)
const stats = await packageService.getPackageStatistics();

// Admin: Create package
await packageService.createPackage({
  name: "Premium Package",
  durationDay: 30,
  price: 500000,
  priorityLevel: 1,
  description: "Featured listing for 30 days",
});
```

---

### 4. Payment Service (`paymentService.js`)

Handles payments and checkout.

```javascript
import paymentService from "@/services/paymentService";

// Create checkout session
const checkout = await paymentService.createCheckout({
  postId: 1,
  packageId: 2,
});

// Open checkout in new window
paymentService.openCheckout(checkout.checkoutUrl);

// Get payment by ID
const payment = await paymentService.getPaymentById(paymentId);

// Get buyer's payments
const myPayments = await paymentService.getPaymentsByBuyer(buyerId);

// Get payments by status
const pending = await paymentService.getPaymentsByStatus("Pending");

// Update payment status (staff)
await paymentService.updatePaymentStatus(paymentId, {
  status: "Completed",
});

// Get payment statistics (admin)
const stats = await paymentService.getPaymentStatistics();
```

---

### 5. Battery Model Service (`batteryModelService.js`)

```javascript
import batteryModelService from "@/services/batteryModelService";

// Get battery models with filters
const models = await batteryModelService.getBatteryModels({
  brand: "Tesla",
  chemistry: "Lithium-Ion",
  minCapacityKWh: 50,
  maxCapacityKWh: 100,
  isApproved: true,
  page: 1,
  pageSize: 20,
});

// Search battery models
const results = await batteryModelService.searchBatteryModels({
  q: "Tesla 75kWh",
  limit: 10,
});

// Get available filters
const filters = await batteryModelService.getAllFilters();
// Returns: { brands: [...], chemistries: [...], formFactors: [...] }

// Create custom battery model
const customModel = await batteryModelService.createCustomBatteryModel({
  name: "Custom Pack",
  brand: "Generic",
  chemistry: "Lithium-Ion",
  voltage: 400,
  capacityKWh: 80,
  amperage: 200,
  formFactor: "Prismatic",
  description: "Custom battery pack",
});

// Upload model image
await batteryModelService.uploadBatteryModelImage(modelId, imageFile);
```

---

### 6. Vehicle Model Service (`vehicleModelService.js`)

```javascript
import vehicleModelService from "@/services/vehicleModelService";

// Get vehicle models with filters
const models = await vehicleModelService.getVehicleModels({
  brand: "VinFast",
  type: "Car",
  year: 2023,
  minRange: 300,
  maxRange: 500,
  isApproved: true,
  page: 1,
  pageSize: 20,
});

// Search vehicle models
const results = await vehicleModelService.searchVehicleModels({
  q: "VinFast VF8",
  limit: 10,
});

// Get available filters
const filters = await vehicleModelService.getAllFilters();

// Create custom vehicle model
const customModel = await vehicleModelService.createCustomVehicleModel({
  name: "Custom EV",
  brand: "Generic",
  year: 2024,
  type: "Motorcycle",
  motorPower: 5,
  range: 100,
  seats: 2,
});

// Upload model image
await vehicleModelService.uploadVehicleModelImage(modelId, imageFile);
```

---

### 7. Member Service (`memberService.js`)

```javascript
import memberService from "@/services/memberService";

// Get top-rated members
const topMembers = await memberService.getTopRatedMembers(10);

// Get member profile
const member = await memberService.getMemberById(memberId);

// Get current user's profile
const myProfile = await memberService.getCurrentMemberProfile();

// Update profile
await memberService.updateMember(memberId, {
  fullName: "John Smith",
  address: "123 Main St, Hanoi",
  avatarUrl: "https://example.com/avatar.jpg",
});

// Update current user's profile
await memberService.updateCurrentMemberProfile({
  fullName: "Jane Doe",
  address: "New address",
});
```

---

## Constants & Enums

All constants are defined in `src/constants/apiConstants.js`:

### Post Status

```javascript
import { POST_STATUS } from "@/constants/apiConstants";

POST_STATUS.ACTIVE; // "Active"
POST_STATUS.PENDING; // "Pending"
POST_STATUS.APPROVED; // "Approved"
POST_STATUS.REJECTED; // "Rejected"
POST_STATUS.SOLD; // "Sold"
POST_STATUS.EXPIRED; // "Expired"
```

### Transaction Types

```javascript
import { TRANSACTION_TYPE } from "@/constants/apiConstants";

TRANSACTION_TYPE.DIRECT; // "DIRECT"
TRANSACTION_TYPE.STAFF_ASSISTED; // "STAFF_ASSISTED"
```

### Payment Status

```javascript
import { PAYMENT_STATUS } from "@/constants/apiConstants";

PAYMENT_STATUS.PENDING; // "Pending"
PAYMENT_STATUS.COMPLETED; // "Completed"
PAYMENT_STATUS.FAILED; // "Failed"
PAYMENT_STATUS.CANCELLED; // "Cancelled"
PAYMENT_STATUS.REFUNDED; // "Refunded"
```

### API Endpoints

```javascript
import { API_ENDPOINTS } from "@/constants/apiConstants";

// Example usage:
api.get(API_ENDPOINTS.POST.FEATURED);
api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
api.get(API_ENDPOINTS.POST.BY_ID(123));
```

---

## Common Patterns

### Pagination

Most list endpoints support pagination:

```javascript
const result = await postService.getPosts({
  page: 1,
  pageSize: 20,
});

console.log(result.data); // Array of items
console.log(result.totalCount); // Total items
console.log(result.totalPages); // Total pages
```

### Filtering

```javascript
// Multiple filters
const posts = await postService.getPosts({
  status: "Active",
  postType: "Battery",
  transactionType: "DIRECT",
  minPrice: 1000000,
  maxPrice: 20000000,
});
```

### Search

```javascript
// Quick search
const results = await batteryModelService.searchBatteryModels({
  q: "Tesla",
  limit: 10,
});
```

---

## Error Handling

All services use axios which is configured with interceptors in `configs/axios.js`.

```javascript
try {
  const post = await postService.getPostById(999);
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error("Status:", error.response.status);
    console.error("Data:", error.response.data);

    if (error.response.status === 401) {
      // Redirect to login
      authService.logout();
      router.push("/login");
    } else if (error.response.status === 404) {
      // Handle not found
      showNotFound();
    }
  } else if (error.request) {
    // Request made but no response
    console.error("Network error");
  } else {
    // Other errors
    console.error("Error:", error.message);
  }
}
```

---

## Usage Examples

### Complete Post Creation Flow

```javascript
// 1. Get available battery models
const models = await batteryModelService.getBatteryModels({
  isApproved: true,
});

// 2. Create post with existing battery model
const post = await postService.createPost({
  memberId: currentUser.memberId,
  title: "High Quality EV Battery",
  description: "Excellent condition, low cycles",
  price: 15000000,
  postType: "Battery",
  battery: {
    memberId: currentUser.memberId,
    batteryModelId: selectedModel.id,
    capacityKWh: 75,
    cycleCount: 300,
    manufactureYear: 2021,
    condition: "Excellent",
    description: "Regularly maintained",
  },
});

// 3. Subscribe to a package
const packages = await packageService.getActivePackages();
const selectedPackage = packages[0];

// 4. Create checkout
const checkout = await paymentService.createCheckout({
  postId: post.postId,
  packageId: selectedPackage.packageId,
});

// 5. Open payment page
paymentService.openCheckout(checkout.checkoutUrl);
```

### Admin Approval Workflow

```javascript
// 1. Get pending posts
const pendingPosts = await postService.getAdminPendingPosts();

// 2. Review post details
const post = await postService.getPostById(pendingPosts[0].postId);

// 3. Get available packages
const packages = await packageService.getActivePackages();

// 4. Approve with package
await postService.approvePost(post.postId, packages[0].packageId);

// OR reject
await postService.rejectPost(post.postId, "Invalid information");
```

### Buyer Inquiry Flow

```javascript
// 1. Browse posts
const posts = await postService.getFeaturedPosts();

// 2. View post details
const post = await postService.getPostById(selectedPost.postId);

// 3. Create inquiry
const request = await postRequestService.createPostRequest({
  postId: post.postId,
  buyerId: currentUser.memberId,
  message: "Is this still available? Can you provide more details?",
  offerPrice: post.price * 0.9, // Offer 10% less
});

// 4. Check request status
const myRequests = await postRequestService.getRequestsByBuyer(
  currentUser.memberId
);
```

---

## Testing the API

You can use the test file to verify API connectivity:

```bash
node test-api.js
```

Or test individual endpoints in your browser console:

```javascript
// Test auth
const result = await authService.login({
  email: "test@example.com",
  password: "password",
});
console.log("Login successful:", result);

// Test posts
const posts = await postService.getFeaturedPosts();
console.log("Featured posts:", posts);
```

---

## Summary

✅ **All services updated** with API_ENDPOINTS constants  
✅ **Full JSDoc documentation** for all methods  
✅ **Complete authentication flow** with Google OAuth & OTP  
✅ **Admin operations** for post approval/rejection  
✅ **Image upload support** for models  
✅ **Comprehensive error handling** patterns  
✅ **Real-world usage examples** provided

The frontend is now **100% integrated** with the backend API!
