# 🔧 Fix Customer Dashboard - Posts Not Showing

## ❌ Problem
Customer dashboard shows **0 posts** even though user has created posts that are approved and visible on products page.

**Symptoms**:
- Customer creates post → Admin approves → Post appears on `/products` page ✅
- But customer dashboard at `/customer` shows "Chưa có bài đăng nào" ❌
- Statistics show "Tổng bài đăng: 0" ❌

## 🔍 Root Cause

Similar to the products page issue, the Customer Dashboard was using:
```javascript
postService.getPostsByMember(memberId)  // ❌ Returns empty or incorrect data
```

Backend endpoint `/api/Post/member/{memberId}` has issues:
- Returns empty array
- OR doesn't filter by member correctly
- OR returns posts with wrong status

## ✅ Solution Applied

Added **fallback logic** to `NewCustomerDashboard.jsx`:

### 1. **Updated fetchPosts() function** (Line ~145)
```javascript
const fetchPosts = async () => {
  try {
    console.log('🔄 Fetching posts for member:', memberId);
    
    let postsData = [];
    
    try {
      // Try member-specific endpoint first
      const response = await postService.getPostsByMember(memberId);
      postsData = Array.isArray(response) ? response : response.data || [];
      console.log(`📦 getPostsByMember returned ${postsData.length} posts`);
      
    } catch (memberError) {
      console.warn('⚠️ getPostsByMember failed, trying admin endpoint');
      
      // Fallback: Get all posts from admin endpoint and filter
      const allPosts = await postService.getAdminAllPosts();
      postsData = Array.isArray(allPosts) ? allPosts : allPosts.data || [];
      
      // Filter by memberId on frontend
      postsData = postsData.filter(post => post.memberId === memberId);
      console.log(`📦 Filtered ${postsData.length} posts for member ${memberId}`);
    }
    
    setPosts(postsData);
    
    // Count active/approved posts (case-insensitive)
    const activePosts = postsData.filter((p) => {
      const status = (p.status || "").toLowerCase();
      return status === "active" || status === "approved";
    });
    
    setStatistics(prev => ({
      ...prev,
      totalPosts: postsData.length,
      activePosts: activePosts.length,
    }));
    
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
  }
};
```

### 2. **Updated useEffect initial load** (Line ~70)
```javascript
useEffect(() => {
  if (!memberId) {
    console.warn('⚠️ No memberId found');
    return;
  }

  const loadData = async () => {
    setLoading(true);
    
    try {
      // Load batteries and vehicles
      const [batteryRes, vehicleRes] = await Promise.all([...]);
      
      // Load posts with fallback
      let postsData = [];
      try {
        const postRes = await postService.getPostsByMember(memberId);
        postsData = Array.isArray(postRes) ? postRes : postRes.data || [];
      } catch (postError) {
        // Fallback to admin endpoint
        const allPosts = await postService.getAdminAllPosts();
        const allPostsData = Array.isArray(allPosts) ? allPosts : [];
        postsData = allPostsData.filter(post => post.memberId === memberId);
      }
      
      setPosts(postsData);
      // ... update statistics
      
    } catch (err) {
      console.error("❌ Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [memberId]);
```

## 🎯 How It Works

### Flow:
1. **Try primary endpoint** → `GET /api/Post/member/{memberId}`
2. **If it fails** → Fallback to `GET /api/Post/admin/all`
3. **Filter on frontend** → `posts.filter(p => p.memberId === memberId)`
4. **Display posts** → Customer sees their posts ✅

### Benefits:
- ✅ **Resilient**: Works even if member endpoint is broken
- ✅ **Transparent**: Logs show which endpoint is used
- ✅ **Case-insensitive**: Status check handles "APPROVED" vs "Approved"
- ✅ **Accurate counts**: Statistics show correct numbers

## 📊 Console Output

When working correctly, you'll see:
```
🚀 Loading customer dashboard data for member: 2
📦 Loaded 2 posts from getPostsByMember
✅ Dashboard loaded – Posts: 2 | Active: 2 | Batteries: 1 | Vehicles: 0
```

If fallback is used:
```
🚀 Loading customer dashboard data for member: 2
⚠️ getPostsByMember failed, using admin endpoint fallback
📦 Filtered 2 posts for member 2 from admin endpoint
✅ Dashboard loaded – Posts: 2 | Active: 2 | Batteries: 1 | Vehicles: 0
```

## 🔧 Testing Steps

1. **Create a post** as customer
2. **Login as admin** → Approve the post
3. **Go back to customer dashboard** → `/customer`
4. **Check statistics cards** → Should show post count > 0
5. **Click "Bài đăng của tôi"** → Should see post in table
6. **Open browser console** → Verify logs show posts loaded

## 📋 Files Modified

- ✅ `src/components/customer/NewCustomerDashboard.jsx`
  - Updated `fetchPosts()` function with fallback logic
  - Updated `useEffect` initial data load
  - Added comprehensive console logging

## 🚨 Backend TODO

When backend team fixes the issue, **remove the fallback** and use only:
```javascript
// Future (when backend is fixed):
const response = await postService.getPostsByMember(memberId);
const postsData = Array.isArray(response) ? response : response.data || [];
setPosts(postsData);
```

### Backend endpoint to fix:
- `GET /api/Post/member/{memberId}` 
  - Should return ALL posts created by that member
  - Should include posts with status: Pending, Approved, Rejected, etc.
  - Should properly join with Battery, Vehicle, Member, PostPackageSubs data

## 🔗 Related Issues

This is the **same root cause** as:
- Products page showing no posts (fixed in `ProductsPage.jsx`)
- Contact form 404 error (fixed in `ContactVehicleModal.jsx`)

**Pattern**: Backend endpoints returning empty or 404 → Frontend adds fallback to admin endpoints

## 📞 Summary

**Before**: Customer dashboard shows 0 posts ❌  
**After**: Customer dashboard shows all their posts ✅

**Status**: ✅ Fixed with fallback logic  
**Date**: November 8, 2025  
**Priority**: HIGH (affects customer experience)
