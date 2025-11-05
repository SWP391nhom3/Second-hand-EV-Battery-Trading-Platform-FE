# API Update Checklist ✅

## Tổng Quan

API đã được cập nhật theo OpenAPI 3.0.4 spec mới. Checklist này giúp verify các thay đổi.

---

## 📋 Services Updated

### ✅ Post Service

- [x] `getPosts()` - Get all posts with filters
- [x] `getPostById()` - Get post by ID with full relations
- [x] `createPost()` - Create new post
- [x] `updatePost()` - Update post
- [x] `deletePost()` - Delete post
- [x] `getPostsByMember()` - Get posts by member
- [x] `assignStaff()` - Assign staff to post
- [x] `getFeaturedPosts()` - Get featured posts
- [x] `getDirectPosts()` - Get direct transaction posts
- [x] `getStaffAssistedPosts()` - Get staff-assisted posts

**New Fields in Post Schema**:

- `postType`: "Direct" | "Staff-Assisted"
- `transactionType`: Type of transaction
- `contactInfo`: Contact information
- `featured`: Boolean for featured posts
- `expiryDate`: Expiry date of post
- `status`: "Active" | "Inactive" | "Pending" | "Approved"

### ✅ Battery Service

- [x] `getBatteries()` - Get all batteries
- [x] `getBatteryById()` - Get battery by ID
- [x] `createBattery()` - Create new battery
- [x] `updateBattery()` - Update battery
- [x] `deleteBattery()` - Delete battery
- [x] `getBatteriesByMember()` - Get batteries by member
- [x] `searchBatteries()` - Search with filters (brand, capacity range)

**Battery Schema Fields**:

- `batteryId`: number
- `memberId`: number
- `brand`: string
- `capacityKWh`: number
- `cycleCount`: number
- `manufactureYear`: number
- `condition`: string
- `description`: string
- Relations: `member`, `posts[]`

### ✅ Vehicle Service

- [x] `getVehicles()` - Get all vehicles
- [x] `getVehicleById()` - Get vehicle by ID
- [x] `createVehicle()` - Create new vehicle
- [x] `updateVehicle()` - Update vehicle
- [x] `deleteVehicle()` - Delete vehicle

**Vehicle Schema Fields**:

- `id`: number
- `memberId`: number
- `brand`: string
- `model`: string
- `manufactureYear`: number
- `mileageKm`: number
- `batteryCapacity`: number
- `condition`: string
- `description`: string
- Relations: `member`, `posts[]`

### ✅ Member Service

- [x] `getMembers()` - Get all members
- [x] `getMemberById()` - Get member by ID
- [x] `createMember()` - Create new member
- [x] `updateMember()` - Update member
- [x] `deleteMember()` - Delete member
- [x] `getTopRatedMembers()` - Get top rated members

**Member Schema Fields**:

- `memberId`: number
- `accountId`: number
- `fullName`: string
- `avatarUrl`: string
- `address`: string
- `joinedAt`: date
- `rating`: number
- `status`: "Active" | "Inactive" | "Suspended"
- Relations: `account`, `vehicles[]`, `batteries[]`, `posts[]`, `payments[]`

### ✅ PostPackage Service

- [x] `getPackages()` - Get all packages
- [x] `getPackageById()` - Get package by ID
- [x] `createPackage()` - Create new package
- [x] `updatePackage()` - Update package
- [x] `deletePackage()` - Delete package
- [x] `getActivePackages()` - ⭐ NEW: Get active packages
- [x] `getPackageSubscriptions()` - Get package subscriptions
- [x] `subscribeToPackage()` - Subscribe to package
- [x] `getPackageStatistics()` - Get package statistics

### ✅ PostRequest Service

- [x] `getPostRequests()` - Get all post requests
- [x] `createPostRequest()` - Create new post request
- [x] `getPostRequestById()` - Get post request by ID
- [x] `updatePostRequest()` - Update post request
- [x] `deletePostRequest()` - Delete post request
- [x] `getRequestsByPost()` - Get requests for a post
- [x] `getRequestsByBuyer()` - Get requests by buyer
- [x] `getRequestsByStatus()` - Get requests by status
- [x] `updateRequestStatus()` - Update request status
- [x] `acceptRequest()` - Accept request
- [x] `rejectRequest()` - Reject request
- [x] `getRequestStatistics()` - Get request statistics
- [x] `getNegotiationsByPost()` - Get negotiations for a post

### ✅ Payment Service

- [x] `getPayments()` - Get all payments
- [x] `getPaymentById()` - Get payment by ID
- [x] `createPayment()` - Create new payment
- [x] `updatePayment()` - Update payment
- [x] `deletePayment()` - Delete payment
- [x] `getPaymentsByBuyer()` - Get payments by buyer
- [x] `getPaymentsBySeller()` - Get payments by seller
- [x] `getPaymentsByStatus()` - Get payments by status
- [x] `updatePaymentStatus()` - Update payment status
- [x] `getPaymentStatistics()` - Get payment statistics
- [x] `processPayment()` - Process payment

### ✅ Construct Service

- [x] `getConstructs()` - Get all constructs
- [x] `getConstructById()` - Get construct by ID
- [x] `createConstruct()` - Create new construct
- [x] `updateConstruct()` - Update construct
- [x] `deleteConstruct()` - Delete construct
- [x] `getConstructsByType()` - Get constructs by type
- [x] `getConstructsByStatus()` - Get constructs by status
- [x] `updateConstructStatus()` - Update construct status
- [x] `getConstructFees()` - Get construct fees
- [x] `addConstructFee()` - Add construct fee
- [x] `searchConstructs()` - Search constructs
- [x] `getConstructStatistics()` - Get construct statistics
- [x] `getNearbyConstructs()` - Get nearby constructs

### ✅ Auth Service

- [x] `register()` - Register new account
- [x] `login()` - Login
- [x] `changePassword()` - Change password
- [x] `forgotPassword()` - Forgot password

---

## 🔄 Components Updated

### ✅ ProductDetailPage.jsx

**Changes Made**:

- [x] Import `postService` from services
- [x] Add `loading` state with Spin component
- [x] Add `useEffect` to fetch product detail
- [x] Transform API response to component format
- [x] Handle both `battery` and `vehicle` products
- [x] Extract `member` information for seller
- [x] Handle `postType` (Direct vs Staff-Assisted)
- [x] Display `featured` badge
- [x] Show `contactInfo` if available
- [x] Handle `staff` information for staff-assisted posts
- [x] Calculate battery health from `cycleCount`
- [x] Calculate usage years from `manufactureYear`
- [x] Handle error cases (404, network error)
- [x] Display loading state
- [x] Navigate back if product not found

**New Data Mapping**:

```javascript
{
  // Post fields
  id: response.postId,
  name: response.title,
  price: response.price,
  description: response.description,
  postType: response.postType,
  transactionType: response.transactionType,
  contactInfo: response.contactInfo,
  status: response.status,
  featured: response.featured,

  // Battery/Vehicle fields
  brand: response.battery?.brand || response.vehicle?.brand,
  specifications: response.battery ? {...} : response.vehicle ? {...} : {},

  // Member fields
  seller: {
    id: response.member?.memberId,
    name: response.member?.fullName,
    avatar: response.member?.avatarUrl,
    address: response.member?.address,
    rating: response.member?.rating,
    status: response.member?.status,
  },

  // Staff fields (if applicable)
  staff: response.staff ? {...} : null,
}
```

### ✅ ProductsPage.jsx

**Changes Made**:

- [x] Import `postService` from services
- [x] Add API state management (`products`, `loading`, `total`)
- [x] Add `useEffect` to fetch products on mount and filter changes
- [x] Build API params from filters
- [x] Handle pagination (`pageNumber`, `pageSize`)
- [x] Handle sorting (`sortBy`, `sortOrder`)
- [x] Transform API response to component format
- [x] Handle different response structures (array, object, paginated)
- [x] Map `battery` and `vehicle` data correctly
- [x] Extract `member` information
- [x] Calculate `batteryHealth` from `cycleCount`
- [x] Calculate `usageYears` from `manufactureYear`
- [x] Format `postedDate` relative to now
- [x] Handle error cases with user-friendly messages
- [x] Display loading state

**New Data Transformation**:

```javascript
{
  // Determine if battery or vehicle
  isBattery: post.batteryId && post.battery,
  isVehicle: post.vehicleId && post.vehicle,

  // Map fields based on type
  brand: isBattery ? post.battery.brand : post.vehicle.brand,
  capacity: isBattery ? post.battery.capacityKWh : post.vehicle.batteryCapacity,
  condition: isBattery ? post.battery.condition : post.vehicle.condition,

  // Battery specific
  cycleCount: post.battery?.cycleCount,
  batteryHealth: calculated from cycleCount,

  // Vehicle specific
  model: post.vehicle?.model,
  mileageKm: post.vehicle?.mileageKm,

  // Member info
  seller: {
    name: post.member?.fullName,
    avatar: post.member?.avatarUrl,
    rating: post.member?.rating,
  },
}
```

---

## 🧪 Testing Checklist

### Manual Testing

#### ✅ Products Page

- [ ] Load products page → Should fetch from API
- [ ] Apply filters → Should re-fetch with filters
- [ ] Change sort order → Should re-sort
- [ ] Pagination → Should fetch next page
- [ ] Search → Should filter results
- [ ] Click product → Navigate to detail page

#### ✅ Product Detail Page

- [ ] Load product detail → Should fetch by ID
- [ ] Battery product → Should show battery specs
- [ ] Vehicle product → Should show vehicle specs
- [ ] Seller info → Should display member info
- [ ] Featured badge → Should show if `featured: true`
- [ ] Contact info → Should display if available
- [ ] Staff info → Should show for staff-assisted posts
- [ ] Invalid ID → Should show error and redirect

#### ⏳ Create Post (Pending)

- [ ] Fill form → Should validate fields
- [ ] Select battery → Should enable battery fields
- [ ] Select vehicle → Should enable vehicle fields
- [ ] Submit → Should create post via API
- [ ] Success → Should show success message
- [ ] Error → Should show error message

#### ⏳ Post Request (Pending)

- [ ] View product → Should show "Contact Seller" button
- [ ] Send request → Should create PostRequest
- [ ] Offer price → Should send `offerPrice`
- [ ] Message → Should send `message`
- [ ] View my requests → Should fetch by buyerId

---

## 🐛 Known Issues & Fixes

### Issue 1: Battery/Vehicle ID Confusion

**Problem**: Not checking which ID is present
**Fix**: Check `post.batteryId` and `post.vehicleId` first

```javascript
const isBattery = post.batteryId && post.battery;
const isVehicle = post.vehicleId && post.vehicle;
```

### Issue 2: Nested Data Missing

**Problem**: API might not return nested `member`, `battery`, or `vehicle`
**Fix**: Use optional chaining and defaults

```javascript
const brand = post.battery?.brand || post.vehicle?.brand || "Unknown";
```

### Issue 3: Response Structure Varies

**Problem**: API might return array or object with pagination
**Fix**: Handle multiple response structures

```javascript
if (Array.isArray(response)) {
  postsData = response;
} else if (response?.data) {
  postsData = response.data;
}
```

---

## 📝 Next Steps

### High Priority

1. [ ] Test ProductDetailPage with real API
2. [ ] Test ProductsPage with real API
3. [ ] Update CreatePostModal to use new schema
4. [ ] Implement PostRequest functionality
5. [ ] Add image upload for posts

### Medium Priority

6. [ ] Implement package subscription
7. [ ] Add payment processing
8. [ ] Implement construct services
9. [ ] Add reviews/ratings
10. [ ] Implement notifications

### Low Priority

11. [ ] Optimize performance
12. [ ] Add more filters
13. [ ] Improve error handling
14. [ ] Add analytics tracking
15. [ ] Write unit tests

---

## 📚 Documentation

- [x] API Integration Guide created
- [x] Update checklist created
- [ ] Component documentation
- [ ] Service documentation
- [ ] Testing guide

---

## 🎯 Testing URLs

### Development

- **API Base**: `http://localhost:5000` (update in axios.js)
- **Frontend**: `http://localhost:5174`
- **Swagger**: `http://localhost:5000/swagger`

### Test Cases

```bash
# Test products endpoint
GET http://localhost:5000/api/Post

# Test product detail
GET http://localhost:5000/api/Post/1

# Test featured posts
GET http://localhost:5000/api/Post/featured

# Test search
GET http://localhost:5000/api/Post?search=tesla

# Test filters
GET http://localhost:5000/api/Post?minPrice=100000000&maxPrice=300000000
```

---

## ✅ Verification Steps

1. **Check Services**

   ```bash
   # Verify all service files exist
   ls src/services/
   ```

2. **Check API Config**

   ```javascript
   // src/configs/axios.js
   baseURL: "http://localhost:5000"; // or your API URL
   ```

3. **Test API Connection**

   - Open browser console
   - Load products page
   - Check for API calls in Network tab
   - Verify response structure

4. **Verify Data Transformation**

   - Check console logs for transformed data
   - Verify all fields are mapped correctly
   - Check for null/undefined values

5. **Test Error Handling**
   - Disconnect network → Should show error
   - Invalid ID → Should handle 404
   - Server error → Should show friendly message

---

**Status**: ✅ Services Updated | ⏳ Components Testing | 📝 Documentation Complete

**Last Updated**: November 5, 2025
