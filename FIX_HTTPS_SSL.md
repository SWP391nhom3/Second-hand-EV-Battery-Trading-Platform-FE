# 🔐 Fix HTTPS SSL Certificate Error

## 🎯 Issue: Backend đang dùng HTTPS với Self-Signed Certificate

Nếu backend của bạn đang chạy trên **`https://localhost:8080`** với **self-signed certificate**, browser sẽ block request vì không tin tưởng certificate.

---

## ✅ Solution Options

### Option 1: Trust Certificate trong Browser (RECOMMENDED for Dev)

#### Chrome/Edge:

1. Navigate trực tiếp đến backend:

   ```
   https://localhost:8080/swagger
   ```

2. Browser sẽ hiện warning:

   ```
   "Your connection is not private"
   NET::ERR_CERT_AUTHORITY_INVALID
   ```

3. Click **"Advanced"** → **"Proceed to localhost (unsafe)"**

4. Certificate sẽ được trust → Frontend có thể gọi API

5. Reload frontend page và test login lại

---

### Option 2: Export và Install Certificate

#### Windows:

```bash
# 1. Export certificate từ backend
# 2. Double click .cer file
# 3. Install Certificate → Local Machine
# 4. Place in "Trusted Root Certification Authorities"
# 5. Restart browser
```

---

### Option 3: Disable SSL Verification (Development Only)

#### Vite Config (vite.config.js):

```javascript
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:8080",
        changeOrigin: true,
        secure: false, // ⚠️ Disable SSL verification
      },
    },
  },
});
```

#### Update axios.js:

```javascript
const apiBaseURL = import.meta.env.DEV
  ? "/api" // Use proxy in dev
  : "https://api.yourdomain.com"; // Direct in prod
```

---

### Option 4: Use HTTP in Development

Nếu không cần HTTPS trong dev:

#### Backend (Program.cs hoặc launchSettings.json):

```json
{
  "profiles": {
    "http": {
      "applicationUrl": "http://localhost:8080"
    }
  }
}
```

#### Frontend (.env):

```bash
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🧪 Debug SSL Issues

### 1. Check Certificate Status

```bash
# Chrome DevTools → Security Tab
# Check:
# - Certificate valid?
# - Certificate trusted?
# - Any errors?
```

### 2. Test Backend Directly

```bash
# Navigate to:
https://localhost:8080/swagger

# Should see:
# ✅ Swagger UI (if cert trusted)
# ❌ SSL error (if cert not trusted)
```

### 3. Check Network Tab

```javascript
// Look for errors:
// - net::ERR_CERT_AUTHORITY_INVALID
// - net::ERR_CERT_COMMON_NAME_INVALID
// - net::ERR_SSL_PROTOCOL_ERROR
```

---

## 📊 Common SSL Errors

### Error 1: ERR_CERT_AUTHORITY_INVALID

**Cause**: Self-signed certificate not trusted
**Fix**: Option 1 (Trust in browser) hoặc Option 2 (Install cert)

### Error 2: ERR_CERT_COMMON_NAME_INVALID

**Cause**: Certificate issued for different domain
**Fix**: Regenerate cert với CN=localhost

### Error 3: Mixed Content Error

**Cause**: HTTPS page loading HTTP resources
**Fix**: Ensure all resources use HTTPS

### Error 4: CORS + SSL Combined

**Cause**: Both CORS và SSL issues
**Fix**: Trust cert first, then fix CORS

---

## 🔧 Recommended Setup for Development

### Setup A: Full HTTPS (như Production)

```bash
Frontend:  https://localhost:5173 (với Vite HTTPS)
Backend:   https://localhost:8080 (với SSL cert)
Trust:     Certificate phải được trust
```

### Setup B: Mixed (Frontend HTTP, Backend HTTPS)

```bash
Frontend:  http://localhost:5174
Backend:   https://localhost:8080
Issue:     Mixed content warning
Solution:  Trust backend cert trước
```

### Setup C: Full HTTP (Simplest for Dev)

```bash
Frontend:  http://localhost:5174
Backend:   http://localhost:8080
No SSL:    No certificate issues
Best:      For local development
```

---

## 🎯 Quick Fix Steps

### For HTTPS Backend:

1. **Trust Certificate**:

   ```
   Navigate: https://localhost:8080/swagger
   Click: Advanced → Proceed to localhost
   ```

2. **Restart Dev Server**:

   ```bash
   Ctrl + C
   npm run dev
   ```

3. **Test Login**:
   ```
   Should work now! ✅
   ```

---

## 🔍 Verify Current Setup

```javascript
// Paste in Console (F12)

// 1. Check current API URL
console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

// 2. Test direct fetch
fetch("https://localhost:8080/api/Post")
  .then((r) => console.log("✅ Status:", r.status))
  .catch((e) => {
    console.error("❌ Error:", e);
    if (e.message.includes("certificate")) {
      console.log("🔐 SSL Certificate issue detected!");
      console.log(
        "👉 Navigate to https://localhost:8080/swagger and trust cert"
      );
    }
  });
```

---

## 📝 Current Status

**Files Restored**:

- ✅ `.env` → `https://localhost:8080`
- ✅ `axios.js` → `https://localhost:8080`
- ✅ `LoginForm.jsx` → Endpoint `/api/Auth/login`

**Next Steps**:

1. Navigate to `https://localhost:8080/swagger`
2. Trust the certificate
3. Reload frontend
4. Test login

---

## ⚠️ Important Notes

### Development:

- Self-signed certs are OK
- Must be manually trusted
- Each browser needs separate trust

### Production:

- Use valid SSL certificate (Let's Encrypt, etc.)
- No trust issues
- Works automatically

---

**Status**: ✅ HTTPS Restored

**Next**: Trust certificate trong browser! 🔐
