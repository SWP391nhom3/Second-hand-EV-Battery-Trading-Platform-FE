# 🚀 Quick Start - API Update

## ✅ Đã Hoàn Thành

Tất cả services và components chính đã được cập nhật theo OpenAPI 3.0.4 spec mới.

---

## 📁 Files Quan Trọng

### Documentation

- **`API_INTEGRATION_GUIDE.md`** - Hướng dẫn chi tiết tất cả endpoints
- **`API_UPDATE_CHECKLIST.md`** - Checklist verify từng bước
- **`API_UPDATE_SUMMARY.md`** - Tóm tắt toàn bộ thay đổi

### Services (src/services/)

- ✅ `postService.js` - Quản lý posts/tin đăng
- ✅ `batteryService.js` - Quản lý batteries
- ✅ `vehicleService.js` - Quản lý vehicles
- ✅ `memberService.js` - Quản lý members
- ✅ `packageService.js` - Quản lý post packages
- ✅ `postRequestService.js` - Quản lý post requests
- ✅ `paymentService.js` - Quản lý payments
- ✅ `constructService.js` - Quản lý constructs

### Components

- ✅ `ProductDetailPage.jsx` - Tích hợp API GET /api/Post/{id}
- ✅ `ProductsPage.jsx` - Tích hợp API GET /api/Post với filters

---

## 🎯 Những Thay Đổi Chính

### 1. Post Schema Mới

```javascript
{
  postId: number,
  title: string,
  price: number,
  postType: "Direct" | "Staff-Assisted", // ⭐ NEW
  transactionType: string, // ⭐ NEW
  contactInfo: string, // ⭐ NEW
  featured: boolean, // ⭐ NEW
  expiryDate: date, // ⭐ NEW
  status: string,

  // Nested objects
  member: { memberId, fullName, avatarUrl, rating, ... },
  battery: { batteryId, brand, capacityKWh, cycleCount, ... },
  vehicle: { id, brand, model, mileageKm, ... },
  staff: { memberId, fullName }, // ⭐ NEW
}
```

### 2. Battery Schema Mới

```javascript
{
  batteryId: number,
  brand: string,
  capacityKWh: number, // ⭐ Renamed
  cycleCount: number, // ⭐ NEW
  manufactureYear: number, // ⭐ NEW
  condition: string,
  member: {...}, // ⭐ NEW nested
  posts: [...], // ⭐ NEW nested
}
```

### 3. Vehicle Schema Mới

```javascript
{
  id: number,
  brand: string,
  model: string,
  manufactureYear: number, // ⭐ NEW
  mileageKm: number, // ⭐ NEW
  batteryCapacity: number,
  condition: string,
  member: {...}, // ⭐ NEW nested
  posts: [...], // ⭐ NEW nested
}
```

---

## 🧪 Cách Test

### 1. Cấu hình API URL

```javascript
// src/configs/axios.js
const api = axios.create({
  baseURL: "http://localhost:5000", // ⚠️ Update này
});
```

### 2. Test Products Page

```bash
# Navigate to: http://localhost:5174/products
# ✅ Should load products from API
# ✅ Check console for: "API Response: {...}"
```

### 3. Test Product Detail

```bash
# Click vào bất kỳ product nào
# ✅ Navigate to: /products/:id
# ✅ Check console for: "📦 Fetching product detail..."
# ✅ Check console for: "✅ Product detail response: {...}"
```

### 4. Verify trong Network Tab

```
GET /api/Post (status: 200)
GET /api/Post/123 (status: 200)
```

---

## 🔧 Code Examples

### Fetch Products

```javascript
import postService from "../../services/postService";

const products = await postService.getPosts({
  pageNumber: 1,
  pageSize: 12,
  minPrice: 100000000,
  maxPrice: 300000000,
});
```

### Fetch Product Detail

```javascript
const product = await postService.getPostById(123);

console.log(product.title); // "Pin Tesla 85kWh"
console.log(product.battery.capacityKWh); // 85
console.log(product.member.fullName); // "Nguyễn Văn A"
```

### Create Post

```javascript
const newPost = await postService.createPost({
  memberId: 1,
  batteryId: 5,
  title: "Pin Tesla mới 90%",
  description: "Pin còn rất tốt",
  price: 240000000,
  postType: "Direct",
  transactionType: "Sale",
  contactInfo: "0912345678",
});
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Check Nested Objects

```javascript
// ❌ Wrong
const brand = post.battery.brand;

// ✅ Correct
const brand = post.battery?.brand || "Unknown";
```

### 2. Distinguish Battery vs Vehicle

```javascript
const isBattery = post.batteryId && post.battery;
const isVehicle = post.vehicleId && post.vehicle;

if (isBattery) {
  specs = post.battery;
} else if (isVehicle) {
  specs = post.vehicle;
}
```

### 3. Handle Errors

```javascript
try {
  const data = await postService.getPosts();
} catch (error) {
  if (error.response?.status === 404) {
    message.error("Không tìm thấy dữ liệu");
  } else if (error.code === "ERR_NETWORK") {
    message.error("Không thể kết nối server");
  }
}
```

---

## 📊 Progress

| Component         | Status  | Note           |
| ----------------- | ------- | -------------- |
| Services          | ✅ 100% | All ready      |
| ProductDetailPage | ✅ 100% | API integrated |
| ProductsPage      | ✅ 100% | API integrated |
| CreatePostModal   | ⏳ 50%  | Need update    |
| PostRequest       | 🔴 0%   | Not started    |
| Payment           | 🔴 0%   | Not started    |

---

## 🆘 Troubleshooting

### Lỗi: "Cannot read property 'brand' of undefined"

**Fix**: Dùng optional chaining

```javascript
const brand = post.battery?.brand || "Unknown";
```

### Lỗi: "Network Error"

**Fix**: Kiểm tra API server đang chạy và baseURL đúng

### Lỗi: "404 Not Found"

**Fix**: Verify ID tồn tại trong database

### Products không load

**Fix**: Check console logs, verify API endpoint `/api/Post`

---

## 📞 Need Help?

1. **Documentation**: Xem `API_INTEGRATION_GUIDE.md`
2. **Checklist**: Xem `API_UPDATE_CHECKLIST.md`
3. **Summary**: Xem `API_UPDATE_SUMMARY.md`
4. **Swagger**: `http://localhost:5000/swagger`

---

## ✅ Ready to Test!

All code đã sẵn sàng. Chỉ cần:

1. ✅ Start API server
2. ✅ Update baseURL in axios.js
3. ✅ Run `npm run dev`
4. ✅ Test trang products và product detail

**Happy Coding! 🚀**
