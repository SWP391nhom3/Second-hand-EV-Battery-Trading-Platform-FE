# API Quick Reference Guide

**Quick lookup for all available API methods**

## 🔐 Authentication (`authService`)

| Method                         | Description                        |
| ------------------------------ | ---------------------------------- |
| `register(data)`               | Register new customer              |
| `login(credentials)`           | Customer login                     |
| `staffLogin(credentials)`      | Staff/Admin login                  |
| `changePassword(data)`         | Change password                    |
| `forgotPassword(email)`        | Request password reset             |
| `verifyOTP(data)`              | Verify OTP code                    |
| `createAdmin(data)`            | Create admin account               |
| `createStaff(data)`            | Create staff account               |
| `googleAuthStart()`            | Start Google OAuth                 |
| `googleRegisterComplete(data)` | Complete Google registration       |
| `googleLoginOTP(data)`         | Request OTP for Google login       |
| `logout()`                     | Logout user                        |
| `getCurrentUser()`             | Get current user from localStorage |
| `getAccessToken()`             | Get access token                   |
| `isAuthenticated()`            | Check if authenticated             |
| `hasRole(roleName)`            | Check if user has role             |
| `isAdmin()`                    | Check if user is admin             |
| `isStaff()`                    | Check if user is staff             |
| `isCustomer()`                 | Check if user is customer          |

---

## 📝 Posts (`postService`)

| Method                         | Description                  |
| ------------------------------ | ---------------------------- |
| `getPosts(params)`             | Get all posts with filters   |
| `createPost(postData)`         | Create new post              |
| `getPostById(id)`              | Get post by ID               |
| `updatePost(id, postData)`     | Update post                  |
| `deletePost(id)`               | Delete post                  |
| `getPostsByMember(memberId)`   | Get member's posts           |
| `getFeaturedPosts()`           | Get featured posts           |
| `getDirectPosts()`             | Get direct transaction posts |
| `getStaffAssistedPosts()`      | Get staff-assisted posts     |
| `getCheckoutUrl(postId)`       | Get checkout URL for post    |
| `assignStaff(postId, staffId)` | Assign staff to post         |
| **Admin Methods**              |                              |
| `getAdminAllPosts(params)`     | Get all posts (admin view)   |
| `getAdminPendingPosts()`       | Get pending posts            |
| `approvePost(id, packageId)`   | Approve post                 |
| `rejectPost(id, reason)`       | Reject post                  |

---

## 💬 Post Requests (`postRequestService`)

| Method                           | Description             |
| -------------------------------- | ----------------------- |
| `getPostRequests(params)`        | Get all post requests   |
| `createPostRequest(requestData)` | Create buyer inquiry    |
| `getPostRequestById(id)`         | Get request by ID       |
| `updatePostRequest(id, data)`    | Update request          |
| `deletePostRequest(id)`          | Delete request          |
| `getRequestsByPost(postId)`      | Get requests for post   |
| `getRequestsByBuyer(buyerId)`    | Get buyer's requests    |
| `getRequestsByStatus(status)`    | Get requests by status  |
| `getNegotiationsByPost(postId)`  | Get negotiation history |
| `getRequestStatistics()`         | Get statistics (admin)  |
| `updateRequestStatus(id, data)`  | Update request status   |
| `acceptRequest(id)`              | Accept request (seller) |
| `rejectRequest(id)`              | Reject request (seller) |

---

## 📦 Packages (`packageService`)

| Method                                | Description               |
| ------------------------------------- | ------------------------- |
| `getPackages(params)`                 | Get all packages          |
| `createPackage(packageData)`          | Create package (admin)    |
| `getPackageById(id)`                  | Get package by ID         |
| `updatePackage(id, data)`             | Update package (admin)    |
| `deletePackage(id)`                   | Delete package (admin)    |
| `getActivePackages()`                 | Get active packages       |
| `getPackageSubscriptions(id)`         | Get package subscriptions |
| `getPackageStatistics()`              | Get statistics (admin)    |
| `subscribeToPackage(packageId, data)` | Subscribe to package      |

---

## 💳 Payments (`paymentService`)

| Method                          | Description                 |
| ------------------------------- | --------------------------- |
| `getPayments(params)`           | Get all payments            |
| `createPayment(paymentData)`    | Create payment              |
| `getPaymentById(id)`            | Get payment by ID           |
| `updatePayment(id, data)`       | Update payment              |
| `deletePayment(id)`             | Delete payment              |
| `getPaymentsByBuyer(buyerId)`   | Get buyer's payments        |
| `getPaymentsBySeller(sellerId)` | Get seller's payments       |
| `getPaymentsByStatus(status)`   | Get payments by status      |
| `getPaymentStatistics()`        | Get statistics (admin)      |
| `updatePaymentStatus(id, data)` | Update payment status       |
| `processPaymentById(id)`        | Process payment             |
| **Checkout Methods**            |                             |
| `createCheckout(checkoutData)`  | Create checkout session     |
| `openCheckout(checkoutUrl)`     | Open checkout in new window |
| `handleWebhook(webhookData)`    | Handle payment webhook      |
| `testWebhook(testData)`         | Test webhook (dev only)     |

---

## 🔋 Battery Models (`batteryModelService`)

| Method                              | Description                     |
| ----------------------------------- | ------------------------------- |
| `getBatteryModels(params)`          | Get battery models with filters |
| `getBatteryModelById(id)`           | Get battery model by ID         |
| `searchBatteryModels(params)`       | Search battery models           |
| `getAllFilters()`                   | Get available filters           |
| `createCustomBatteryModel(data)`    | Create custom model             |
| `uploadBatteryModelImage(id, file)` | Upload model image              |

**Available Filters:**

- `brand` - Filter by brand
- `chemistry` - Filter by chemistry type
- `minVoltage`, `maxVoltage` - Voltage range
- `minCapacityKWh`, `maxCapacityKWh` - Capacity range
- `minAmperage`, `maxAmperage` - Amperage range
- `formFactor` - Form factor filter
- `minCycles`, `maxCycles` - Cycle count range
- `isCustom` - Filter custom models
- `isApproved` - Filter approved models
- `page`, `pageSize` - Pagination

---

## 🚗 Vehicle Models (`vehicleModelService`)

| Method                              | Description                     |
| ----------------------------------- | ------------------------------- |
| `getVehicleModels(params)`          | Get vehicle models with filters |
| `getVehicleModelById(id)`           | Get vehicle model by ID         |
| `searchVehicleModels(params)`       | Search vehicle models           |
| `getAllFilters()`                   | Get available filters           |
| `createCustomVehicleModel(data)`    | Create custom model             |
| `uploadVehicleModelImage(id, file)` | Upload model image              |

**Available Filters:**

- `brand` - Filter by brand
- `year` - Filter by year
- `type` - Filter by vehicle type
- `minMotorPower`, `maxMotorPower` - Motor power range
- `minRange`, `maxRange` - Range in km
- `minSeats`, `maxSeats` - Number of seats
- `isCustom` - Filter custom models
- `isApproved` - Filter approved models
- `page`, `pageSize` - Pagination

---

## 🔋 Batteries (`batteryService`)

| Method                           | Description            |
| -------------------------------- | ---------------------- |
| `getBatteries(params)`           | Get all batteries      |
| `createBattery(batteryData)`     | Create battery         |
| `getBatteryById(id)`             | Get battery by ID      |
| `updateBattery(id, data)`        | Update battery         |
| `deleteBattery(id)`              | Delete battery         |
| `getBatteriesByMember(memberId)` | Get member's batteries |
| `searchBatteries(params)`        | Search batteries       |

---

## 🚗 Vehicles (`vehicleService`)

| Method                       | Description       |
| ---------------------------- | ----------------- |
| `getVehicles(params)`        | Get all vehicles  |
| `createVehicle(vehicleData)` | Create vehicle    |
| `getVehicleById(id)`         | Get vehicle by ID |
| `updateVehicle(id, data)`    | Update vehicle    |
| `deleteVehicle(id)`          | Delete vehicle    |

---

## 👤 Members (`memberService`)

| Method                             | Description                   |
| ---------------------------------- | ----------------------------- |
| `getMembers(params)`               | Get all members               |
| `createMember(memberData)`         | Create member                 |
| `getMemberById(id)`                | Get member by ID              |
| `updateMember(id, data)`           | Update member                 |
| `deleteMember(id)`                 | Delete member (admin)         |
| `getTopRatedMembers(limit)`        | Get top-rated members         |
| `getCurrentMemberProfile()`        | Get current user's profile    |
| `updateCurrentMemberProfile(data)` | Update current user's profile |

---

## 🏗️ Constructs (`constructService`)

| Method                            | Description                   |
| --------------------------------- | ----------------------------- |
| `getConstructs(params)`           | Get all constructs/facilities |
| `createConstruct(constructData)`  | Create construct              |
| `getConstructById(id)`            | Get construct by ID           |
| `updateConstruct(id, data)`       | Update construct              |
| `deleteConstruct(id)`             | Delete construct              |
| `getConstructsByType(type)`       | Get by type                   |
| `getConstructsByStatus(status)`   | Get by status                 |
| `updateConstructStatus(id, data)` | Update status                 |
| `getConstructFees(id)`            | Get construct fees            |
| `addConstructFee(id, feeData)`    | Add fee                       |
| `searchConstructs(params)`        | Search constructs             |
| `getConstructStatistics()`        | Get statistics                |
| `getNearbyConstructs(address)`    | Get nearby facilities         |

---

## 📊 Constants & Enums

Import from `@/constants/apiConstants`:

```javascript
// Post Status
POST_STATUS.ACTIVE, PENDING, APPROVED, REJECTED, SOLD, EXPIRED

// Post Types
POST_TYPE.BATTERY, VEHICLE, BOTH

// Transaction Types
TRANSACTION_TYPE.DIRECT, STAFF_ASSISTED

// Payment Status
PAYMENT_STATUS.PENDING, COMPLETED, FAILED, CANCELLED, REFUNDED

// Payment Methods
PAYMENT_METHOD.BANK_TRANSFER, MOMO, VNPAY, CASH

// Post Request Status
POST_REQUEST_STATUS.PENDING, ACCEPTED, REJECTED, CANCELLED, COMPLETED

// Member Status
MEMBER_STATUS.ACTIVE, INACTIVE, SUSPENDED, BANNED

// Roles
ROLE.ADMIN, STAFF, CUSTOMER, MEMBER

// Construct Types
CONSTRUCT_TYPE.INSPECTION, REPAIR, MAINTENANCE, INSTALLATION

// Construct Status
CONSTRUCT_STATUS.PENDING, IN_PROGRESS, COMPLETED, CANCELLED

// Conditions
BATTERY_CONDITION.EXCELLENT, GOOD, FAIR, POOR, NEW, USED
VEHICLE_CONDITION.EXCELLENT, GOOD, FAIR, POOR, NEW, LIKE_NEW, USED

// Battery Chemistry
BATTERY_CHEMISTRY.LITHIUM_ION, LITHIUM_POLYMER, etc.

// Vehicle Types
VEHICLE_TYPE.MOTORCYCLE, SCOOTER, BICYCLE, CAR, TRUCK, BUS

// OTP Purpose
OTP_PURPOSE.EMAIL_VERIFICATION, PASSWORD_RESET, TWO_FACTOR_AUTH, GOOGLE_LOGIN

// Subscription Status
SUBSCRIPTION_STATUS.ACTIVE, EXPIRED, CANCELLED

// API Endpoints
API_ENDPOINTS.AUTH.*, POST.*, PAYMENT.*, etc.
```

---

## 🚀 Common Usage Patterns

### Authentication Flow

```javascript
// Login
await authService.login({ email, password });

// Check auth
if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser();
}

// Logout
authService.logout();
```

### Create Post

```javascript
const post = await postService.createPost({
  memberId,
  title,
  description,
  price,
  postType: "Battery",
  battery: {
    /* battery data */
  },
});
```

### Browse & Filter

```javascript
const posts = await postService.getPosts({
  page: 1,
  pageSize: 20,
  status: "Active",
  postType: "Battery",
});
```

### Buyer Inquiry

```javascript
const request = await postRequestService.createPostRequest({
  postId,
  buyerId,
  message,
  offerPrice,
});
```

### Package Checkout

```javascript
const checkout = await paymentService.createCheckout({
  postId,
  packageId,
});
paymentService.openCheckout(checkout.checkoutUrl);
```

### Admin Approval

```javascript
await postService.approvePost(postId, packageId);
// or
await postService.rejectPost(postId, reason);
```

---

## 📌 Error Handling

```javascript
try {
  const result = await service.method();
} catch (error) {
  if (error.response) {
    // Server error
    console.error(error.response.status);
    console.error(error.response.data);
  } else if (error.request) {
    // Network error
    console.error("Network error");
  } else {
    // Other error
    console.error(error.message);
  }
}
```

---

## 📖 Full Documentation

See **API_INTEGRATION_COMPLETE.md** for:

- Detailed method descriptions
- Complete code examples
- Workflow guides
- Best practices
