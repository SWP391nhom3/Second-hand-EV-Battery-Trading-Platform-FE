# File Naming Convention & Structure

## 📁 Cấu trúc thư mục sau khi refactor

### 1. Pages (src/pages/)

Mỗi page có file chính được đặt tên theo format `[PageName]Page.jsx`:

```
pages/
├── home/
│   └── HomePage.jsx
├── login/
│   └── LoginPage.jsx
├── register/
│   └── RegisterPage.jsx
├── products/
│   └── ProductsPage.jsx
└── index.js (barrel export)
```

**Quy tắc đặt tên:**

- Format: `[Feature]Page.jsx`
- Ví dụ: `HomePage.jsx`, `LoginPage.jsx`, `ProductsPage.jsx`
- Suffix "Page" giúp phân biệt rõ ràng với components

### 2. Components (src/components/)

#### Layout Components (src/components/layout/)

```
layout/
├── Header/
│   ├── Header.jsx
│   └── Header.module.css
├── Footer/
│   ├── Footer.jsx
│   └── Footer.module.css
├── AuthLayout/
│   ├── AuthLayout.jsx
│   └── AuthLayout.module.css
└── index.js (barrel export)
```

#### Auth Components (src/components/auth/)

```
auth/
├── LoginForm/
│   ├── LoginForm.jsx
│   └── LoginForm.module.css
├── RegisterForm/
│   ├── RegisterForm.jsx
│   └── RegisterForm.module.css
└── index.js (barrel export)
```

#### Products Components (src/components/products/)

```
products/
├── ProductCard/
│   ├── ProductCard.jsx
│   └── ProductCard.module.css
├── ProductFilters/
│   ├── ProductFilters.jsx
│   └── ProductFilters.module.css
├── ProductGrid/
│   ├── ProductGrid.jsx
│   └── ProductGrid.module.css
├── FAQSection/
│   ├── FAQSection.jsx
│   └── FAQSection.module.css
└── index.js (barrel export)
```

#### Other Components

```
components/
├── home-page/
│   └── body/
│       ├── HomePageBody.jsx
│       └── index.css
└── dashboard/
    └── Dashboard.jsx
```

**Quy tắc đặt tên:**

- Tên file component trùng với tên thư mục
- Format: `ComponentName.jsx`
- CSS Modules: `ComponentName.module.css`
- Không dùng `index.jsx` nữa để dễ phân biệt khi mở nhiều file

## 🔄 Import Examples

### Trước khi refactor (khó phân biệt):

```jsx
// Khi mở nhiều file index.jsx, rất khó biết đang ở file nào
import HomePage from "./pages/home"; // ❌ Không rõ ràng
import LoginPage from "./pages/login"; // ❌ Không rõ ràng
import Header from "./components/layout/Header"; // ❌ Không rõ ràng
```

### Sau khi refactor (rõ ràng):

```jsx
// Tên file hiển thị rõ ràng trong tab editor
import HomePage from "./pages/home/HomePage"; // ✅ Rõ ràng
import LoginPage from "./pages/login/LoginPage"; // ✅ Rõ ràng
import Header from "./components/layout/Header/Header"; // ✅ Rõ ràng
```

### Sử dụng Barrel Exports (recommended):

```jsx
// App.jsx
import { HomePage, LoginPage, RegisterPage, ProductsPage } from "./pages";
import { Header, Footer, AuthLayout } from "./components/layout";
import { LoginForm, RegisterForm } from "./components/auth";
import {
  ProductCard,
  ProductFilters,
  ProductGrid,
  FAQSection,
} from "./components/products";
```

## ✅ Lợi ích của việc đổi tên

### 1. **Dễ phân biệt trong Editor**

- Trước: 10 tab đều hiển thị "index.jsx" 😵
- Sau: Mỗi tab hiển thị tên riêng "Header.jsx", "LoginPage.jsx" 😊

### 2. **Search & Navigation tốt hơn**

- Tìm kiếm "Header" sẽ dẫn trực tiếp đến `Header.jsx`
- Không bị nhầm lẫn giữa nhiều file `index.jsx`

### 3. **Git History rõ ràng**

- Git diff hiển thị tên file cụ thể
- Dễ theo dõi thay đổi của từng component

### 4. **Onboarding dễ dàng**

- Dev mới dễ hiểu cấu trúc project
- Tên file tự document mục đích của nó

### 5. **Refactoring an toàn**

- IDE autocomplete chính xác hơn
- Rename/Move file ít bị lỗi

## 📋 Import Path Mapping

| Component      | Old Path                               | New Path                                              |
| -------------- | -------------------------------------- | ----------------------------------------------------- |
| HomePage       | `./pages/home`                         | `./pages/home/HomePage`                               |
| LoginPage      | `./pages/login`                        | `./pages/login/LoginPage`                             |
| RegisterPage   | `./pages/register`                     | `./pages/register/RegisterPage`                       |
| ProductsPage   | `./pages/products`                     | `./pages/products/ProductsPage`                       |
| Header         | `./components/layout/Header`           | `./components/layout/Header/Header`                   |
| Footer         | `./components/layout/Footer`           | `./components/layout/Footer/Footer`                   |
| AuthLayout     | `./components/layout/AuthLayout`       | `./components/layout/AuthLayout/AuthLayout`           |
| LoginForm      | `./components/auth/LoginForm`          | `./components/auth/LoginForm/LoginForm`               |
| RegisterForm   | `./components/auth/RegisterForm`       | `./components/auth/RegisterForm/RegisterForm`         |
| ProductCard    | `./components/products/ProductCard`    | `./components/products/ProductCard/ProductCard`       |
| ProductFilters | `./components/products/ProductFilters` | `./components/products/ProductFilters/ProductFilters` |
| ProductGrid    | `./components/products/ProductGrid`    | `./components/products/ProductGrid/ProductGrid`       |
| FAQSection     | `./components/products/FAQSection`     | `./components/products/FAQSection/FAQSection`         |
| HomePageBody   | `./components/home-page/body`          | `./components/home-page/body/HomePageBody`            |
| Dashboard      | `./components/dashboard`               | `./components/dashboard/Dashboard`                    |

## 🎯 Best Practices

### 1. **Tạo component mới:**

```bash
# Tạo thư mục và file component
mkdir src/components/NewComponent
touch src/components/NewComponent/NewComponent.jsx
touch src/components/NewComponent/NewComponent.module.css
```

### 2. **Template cho component mới:**

```jsx
// NewComponent.jsx
import React from "react";
import styles from "./NewComponent.module.css";

const NewComponent = () => {
  return <div className={styles.container}>{/* Component content */}</div>;
};

export default NewComponent;
```

### 3. **Thêm vào barrel export:**

```javascript
// src/components/category/index.js
export { default as NewComponent } from "./NewComponent/NewComponent";
```

### 4. **Import trong component khác:**

```jsx
// Option 1: Direct import
import NewComponent from "../../components/category/NewComponent/NewComponent";

// Option 2: Barrel export (recommended)
import { NewComponent } from "../../components/category";
```

## 🔍 Troubleshooting

### Lỗi: Cannot find module

**Nguyên nhân:** Import path chưa được cập nhật

**Giải pháp:**

1. Kiểm tra tên file mới (không còn `index.jsx`)
2. Cập nhật import path theo bảng mapping trên
3. Hoặc sử dụng barrel exports

### Lỗi: Hot reload không hoạt động

**Giải pháp:** Restart dev server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## 📝 Notes

- **Không xóa** file `index.js` (barrel exports) - đây là file khác với `index.jsx`
- **CSS Modules** vẫn giữ nguyên convention: `ComponentName.module.css`
- **Barrel exports** (`index.js`) giúp import cleaner nhưng vẫn giữ được lợi ích của việc đổi tên file component
- Khi add component mới, nhớ update barrel export file (`index.js`)
