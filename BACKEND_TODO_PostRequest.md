# 🔴 URGENT: Backend Endpoint Missing - PostRequest API

## ❌ Problem

Frontend is trying to call `POST /api/PostRequest` but backend returns **404 Not Found**.

## 📍 Location

- **Frontend**: `src/components/products/ContactVehicleModal/ContactVehicleModal.jsx`
- **Service**: `src/services/postRequestService.js`
- **Endpoint**: `POST http://localhost:8080/api/PostRequest`

## 🔧 Current Temporary Solution

Frontend is using **localStorage as fallback** to save contact requests when API is unavailable.

```javascript
// Data is saved to: localStorage.getItem('contactRequests')
```

## ✅ Required Backend Implementation

### Endpoint: `POST /api/PostRequest`

**Request Body:**

```json
{
  "postId": 1,
  "buyerId": 2,
  "message": "Thông tin liên hệ:\nHọ tên: Huỳnh Hoàng Tiến\nEmail: huynh.tien753@gmail.com\nSĐT: 0869848592\nĐịa chỉ: TP. Hồ Chí Minh\nThời gian: Chiều (13h-17h)\n\nGhi chú: Tôi muốn mua xe",
  "offerPrice": 809000000
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "postId": 1,
  "buyerId": 2,
  "message": "...",
  "offerPrice": 809000000,
  "status": "Pending",
  "createdAt": "2025-11-07T10:30:00Z",
  "updatedAt": "2025-11-07T10:30:00Z"
}
```

## 📋 Backend TODO Checklist

- [ ] Create `PostRequest` entity/model

  - `id` (int, primary key)
  - `postId` (int, foreign key to Post)
  - `buyerId` (int, foreign key to Member)
  - `message` (string, contact details)
  - `offerPrice` (decimal)
  - `status` (enum: Pending, Accepted, Rejected, Cancelled, Completed)
  - `createdAt` (datetime)
  - `updatedAt` (datetime)

- [ ] Create `PostRequestController` with endpoints:

  - `POST /api/PostRequest` - Create new request ⚠️ **PRIORITY**
  - `GET /api/PostRequest` - Get all requests (admin)
  - `GET /api/PostRequest/{id}` - Get request by ID
  - `GET /api/PostRequest/post/{postId}` - Get requests for a post (seller)
  - `GET /api/PostRequest/buyer/{buyerId}` - Get buyer's requests
  - `GET /api/PostRequest/status/{status}` - Filter by status
  - `PUT /api/PostRequest/{id}/accept` - Seller accepts
  - `PUT /api/PostRequest/{id}/reject` - Seller rejects
  - `PUT /api/PostRequest/{id}/status` - Update status
  - `DELETE /api/PostRequest/{id}` - Delete request

- [ ] Add validation:

  - `postId` must exist
  - `buyerId` must exist and be authenticated
  - Buyer cannot be the post owner (seller)
  - `offerPrice` must be positive

- [ ] Add authorization:
  - Buyer can only see their own requests
  - Seller can see requests for their posts
  - Admin/Staff can see all requests

## 🔗 Related Files (Frontend)

- `src/services/postRequestService.js` - API service layer
- `src/constants/apiConstants.js` - API endpoint definitions
- `src/components/products/ContactVehicleModal/ContactVehicleModal.jsx` - Contact form

## 📊 Database Schema Suggestion

```sql
CREATE TABLE PostRequests (
    Id INT PRIMARY KEY IDENTITY(1,1),
    PostId INT NOT NULL,
    BuyerId INT NOT NULL,
    Message NVARCHAR(2000),
    OfferPrice DECIMAL(18,2),
    Status NVARCHAR(50) DEFAULT 'Pending',
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (PostId) REFERENCES Posts(Id),
    FOREIGN KEY (BuyerId) REFERENCES Members(Id)
);

CREATE INDEX IX_PostRequests_PostId ON PostRequests(PostId);
CREATE INDEX IX_PostRequests_BuyerId ON PostRequests(BuyerId);
CREATE INDEX IX_PostRequests_Status ON PostRequests(Status);
```

## 🚨 Impact

- Users **cannot submit contact requests** until this endpoint is implemented
- Frontend is using **localStorage as temporary workaround**
- Data will be **lost on browser clear** until backend is ready

## 📞 Contact

Frontend Developer: [Your Name]
Date Reported: November 7, 2025
Priority: **HIGH** 🔴

---

**Note**: Once backend implements this endpoint, remove the localStorage fallback in `ContactVehicleModal.jsx` and the try-catch wrapper.
