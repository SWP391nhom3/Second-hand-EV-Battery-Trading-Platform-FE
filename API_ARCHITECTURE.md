# API Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend React App                          │
│                    (Second-hand EV Battery Platform)                │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
                    ┌─────────────▼─────────────┐
                    │   React Router (Routes)   │
                    │  - /login, /register      │
                    │  - /products, /customer   │
                    │  - /staff, /admin         │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │    React Components       │
                    │  - LoginForm              │
                    │  - ProductsPage           │
                    │  - CustomerDashboard      │
                    │  - StaffDashboard         │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │     API Services Layer    │
                    │                           │
                    │  ┌─────────────────────┐ │
                    │  │   authService       │ │
                    │  │   postService       │ │
                    │  │   batteryService    │ │
                    │  │   vehicleService    │ │
                    │  │   paymentService    │ │
                    │  │   packageService    │ │
                    │  │   memberService     │ │
                    │  │   constructService  │ │
                    │  └─────────────────────┘ │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Axios Instance          │
                    │   (configs/axios.js)      │
                    │                           │
                    │  - Base URL Config        │
                    │  - Request Interceptor    │
                    │    (Add JWT Token)        │
                    │  - Response Interceptor   │
                    │    (Handle Errors)        │
                    └─────────────┬─────────────┘
                                  │
                                  │ HTTPS
                                  │
                    ┌─────────────▼─────────────┐
                    │   EVehicleManagementAPI   │
                    │   https://localhost:59212 │
                    │                           │
                    │  ┌─────────────────────┐ │
                    │  │  /api/Auth/*        │ │
                    │  │  /api/Post/*        │ │
                    │  │  /api/Battery/*     │ │
                    │  │  /api/Vehicle/*     │ │
                    │  │  /api/Payment/*     │ │
                    │  │  /api/PostPackage/* │ │
                    │  │  /api/Member/*      │ │
                    │  │  /api/Construct/*   │ │
                    │  └─────────────────────┘ │
                    └─────────────┬─────────────┘
                                  │
                                  │
                    ┌─────────────▼─────────────┐
                    │   SQL Server Database     │
                    │        EVehicleDB         │
                    │                           │
                    │  ┌─────────────────────┐ │
                    │  │  Accounts           │ │
                    │  │  Members            │ │
                    │  │  Posts              │ │
                    │  │  Batteries          │ │
                    │  │  Vehicles           │ │
                    │  │  Payments           │ │
                    │  │  PostPackages       │ │
                    │  │  PostRequests       │ │
                    │  │  Constructs         │ │
                    │  └─────────────────────┘ │
                    └───────────────────────────┘
```

## Authentication Flow

```
┌──────────┐                                   ┌──────────┐
│  User    │                                   │  API     │
└────┬─────┘                                   └────┬─────┘
     │                                              │
     │  1. Enter email & password                  │
     ├──────────────────────────────────────►      │
     │     LoginForm                               │
     │                                              │
     │  2. authService.login(credentials)          │
     ├──────────────────────────────────────►      │
     │                                              │
     │  3. POST /api/Auth/login                    │
     │     + email, password                        │
     ├──────────────────────────────────────►      │
     │                                              │
     │                                         4. Validate
     │                                              │
     │  5. { token, user }                         │
     │     ◄──────────────────────────────────────┤
     │                                              │
     │  6. Save to localStorage                    │
     │     - token → "accessToken"                 │
     │     - user → "user"                         │
     │                                              │
     │  7. Navigate to dashboard                   │
     │     based on role                           │
     │                                              │
     │  8. Subsequent requests                     │
     │     Authorization: Bearer {token}           │
     ├──────────────────────────────────────►      │
     │                                              │
```

## Request Flow with Interceptors

```
┌──────────────┐
│  Component   │
└──────┬───────┘
       │
       │ 1. Call service method
       │    postService.getPosts()
       ▼
┌──────────────┐
│   Service    │
└──────┬───────┘
       │
       │ 2. axios.get('/api/Post')
       ▼
┌───────────────────────────────┐
│  Request Interceptor          │
│  - Add Authorization header   │
│  - Bearer {token}             │
└──────┬────────────────────────┘
       │
       │ 3. HTTP Request
       ▼
┌──────────────┐
│   API        │
└──────┬───────┘
       │
       │ 4. HTTP Response
       ▼
┌───────────────────────────────┐
│  Response Interceptor         │
│  - Check status code          │
│  - Handle 401 → logout        │
│  - Handle 403, 404, 500       │
└──────┬────────────────────────┘
       │
       │ 5. Return data or throw error
       ▼
┌──────────────┐
│   Service    │
└──────┬───────┘
       │
       │ 6. Return to component
       ▼
┌──────────────┐
│  Component   │
│  - Update UI │
└──────────────┘
```

## Service Layer Structure

```
src/services/
│
├── index.js ─────────────────► Central export point
│
├── authService.js ───────────► Authentication
│   ├── login()
│   ├── register()
│   ├── staffLogin()
│   ├── changePassword()
│   ├── forgotPassword()
│   ├── verifyOTP()
│   ├── googleAuthStart()
│   ├── logout()
│   ├── isAuthenticated()
│   └── getCurrentUser()
│
├── postService.js ───────────► Posts Management
│   ├── getPosts()
│   ├── getPostById()
│   ├── createPost()
│   ├── updatePost()
│   ├── deletePost()
│   ├── getPostsByMember()
│   ├── assignStaff()
│   ├── getFeaturedPosts()
│   ├── getDirectPosts()
│   └── getStaffAssistedPosts()
│
├── batteryService.js ────────► Battery Operations
│   ├── getBatteries()
│   ├── getBatteryById()
│   ├── createBattery()
│   ├── updateBattery()
│   ├── deleteBattery()
│   ├── getBatteriesByMember()
│   └── searchBatteries()
│
├── vehicleService.js ────────► Vehicle Operations
│   ├── getVehicles()
│   ├── getVehicleById()
│   ├── createVehicle()
│   ├── updateVehicle()
│   └── deleteVehicle()
│
├── paymentService.js ────────► Payment Processing
│   ├── getPayments()
│   ├── createPayment()
│   ├── getPaymentById()
│   ├── updatePaymentStatus()
│   ├── processPayment()
│   ├── getPaymentsByBuyer()
│   ├── getPaymentsBySeller()
│   └── getPaymentStatistics()
│
├── packageService.js ────────► Post Packages
│   ├── getPackages()
│   ├── getActivePackages()
│   ├── subscribeToPackage()
│   └── getPackageStatistics()
│
├── postRequestService.js ────► Buyer/Seller Requests
│   ├── getPostRequests()
│   ├── createPostRequest()
│   ├── getRequestsByPost()
│   ├── getRequestsByBuyer()
│   ├── acceptRequest()
│   ├── rejectRequest()
│   └── getNegotiationsByPost()
│
├── memberService.js ─────────► Member Management
│   ├── getMembers()
│   ├── getMemberById()
│   ├── updateMember()
│   └── getTopRatedMembers()
│
├── constructService.js ──────► Service Constructs
│   ├── getConstructs()
│   ├── getConstructsByType()
│   ├── getConstructsByStatus()
│   ├── getConstructFees()
│   ├── addConstructFee()
│   ├── searchConstructs()
│   └── getNearbyConstructs()
│
├── batteryModelService.js ───► Battery Models
│   ├── getBatteryModels()
│   ├── getBatteryModelById()
│   ├── createCustomBatteryModel()
│   ├── getAllFilters()
│   └── searchBatteryModels()
│
└── vehicleModelService.js ───► Vehicle Models
    ├── getVehicleModels()
    ├── getVehicleModelById()
    ├── createCustomVehicleModel()
    ├── getAllFilters()
    └── searchVehicleModels()
```

## Constants Structure

```
src/constants/apiConstants.js
│
├── POST_STATUS
│   ├── ACTIVE
│   ├── INACTIVE
│   ├── PENDING
│   ├── APPROVED
│   ├── REJECTED
│   ├── SOLD
│   └── EXPIRED
│
├── POST_TYPE
│   ├── BATTERY
│   ├── VEHICLE
│   └── BOTH
│
├── TRANSACTION_TYPE
│   ├── DIRECT
│   └── STAFF_ASSISTED
│
├── PAYMENT_STATUS
│   ├── PENDING
│   ├── COMPLETED
│   ├── FAILED
│   ├── CANCELLED
│   └── REFUNDED
│
├── PAYMENT_METHOD
│   ├── BANK_TRANSFER
│   ├── MOMO
│   ├── VNPAY
│   └── CASH
│
├── MEMBER_STATUS
│   ├── ACTIVE
│   ├── INACTIVE
│   ├── SUSPENDED
│   └── BANNED
│
├── ROLE
│   ├── ADMIN
│   ├── STAFF
│   ├── CUSTOMER
│   └── MEMBER
│
└── ... (more constants)
```

## Database Relationships

```
┌──────────────┐         ┌──────────────┐
│   Accounts   │────1:1──│   Members    │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │                        │ 1:N
       │                        │
       │                 ┌──────▼───────┐
       │                 │    Posts     │
       │                 └──────┬───────┘
       │                        │
       │                  ┌─────┴─────┐
       │                  │           │
       │            ┌─────▼────┐ ┌───▼──────┐
       │            │ Batteries│ │ Vehicles │
       │            └──────────┘ └──────────┘
       │
       ├───────────┐
       │           │
┌──────▼───────┐  │  ┌──────────────┐
│    Roles     │  └──│  Payments    │
└──────────────┘     └──────┬───────┘
                            │
                     ┌──────┴───────┐
                     │              │
              ┌──────▼──────┐  ┌───▼────────────┐
              │ Constructs  │  │ PostPackageSubs│
              └─────────────┘  └────────────────┘
```

## Component Integration Example

```
┌─────────────────────────────────────────────┐
│           ProductsPage Component            │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  useEffect(() => {                    │ │
│  │    fetchPosts();                      │ │
│  │  }, [filters]);                       │ │
│  └───────────────────────────────────────┘ │
│                    ▼                        │
│  ┌───────────────────────────────────────┐ │
│  │  const fetchPosts = async () => {     │ │
│  │    const data = await postService     │ │
│  │      .getPosts({ page, filters });    │ │
│  │    setPosts(data);                    │ │
│  │  }                                    │ │
│  └───────────────────────────────────────┘ │
│                    ▼                        │
│  ┌───────────────────────────────────────┐ │
│  │  return (                             │ │
│  │    <div>                              │ │
│  │      {posts.map(post =>               │ │
│  │        <ProductCard post={post} />    │ │
│  │      )}                               │ │
│  │    </div>                             │ │
│  │  )                                    │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

**Legend:**

- `───►` : One-way data flow
- `◄───►` : Two-way communication
- `1:1` : One-to-one relationship
- `1:N` : One-to-many relationship

**Created**: November 3, 2025
