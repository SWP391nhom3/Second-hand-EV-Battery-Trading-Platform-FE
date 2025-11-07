# 🚨 Backend API Issues Summary - November 8, 2025

## Overview
This document summarizes all backend API endpoints that are **broken or missing**, causing frontend to use fallback/workaround solutions.

---

## ❌ Issue #1: POST /api/PostRequest (404 Not Found)

**Status**: 🔴 **NOT IMPLEMENTED**

**Impact**: Users cannot submit contact requests for products

**Frontend Workaround**: 
- Saving contact requests to `localStorage` temporarily
- File: `src/components/products/ContactVehicleModal/ContactVehicleModal.jsx`

**What's needed**:
```
POST /api/PostRequest
Request Body:
{
  "postId": 1,
  "buyerId": 2,
  "message": "Contact details...",
  "offerPrice": 809000000
}

Response: 201 Created
{
  "id": 1,
  "postId": 1,
  "buyerId": 2,
  "status": "Pending",
  ...
}
```

**Documentation**: See `BACKEND_TODO_PostRequest.md`

---

## ❌ Issue #2: GET /api/Post (Empty Array)

**Status**: 🟠 **BROKEN** - Returns empty array even when posts exist

**Impact**: Products page shows no products for customers

**Frontend Workaround**: 
- Using `GET /api/Post/admin/all` and filtering on frontend
- File: `src/pages/products/ProductsPage.jsx`

**What's broken**:
```javascript
// Current behavior:
GET /api/Post → Returns: []  ❌

// Expected behavior:
GET /api/Post → Returns: [
  { postId: 1, status: "APPROVED", ... },
  { postId: 2, status: "APPROVED", ... }
]  ✅
```

**Root cause possibilities**:
1. Missing WHERE clause to filter approved posts
2. Default status filter is too restrictive
3. Joins with Battery/Vehicle failing silently

**What it should do**:
- Return all posts with `status = 'APPROVED'` or `status = 'ACTIVE'`
- Include relationships: Battery, Vehicle, Member, PostPackageSubs
- Support query parameters: `page`, `pageSize`, `search`, `minPrice`, `maxPrice`, etc.

---

## ❌ Issue #3: GET /api/Post/direct (Empty Array)

**Status**: 🟠 **BROKEN** - Returns empty array

**Impact**: Cannot filter direct transaction posts

**Frontend Workaround**: 
- Using admin endpoint and filtering `postType === 'Direct'` on frontend

**Expected behavior**:
```
GET /api/Post/direct → Returns posts where transactionType = 'DIRECT'
```

---

## ❌ Issue #4: GET /api/Post/staff-assisted (Empty Array)

**Status**: 🟠 **BROKEN** - Returns empty array

**Impact**: Cannot filter staff-assisted posts

**Frontend Workaround**: 
- Using admin endpoint and filtering `postType === 'Staff-Assisted'` on frontend

**Expected behavior**:
```
GET /api/Post/staff-assisted → Returns posts where transactionType = 'STAFF_ASSISTED'
```

---

## ❌ Issue #5: GET /api/Post/member/{memberId} (Empty or Incorrect)

**Status**: 🟠 **BROKEN** - Returns empty or doesn't filter correctly

**Impact**: Customer dashboard shows 0 posts even when user has created posts

**Frontend Workaround**: 
- Using `GET /api/Post/admin/all` and filtering `memberId` on frontend
- File: `src/components/customer/NewCustomerDashboard.jsx`

**What's broken**:
```javascript
// Current behavior:
GET /api/Post/member/2 → Returns: []  ❌

// Expected behavior:
GET /api/Post/member/2 → Returns: [
  { postId: 5, memberId: 2, status: "APPROVED", ... },
  { postId: 7, memberId: 2, status: "PENDING", ... }
]  ✅
```

**Expected behavior**:
- Return **ALL posts** created by that member (regardless of status)
- Include: Pending, Approved, Rejected, Active, Inactive posts
- Include full relationships

---

## ✅ Working Endpoints

These endpoints are **confirmed working**:

1. ✅ `GET /api/Post/admin/all` - Returns all posts with full data
2. ✅ `GET /api/Battery/member/{memberId}` - Returns user's batteries
3. ✅ `GET /api/Vehicle/member/{memberId}` - Returns user's vehicles
4. ✅ `POST /api/Post` - Creates new post successfully

---

## 🔧 Recommended Backend Fixes

### Priority 1 (HIGH) - Fix Empty Returns

**Fix these 4 endpoints to return data**:

1. **GET /api/Post**
   ```csharp
   // Add proper WHERE clause
   var posts = await _context.Posts
       .Include(p => p.Battery)
       .Include(p => p.Vehicle)
       .Include(p => p.Member)
       .Include(p => p.PostPackageSubs)
           .ThenInclude(ps => ps.Package)
       .Where(p => p.Status == "APPROVED" || p.Status == "ACTIVE")
       .ToListAsync();
   ```

2. **GET /api/Post/member/{memberId}**
   ```csharp
   // Should return ALL posts by member
   var posts = await _context.Posts
       .Include(p => p.Battery)
       .Include(p => p.Vehicle)
       .Include(p => p.PostPackageSubs)
       .Where(p => p.MemberId == memberId)
       .ToListAsync();
   ```

3. **GET /api/Post/direct**
   ```csharp
   var posts = await _context.Posts
       .Where(p => p.TransactionType == "DIRECT")
       .Where(p => p.Status == "APPROVED" || p.Status == "ACTIVE")
       .ToListAsync();
   ```

4. **GET /api/Post/staff-assisted**
   ```csharp
   var posts = await _context.Posts
       .Where(p => p.TransactionType == "STAFF_ASSISTED")
       .Where(p => p.Status == "APPROVED" || p.Status == "ACTIVE")
       .ToListAsync();
   ```

### Priority 2 (HIGH) - Implement Missing Endpoint

**Create the PostRequest controller**:

```csharp
[ApiController]
[Route("api/[controller]")]
public class PostRequestController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreatePostRequest([FromBody] PostRequestDto dto)
    {
        var postRequest = new PostRequest
        {
            PostId = dto.PostId,
            BuyerId = dto.BuyerId,
            Message = dto.Message,
            OfferPrice = dto.OfferPrice,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };
        
        _context.PostRequests.Add(postRequest);
        await _context.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetPostRequest), 
            new { id = postRequest.Id }, 
            postRequest);
    }
    
    // ... other CRUD methods
}
```

---

## 📊 Impact Assessment

| Endpoint | Status | Impact | Users Affected | Workaround |
|----------|--------|--------|----------------|------------|
| `POST /api/PostRequest` | 🔴 Missing | HIGH | All buyers | localStorage |
| `GET /api/Post` | 🟠 Empty | HIGH | All users | Admin endpoint |
| `GET /api/Post/member/{id}` | 🟠 Empty | HIGH | All sellers | Admin endpoint |
| `GET /api/Post/direct` | 🟠 Empty | MEDIUM | Filter users | Frontend filter |
| `GET /api/Post/staff-assisted` | 🟠 Empty | MEDIUM | Filter users | Frontend filter |

---

## 🧪 Testing Endpoints

### How to test if fixed:

1. **Test POST /api/PostRequest**:
   ```bash
   POST https://localhost:8080/api/PostRequest
   Content-Type: application/json
   
   {
     "postId": 1,
     "buyerId": 2,
     "message": "Test",
     "offerPrice": 100000
   }
   
   # Should return: 201 Created with PostRequest object
   ```

2. **Test GET /api/Post**:
   ```bash
   GET https://localhost:8080/api/Post
   
   # Should return: Array with approved posts
   # NOT: [] (empty array)
   ```

3. **Test GET /api/Post/member/{memberId}**:
   ```bash
   GET https://localhost:8080/api/Post/member/2
   
   # Should return: Array with all posts by member 2
   # NOT: [] (empty array)
   ```

---

## 📁 Related Frontend Files

**Files using workarounds** (need cleanup after backend fixes):

1. `src/pages/products/ProductsPage.jsx`
   - Line ~65: `getAdminAllPosts()` workaround
   - Remove after `/api/Post` is fixed

2. `src/components/customer/NewCustomerDashboard.jsx`
   - Line ~145: `getAdminAllPosts()` fallback
   - Remove after `/api/Post/member/{id}` is fixed

3. `src/components/products/ContactVehicleModal/ContactVehicleModal.jsx`
   - Line ~30: localStorage fallback
   - Remove after `POST /api/PostRequest` is implemented

---

## 🎯 Success Criteria

**All issues will be considered fixed when**:

1. ✅ Products page loads without using admin endpoint
2. ✅ Customer dashboard shows posts without fallback
3. ✅ Contact form submits to backend (not localStorage)
4. ✅ No console warnings about fallback endpoints
5. ✅ All filter features work properly

---

## 📞 Contact

**Frontend Developer**: [Your Name]  
**Date Created**: November 8, 2025  
**Last Updated**: November 8, 2025  

**Status**: 🔴 **5 CRITICAL ISSUES PENDING BACKEND FIXES**
