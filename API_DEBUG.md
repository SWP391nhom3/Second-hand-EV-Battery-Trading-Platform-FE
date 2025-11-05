# 🐛 API Debug Guide - Fix Lỗi 500

## ✅ Đã Fix

### 1. **API Base URL** (CRITICAL)

- ❌ **Before**: `https://localhost:8080` (HTTPS with SSL certificate issues)
- ✅ **After**: `http://localhost:5000` (HTTP without SSL)

**Files Updated**:

- `.env` → `VITE_API_BASE_URL=http://localhost:5000`
- `axios.js` → Fallback từ `https://localhost:8080` → `http://localhost:5000`

### 2. **Login Endpoint**

- ❌ **Before**: `api/Auth/login` (missing leading `/`)
- ✅ **After**: `/api/Auth/login` (correct)

**File Updated**:

- `LoginForm.jsx` → Fixed endpoint path

### 3. **Timeout**

- ❌ **Before**: 10 seconds (too short for slow connections)
- ✅ **After**: 30 seconds

---

## 🔍 Root Causes của Lỗi 500

### Cause 1: HTTPS Certificate Error

```
Error: self signed certificate
Error: unable to verify the first certificate
```

**Fix**: Đổi từ `https://` sang `http://` trong development

### Cause 2: Wrong Port

```
ECONNREFUSED localhost:8080
```

**Fix**: Backend đang chạy trên port 5000, không phải 8080

### Cause 3: Missing Leading Slash

```
POST http://localhost:5000api/Auth/login ❌
POST http://localhost:5000/api/Auth/login ✅
```

**Fix**: Thêm `/` vào đầu endpoint

---

## 🧪 How to Test

### Step 1: Restart Dev Server

```bash
# Ctrl + C để stop
npm run dev
```

> ⚠️ **Important**: Phải restart vì Vite cần reload `.env` file!

### Step 2: Clear Browser Cache

```bash
# Chrome/Edge: Ctrl + Shift + Delete
# Hoặc: Hard refresh: Ctrl + F5
```

### Step 3: Test Login

1. Navigate to `/login`
2. Enter email & password
3. Click "Đăng nhập"
4. Check Console & Network tab

### Step 4: Verify API Call

**Network Tab should show**:

```
POST http://localhost:5000/api/Auth/login
Status: 200 OK (not 500!)
Response: { token: "...", account: {...} }
```

---

## 🔧 Troubleshooting

### Issue 1: Still Getting 500 Error

**Check**:

1. Backend server đang chạy chưa?

   ```bash
   # Test backend
   curl http://localhost:5000/api/Post
   ```

2. Database connection OK chưa?

   ```bash
   # Check backend logs
   ```

3. Endpoint có đúng không?
   ```bash
   # Swagger UI
   http://localhost:5000/swagger
   ```

### Issue 2: CORS Error

**Check axios.js**:

```javascript
// Should NOT have these in development
// withCredentials: true,
// credentials: 'include'
```

**Backend should allow CORS**:

```csharp
// Program.cs hoặc Startup.cs
app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
});
```

### Issue 3: Network Error (ERR_CONNECTION_REFUSED)

**Fix**:

1. Check backend đang chạy:

   ```bash
   netstat -ano | findstr :5000
   ```

2. Check firewall không block port 5000

3. Try với IP thay vì localhost:
   ```
   http://127.0.0.1:5000
   ```

### Issue 4: Token Issues

**Debug in Console**:

```javascript
// Check token được lưu chưa
console.log("Token:", sessionStorage.getItem("token"));
console.log("User:", sessionStorage.getItem("user"));

// Check token format
const token = sessionStorage.getItem("token");
if (token) {
  const parts = token.split(".");
  console.log("Token parts:", parts.length); // Should be 3
}
```

---

## 📝 API Request Format

### Correct Login Request

```javascript
// ✅ Correct
POST /api/Auth/login
Content-Type: application/json
Body: {
  "email": "user@example.com",
  "password": "Password123"
}
```

### Expected Response

```javascript
// ✅ Success (200)
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "account": {
    "accountId": 1,
    "email": "user@example.com",
    "role": "Member",
    // ... other fields
  }
}

// ❌ Error (400)
{
  "message": "Email hoặc password không đúng"
}

// ❌ Error (500)
{
  "message": "Internal server error"
}
```

---

## 🎯 Quick Checklist

Trước khi test lại, check:

- [ ] Backend đang chạy trên port 5000
- [ ] `.env` có `VITE_API_BASE_URL=http://localhost:5000`
- [ ] Dev server đã restart (Ctrl+C rồi `npm run dev`)
- [ ] Browser cache đã clear (Ctrl+F5)
- [ ] Network tab mở sẵn để check request
- [ ] Console mở sẵn để check logs

---

## 🚨 Common Backend Issues

### Issue 1: Database Connection Failed

```csharp
// Check connection string
"ConnectionStrings": {
  "DefaultConnection": "Server=...;Database=...;..."
}
```

### Issue 2: JWT Secret Missing

```csharp
// Check appsettings.json
"Jwt": {
  "SecretKey": "your-secret-key-here",
  "Issuer": "your-issuer",
  "Audience": "your-audience"
}
```

### Issue 3: Password Hash Mismatch

```csharp
// Backend should use BCrypt or similar
var isValid = BCrypt.Verify(password, storedHash);
```

---

## 📊 Debug Logs to Look For

### Frontend Console

```
✅ Good logs:
📦 Fetching...
✅ Login successful: { token: "...", ... }
✓ Saved to sessionStorage

❌ Bad logs:
❌ Login error: 500 Internal Server Error
Network Error
CORS Error
```

### Backend Logs

```
✅ Good:
POST /api/Auth/login - 200 OK
User authenticated: user@example.com

❌ Bad:
POST /api/Auth/login - 500 Internal Server Error
Exception: NullReferenceException
Exception: SqlException
```

---

## 🔐 Security Notes

### Development (.env)

```bash
VITE_API_BASE_URL=http://localhost:5000
```

### Production (.env.production)

```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

> ⚠️ **Never commit `.env` to git!** (should be in `.gitignore`)

---

## ✅ Verification

Sau khi fix, verify:

1. **API Call Works**

   ```bash
   # Should return 200, not 500
   curl -X POST http://localhost:5000/api/Auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123"}'
   ```

2. **Token Saved**

   ```javascript
   // Console
   sessionStorage.getItem("token"); // Should return JWT token
   ```

3. **User Data Saved**

   ```javascript
   // Console
   JSON.parse(sessionStorage.getItem("user")); // Should return user object
   ```

4. **Navigation Works**
   ```
   After login → Redirect to / (Member)
   After login → Redirect to /admin (Admin)
   After login → Redirect to /staff (Staff)
   ```

---

## 🎉 Expected Result

Sau khi fix:

```
1. Click "Đăng nhập"
2. Network tab: POST /api/Auth/login → 200 OK ✅
3. Console: "✅ Login successful" ✅
4. Toast: "Đăng nhập thành công! 🎉" ✅
5. Navigate to homepage ✅
6. Header shows user info ✅
```

---

**Last Updated**: November 5, 2025
**Status**: ✅ Fixed - Ready to test
