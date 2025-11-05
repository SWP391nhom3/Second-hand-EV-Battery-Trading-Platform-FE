# 📝 Tích hợp API Đăng Tin - CreatePostModal

## ✅ Tổng quan

Tài liệu này mô tả việc tích hợp API thật cho chức năng **đăng tin** trong `CreatePostModal.jsx`.

---

## 🔄 Luồng hoạt động

### 1. **Người dùng mở modal**

- Modal tự động fetch danh sách gói đăng tin từ API: `GET /api/PostPackage/active`
- Hiển thị loading state trong khi fetch

### 2. **Người dùng chọn loại tin**

- **Bán pin EV** (`postType = "sell"`)
- **Bán xe ô tô điện** (`postType = "car"`)

### 3. **Người dùng chọn gói đăng tin**

- Hiển thị danh sách gói từ API
- Người dùng chọn 1 gói (free, basic, standard, premium)

### 4. **Người dùng nhập thông tin chi tiết**

#### Nếu chọn "Bán pin EV":

- Thương hiệu (brand)
- Dung lượng (capacity - kWh)
- Năm sản xuất (manufactureYear)
- Số chu kỳ sạc (cycleCount)
- Tình trạng (condition)
- Giá (price)

#### Nếu chọn "Bán xe ô tô điện":

- Thương hiệu (brand)
- Model xe (model)
- Năm sản xuất (manufactureYear)
- Số km đã đi (mileage)
- Dung lượng pin (batteryCapacity)
- Tình trạng (condition)
- Giá (price)

### 5. **Người dùng upload ảnh** (Tùy chọn - chưa tích hợp backend)

- Upload hình ảnh sản phẩm
- Preview ảnh

### 6. **Xác nhận và Submit**

#### Backend Flow:

1. **Kiểm tra authentication**

   - Lấy `memberId` từ `getUser()`
   - Nếu chưa đăng nhập → Error

2. **Tạo Battery hoặc Vehicle trước**

   - **Nếu bán pin**: `POST /api/Battery`
     ```json
     {
       "memberId": "string",
       "brand": "string",
       "capacityKWh": number,
       "cycleCount": number,
       "manufactureYear": number,
       "condition": "string",
       "description": "string"
     }
     ```
   - **Nếu bán xe**: `POST /api/Vehicle`
     ```json
     {
       "memberId": "string",
       "brand": "string",
       "model": "string",
       "manufactureYear": number,
       "mileageKm": number,
       "batteryCapacity": number,
       "condition": "string",
       "description": "string"
     }
     ```

3. **Tạo Post**

   - Sử dụng `batteryId` hoặc `vehicleId` từ bước 2
   - `POST /api/Post`
     ```json
     {
       "memberId": "string",
       "batteryId": "string (nếu bán pin)",
       "vehicleId": "string (nếu bán xe)",
       "postPackageId": "string",
       "title": "string",
       "price": number,
       "description": "string",
       "postType": "Direct" | "Staff-Assisted",
       "transactionType": "Sale",
       "contactInfo": "string",
       "location": "string",
       "status": "Pending"
     }
     ```

4. **Success**
   - Hiển thị message thành công
   - Reset form
   - Đóng modal
   - Gọi callback `onSuccess(postResponse)`

---

## 📦 API Endpoints đã tích hợp

### 1. GET Active Packages

```javascript
GET /api/PostPackage/active

// Response
[
  {
    "postPackageId": "string",
    "name": "Gói Miễn phí",
    "price": 0,
    "durationDays": 7,
    "featured": false,
    "priority": 0,
    ...
  }
]
```

### 2. Create Battery

```javascript
POST /api/Battery

// Request Body
{
  "memberId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "brand": "Tesla",
  "capacityKWh": 75,
  "cycleCount": 500,
  "manufactureYear": 2023,
  "condition": "good",
  "description": "Pin tình trạng tốt..."
}

// Response
{
  "batteryId": "string",
  "memberId": "string",
  ...
}
```

### 3. Create Vehicle

```javascript
POST /api/Vehicle

// Request Body
{
  "memberId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "brand": "VinFast",
  "model": "VF8",
  "manufactureYear": 2024,
  "mileageKm": 15000,
  "batteryCapacity": 87.7,
  "condition": "excellent",
  "description": "Xe tình trạng như mới..."
}

// Response
{
  "id": "string",
  "memberId": "string",
  ...
}
```

### 4. Create Post

```javascript
POST /api/Post

// Request Body
{
  "memberId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "batteryId": "battery-id-from-step-2",  // OR vehicleId
  "postPackageId": "package-id",
  "title": "Bán pin Tesla 75kWh...",
  "price": 50000000,
  "description": "Mô tả chi tiết...",
  "postType": "Direct",
  "transactionType": "Sale",
  "contactInfo": "user@email.com",
  "location": "Hà Nội",
  "status": "Pending"
}

// Response
{
  "postId": "string",
  "title": "string",
  "status": "Pending",
  ...
}
```

---

## 🔐 Authentication

Modal kiểm tra authentication bằng cách:

```javascript
import { getUser } from "../../../utils/sessionStorage";

const currentUser = getUser();
if (!currentUser || !currentUser.memberId) {
  message.error("Vui lòng đăng nhập để đăng tin!");
  return;
}
```

User object structure:

```javascript
{
  memberId: "string",
  email: "string",
  fullName: "string",
  ...
}
```

---

## 🎨 UI/UX Features

### 1. **Loading States**

- Loading khi fetch packages: `<Progress type="circle" />`
- Loading khi submit: Button với `loading` prop
- Message loading: `message.loading("Đang tạo...")`

### 2. **Error Handling**

```javascript
try {
  // API calls
} catch (error) {
  if (error.response) {
    // Server error with message
    message.error(error.response.data?.message);
  } else if (error.request) {
    // Network error
    message.error("Không thể kết nối đến server!");
  } else {
    // Other errors
    message.error("Có lỗi xảy ra!");
  }
}
```

### 3. **Validation**

- Form validation với Ant Design rules
- Required fields check
- Min/max length validation
- Number range validation
- Package selection validation

### 4. **Success Flow**

```javascript
message.success({
  content: "Đăng tin thành công! Tin đăng của bạn đang chờ kiểm duyệt.",
  duration: 3,
});

// Reset form
form.resetFields();
setCurrentStep(0);
setFileList([]);

// Callback
if (onSuccess) {
  onSuccess(postResponse);
}

onCancel(); // Close modal
```

---

## 📋 Form Fields Mapping

### Battery Fields (postType = "sell")

| UI Label      | Form Field        | API Field         | Type   | Required |
| ------------- | ----------------- | ----------------- | ------ | -------- |
| Thương hiệu   | `brand`           | `brand`           | string | ✅       |
| Dung lượng    | `capacity`        | `capacityKWh`     | number | ✅       |
| Năm sản xuất  | `manufactureYear` | `manufactureYear` | number | ✅       |
| Số chu kỳ sạc | `cycleCount`      | `cycleCount`      | number | ✅       |
| Tình trạng    | `condition`       | `condition`       | string | ✅       |
| Giá           | `price`           | (Post) `price`    | number | ✅       |
| Mô tả         | `description`     | `description`     | string | ✅       |

### Vehicle Fields (postType = "car")

| UI Label       | Form Field        | API Field         | Type   | Required |
| -------------- | ----------------- | ----------------- | ------ | -------- |
| Thương hiệu    | `brand`           | `brand`           | string | ✅       |
| Model xe       | `model`           | `model`           | string | ✅       |
| Năm sản xuất   | `manufactureYear` | `manufactureYear` | number | ✅       |
| Số km          | `mileage`         | `mileageKm`       | number | ✅       |
| Dung lượng pin | `batteryCapacity` | `batteryCapacity` | number | ✅       |
| Tình trạng     | `condition`       | `condition`       | string | ✅       |
| Giá            | `price`           | (Post) `price`    | number | ✅       |
| Mô tả          | `description`     | `description`     | string | ✅       |

### Post Fields (Common)

| UI Label     | Form Field        | API Field       | Type   | Required |
| ------------ | ----------------- | --------------- | ------ | -------- |
| Tiêu đề      | `title`           | `title`         | string | ✅       |
| Thành phố    | `city`            | `location`      | string | ✅       |
| Gói đăng tin | `selectedPackage` | `postPackageId` | string | ✅       |

---

## 🚀 Usage Example

```jsx
import CreatePostModal from "./components/customer/CreatePostModal/CreatePostModal";

function MyComponent() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSuccess = (postResponse) => {
    console.log("Post created:", postResponse);
    // Refresh posts list, navigate, etc.
  };

  return (
    <>
      <Button onClick={() => setModalVisible(true)}>Đăng tin mới</Button>

      <CreatePostModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
```

---

## ⚠️ Known Limitations

### 1. **Image Upload**

- Hiện tại chưa tích hợp upload ảnh lên backend
- Chỉ có preview ảnh ở frontend
- Cần thêm API endpoint để upload images

### 2. **Battery/Vehicle Models**

- Chưa có dropdown list cho `batteryModelId` và `vehicleModelId`
- Hiện tại để `null` khi tạo
- Có thể thêm sau nếu backend cung cấp endpoints

### 3. **Transaction Type**

- Hiện tại hardcode `transactionType: "Sale"`
- Chưa có UI cho user chọn Direct/Staff-Assisted
- Có thể mở rộng trong tương lai

### 4. **Contact Info**

- Hiện tại dùng email từ session
- Chưa có field riêng cho user nhập số điện thoại

---

## 🔮 Future Enhancements

1. **Image Upload Integration**

   - Tích hợp với backend image upload API
   - Support multiple images
   - Image compression trước khi upload

2. **Draft Save**

   - Lưu draft vào localStorage
   - Restore draft khi mở lại modal

3. **Validation Cải tiến**

   - Real-time validation
   - Custom validators
   - Price range suggestions

4. **Preview Mode**

   - Preview post trước khi submit
   - Mobile preview

5. **Analytics**
   - Track user actions
   - A/B testing cho UI

---

## 📞 Support

Nếu có vấn đề với API integration:

1. Kiểm tra backend đã chạy chưa: `https://localhost:8080/swagger`
2. Kiểm tra token authentication
3. Check network tab trong DevTools
4. Xem error logs trong Console

---

**Cập nhật lần cuối**: 2025-11-05  
**Phiên bản**: 1.0.0
