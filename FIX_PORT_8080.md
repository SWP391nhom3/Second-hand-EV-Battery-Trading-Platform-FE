# 🔧 Fix Lỗi 500 - Đúng Port 8080

## ✅ Root Cause: HTTPS → HTTP

Backend của bạn đang chạy trên **`http://localhost:8080`** (HTTP không có SSL).

Vấn đề là frontend đang gọi **`https://localhost:8080`** (HTTPS) → Lỗi SSL certificate!

---

## 🔧 Solution

### Chỉ cần đổi từ HTTPS → HTTP:

```bash
# BEFORE (Error 500)
https://localhost:8080  ❌ SSL certificate error

# AFTER (Works!)
http://localhost:8080   ✅ No SSL needed
```

---

## 📝 Files Updated

### 1. `.env`

```bash
# Changed
VITE_API_BASE_URL=http://localhost:8080
```

### 2. `src/configs/axios.js`

```javascript
// Changed fallback
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
```

### 3. `src/components/auth/LoginForm/LoginForm.jsx`

```javascript
// Fixed endpoint path
api.post("/api/Auth/login", { ... })  // Added leading /
```

---

## 🧪 Test Now

### Step 1: Restart Dev Server

```bash
Ctrl + C
npm run dev
```

### Step 2: Test Login

```
URL: http://localhost:5174/login
Backend: http://localhost:8080/api/Auth/login
Expected: 200 OK ✅
```

---

## 🎯 Quick Verification

### Option 1: Browser Console

```javascript
// Paste in Console (F12)
fetch("http://localhost:8080/api/Post")
  .then((r) => console.log("✅ API Status:", r.status))
  .catch((e) => console.error("❌ Error:", e));
```

### Option 2: CMD/Terminal

```bash
curl http://localhost:8080/api/Post
```

### Option 3: Browser

```
Navigate to: http://localhost:8080/swagger
Should see Swagger UI ✅
```

---

## 📊 Expected Results

### ✅ Success

```
Network Tab:
  POST http://localhost:8080/api/Auth/login
  Status: 200 OK
  Response: { token: "...", account: {...} }

Console:
  ✅ Login successful: { ... }

UI:
  Toast: "Đăng nhập thành công! 🎉"
  Navigate to /
```

### ❌ If Still Error

**Check Backend**:

```bash
# Is backend running?
netstat -ano | findstr :8080

# Should show something like:
TCP    0.0.0.0:8080    0.0.0.0:0    LISTENING
```

**Check Swagger**:

```
http://localhost:8080/swagger
Should load without errors
```

**Check CORS**:
Backend needs to allow `http://localhost:5174` origin

---

## 🔐 Port Summary

| Environment | Frontend | Backend | Protocol |
| ----------- | -------- | ------- | -------- |
| Development | 5174     | 8080    | HTTP     |
| Production  | 443      | 443     | HTTPS    |

---

**Status**: ✅ Fixed - Port 8080 với HTTP

**Next**: Restart dev server và test! 🚀
