# Hướng dẫn chuyển Website sang Tiếng Việt và VND

## ✅ Đã hoàn thành

### 1. **Utility Functions** - `src/utils/formatters.js`

Tạo các hàm helper để format tiền tệ và text:

- `formatVND()` - Format số thành tiền VND
- `convertUSDtoVND()` - Chuyển đổi USD sang VND
- `formatCapacity()`, `formatVoltage()`, `formatWarranty()` - Format thông số kỹ thuật
- `translateCondition()`, `translateTag()` - Dịch các label

### 2. **HomePage** - `src/components/home-page/body/HomePageBody.jsx`

#### Mock Data:

✅ Tên sản phẩm: "Pin Tesla Model 3 - 75kWh"
✅ Giá sản phẩm: VND (204,000,000 ₫ thay vì $8,500)
✅ Tình trạng: "Xuất sắc", "Rất tốt", "Tốt", "Khá"
✅ Bảo hành: "2 Năm", "1 Năm", "18 Tháng"
✅ Tags: "Bán chạy nhất", "Giảm giá sốc", "Cao cấp", "Nổi bật", "Đánh giá cao", "Hàng mới về"

#### Stats Section:

- "5,000+" → "Pin đã bán"
- "98%" → "Khách hàng hài lòng"
- "2-3 Years" → "2-3 Năm" - "Bảo hành"
- "24/7" → "Hỗ trợ khách hàng"

#### Categories:

- "Tesla Batteries" → "Pin Tesla" - "250+ sản phẩm"
- "Nissan Batteries" → "Pin Nissan" - "180+ sản phẩm"
- "BMW Batteries" → "Pin BMW" - "120+ sản phẩm"
- "Chevrolet Batteries" → "Pin Chevrolet" - "95+ sản phẩm"

#### Features:

- "Quality Assured" → "Chất lượng đảm bảo"
- "Fast Delivery" → "Giao hàng nhanh"
- "Expert Support" → "Hỗ trợ chuyên nghiệp"
- "Best Price" → "Giá tốt nhất"

#### Sections:

- "Second-Hand EV Battery Marketplace" → "Sàn Giao Dịch Pin Xe Điện Đã Qua Sử Dụng"
- "Browse Batteries" → "Xem sản phẩm"
- "Learn More" → "Tìm hiểu thêm"
- "Featured Batteries" → "Pin nổi bật"
- "Shop by Brand" → "Mua sắm theo thương hiệu"
- "Why Choose Us" → "Tại sao chọn chúng tôi"
- "Ready to Find Your Perfect Battery?" → "Sẵn sàng tìm kiếm pin hoàn hảo?"
- "Get Started" → "Bắt đầu ngay"
- "Contact Us" → "Liên hệ chúng tôi"

#### Filters:

- "Search batteries..." → "Tìm kiếm pin..." + "Tìm"
- "Capacity" → "Dung lượng"
- "Condition" → "Tình trạng"
- "Sort by" → "Sắp xếp"
- "Featured" → "Nổi bật"
- "Price: Low to High" → "Giá: Thấp đến cao"
- "Price: High to Low" → "Giá: Cao đến thấp"
- "Highest Rated" → "Đánh giá cao nhất"
- "Excellent" → "Xuất sắc"
- "Good" → "Tốt"
- "Fair" → "Khá"

#### Product Cards:

- "Save" → "Lưu"
- "View" → "Xem"
- "Buy Now" → "Mua ngay"
- "Capacity:" → "Dung lượng:"
- "Voltage:" → "Điện áp:"
- "Warranty:" → "Bảo hành:"
- "Condition" → "Tình trạng"
- "View All Batteries" → "Xem tất cả sản phẩm"
- Giá hiển thị: `{product.price.toLocaleString('vi-VN')} ₫`

### 3. **Products Page** - `src/pages/products/ProductsPage.jsx`

#### Mock Data:

✅ Tên: "Pin xe điện 1", "Pin xe điện 2", ...
✅ Giá: VND (72,000,000 ₫ - 288,000,000 ₫)
✅ Tình trạng: "Xuất sắc", "Rất tốt", "Tốt", "Khá"
✅ Tags: "Cao cấp", "Bán chạy nhất", "Hàng mới về"

#### Page Elements:

- Breadcrumb: "Home" → "Trang chủ", "Products" → "Sản phẩm"
- "EV Battery Marketplace" → "Sàn Giao Dịch Pin Xe Điện"
- "Find the perfect second-hand EV battery..." → "Tìm kiếm pin xe điện đã qua sử dụng hoàn hảo..."
- "Search Products" → "Tìm kiếm sản phẩm"
- "Search by brand, model..." → "Tìm theo thương hiệu, model hoặc thông số kỹ thuật..."
- "Search" button → "Tìm kiếm"

### 4. **Product Filters** - `src/components/products/ProductFilters/ProductFilters.jsx`

#### Price Range:

✅ Min: 0 VND
✅ Max: 360,000,000 VND (15,000 USD × 24,000)
✅ Step: 12,000,000 VND (500 USD)
✅ Format: `{value / 1000000}tr ₫` (ví dụ: "204tr ₫")
✅ InputNumber với formatter VND

#### Labels:

- "Filters" → "Bộ lọc"
- "X active" → "X đang áp dụng"
- "Price Range" → "Khoảng giá"
- "Capacity (kWh)" → "Dung lượng (kWh)"
- "Brands" → "Thương hiệu"
- "Condition" → "Tình trạng"
  - "Excellent" → "Xuất sắc"
  - "Very Good" → "Rất tốt"
  - "Good" → "Tốt"
  - "Fair" → "Khá"
- "Warranty" → "Bảo hành"
  - "All Warranties" → "Tất cả"
  - "1+ Year" → "1+ Năm"
  - "2+ Years" → "2+ Năm"
  - "3+ Years" → "3+ Năm"
- "Availability" → "Tình trạng hàng"
  - "In Stock Only" → "Chỉ hàng có sẵn"
- "Apply Filters" → "Áp dụng bộ lọc"
- "Reset All" → "Đặt lại tất cả"

### 5. **ProductGrid Component** - `src/components/products/ProductGrid/ProductGrid.jsx`

✅ **Đã hoàn thành:**

- Sort options: "Nổi bật", "Giá: Thấp đến cao", "Giá: Cao đến thấp", "Đánh giá cao nhất", "Mới nhất", "Phổ biến nhất"
- Loading text: "Đang tải sản phẩm..."
- Empty state: "Không tìm thấy sản phẩm"
- Results info: "Hiển thị X - Y trong số Z sản phẩm"
- Pagination: "X-Y trong Z sản phẩm"

### 6. **ProductCard Component** - `src/components/products/ProductCard/ProductCard.jsx`

✅ **Đã hoàn thành:**

- Giá hiển thị VND với format: `price.toLocaleString('vi-VN') ₫`
- Xử lý originalPrice không gây lỗi
- Buttons: "Lưu", "Xem", "Mua ngay"

### 7. **FAQSection Component** - `src/components/products/FAQSection/FAQSection.jsx`

✅ **Đã hoàn thành:**

- Title: "Câu hỏi thường gặp"
- Subtitle: "Tìm câu trả lời cho các câu hỏi thường gặp về mua pin xe điện đã qua sử dụng"
- 10 câu hỏi và câu trả lời đã được dịch sang tiếng Việt
- Contact text: "Vẫn còn thắc mắc?" + "Liên hệ đội ngũ hỗ trợ"

### 8. **Header Component** - `src/components/layout/Header/Header.jsx`

✅ **Đã hoàn thành:**

- Navigation: "Trang chủ", "Sản phẩm", "Danh mục", "Giới thiệu", "Liên hệ"
- User menu: "Hồ sơ", "Cài đặt", "Đăng xuất"
- Cart: "Giỏ hàng", "Giỏ hàng của bạn đang trống"

### 9. **Footer Component** - `src/components/layout/Footer/Footer.jsx`

✅ **Đã hoàn thành:**

- Logo: "⚡ Sàn Giao Dịch Pin EV"
- Description: "Sàn giao dịch đáng tin cậy cho pin xe điện đã qua sử dụng chất lượng cao..."
- Sections: "Liên kết nhanh", "Dịch vụ khách hàng", "Liên hệ"
- Links: "Giới thiệu", "Xem sản phẩm", "Cách hoạt động", "Thông tin bảo hành", "Tin tức"
- Customer Service: "Trung tâm trợ giúp", "Thông tin vận chuyển", "Đổi trả & Hoàn tiền", "Câu hỏi thường gặp", "Hỗ trợ khách hàng"
- Contact: Phone +84, Email lienhe@pinev.com, Address in Vietnamese
- Copyright: "© 2025 Sàn Giao Dịch Pin EV. Bảo lưu mọi quyền."
- Policies: "Chính sách bảo mật", "Điều khoản dịch vụ", "Chính sách Cookie"

### 10. **Auth Components**

#### LoginForm - `src/components/auth/LoginForm/LoginForm.jsx`

✅ **Đã hoàn thành:**

- Title: "Chào mừng trở lại"
- Subtitle: "Đăng nhập vào tài khoản của bạn để tiếp tục"
- Labels: "Tên đăng nhập", "Mật khẩu"
- Placeholders: "Nhập tên đăng nhập của bạn", "Nhập mật khẩu của bạn"
- Checkbox: "Ghi nhớ đăng nhập"
- Links: "Quên mật khẩu?", "Chưa có tài khoản?", "Đăng ký ngay"
- Button: "Đăng nhập"
- Validation messages: "Vui lòng nhập tên đăng nhập!", "Vui lòng nhập mật khẩu!", etc.
- Toast messages: "Đăng nhập thành công!", "Đăng nhập thất bại. Vui lòng thử lại."

#### RegisterForm - `src/components/auth/RegisterForm/RegisterForm.jsx`

✅ **Đã hoàn thành:**

- Title: "Tạo tài khoản"
- Subtitle: "Tham gia để bắt đầu mua pin xe điện chất lượng"
- Labels: "Họ và tên", "Tên đăng nhập", "Email", "Mật khẩu", "Xác nhận mật khẩu"
- Placeholders: "Nhập họ và tên của bạn", "Chọn một tên đăng nhập", "Nhập email của bạn", "Tạo mật khẩu mạnh", "Xác nhận mật khẩu của bạn"
- Checkbox: "Tôi đồng ý với Điều khoản và Điều kiện"
- Links: "Đã có tài khoản?", "Đăng nhập tại đây"
- Button: "Tạo tài khoản"
- Validation messages:
  - "Vui lòng nhập họ và tên!"
  - "Họ và tên phải có ít nhất 2 ký tự!"
  - "Vui lòng nhập tên đăng nhập!"
  - "Tên đăng nhập phải có ít nhất 3 ký tự!"
  - "Tên đăng nhập chỉ có thể chứa chữ cái, số và dấu gạch dưới!"
  - "Vui lòng nhập email!"
  - "Vui lòng nhập địa chỉ email hợp lệ!"
  - "Vui lòng nhập mật khẩu!"
  - "Mật khẩu phải có ít nhất 6 ký tự!"
  - "Mật khẩu phải chứa chữ hoa, chữ thường và số!"
  - "Vui lòng xác nhận mật khẩu!"
  - "Mật khẩu không khớp!"
  - "Bạn phải chấp nhận điều khoản và điều kiện"
- Toast messages: "Tạo tài khoản thành công!", "Đăng ký thất bại. Vui lòng thử lại."

## 💱 Tỷ giá USD to VND

**Rate sử dụng: 1 USD = 24,000 VND**

### Bảng chuyển đổi giá thông dụng:

| USD     | VND           |
| ------- | ------------- |
| $100    | 2,400,000 ₫   |
| $500    | 12,000,000 ₫  |
| $1,000  | 24,000,000 ₫  |
| $3,000  | 72,000,000 ₫  |
| $5,000  | 120,000,000 ₫ |
| $8,500  | 204,000,000 ₫ |
| $10,000 | 240,000,000 ₫ |
| $15,000 | 360,000,000 ₫ |

## 🎯 Format VND

### Hiển thị đầy đủ:

```javascript
price.toLocaleString("vi-VN") + " ₫";
// Ví dụ: "204,000,000 ₫"
```

### Hiển thị rút gọn (triệu):

```javascript
(price / 1000000).toFixed(0) + "tr ₫";
// Ví dụ: "204tr ₫"
```

### Hiển thị rút gọn (tỷ):

```javascript
(price / 1000000000).toFixed(1) + "tỷ ₫";
// Ví dụ: "0.2tỷ ₫"
```

## 🔧 Testing Checklist

- [ ] HomePage hiển thị đúng tiếng Việt
- [ ] Giá sản phẩm hiển thị VND format đẹp
- [ ] Products page tất cả text tiếng Việt
- [ ] Filters hoạt động với giá VND
- [ ] Sort options bằng tiếng Việt
- [ ] ProductCard hiển thị giá VND
- [ ] FAQ section tiếng Việt
- [ ] Header navigation tiếng Việt
- [ ] Footer tiếng Việt
- [ ] Login/Register form tiếng Việt
- [ ] Validation messages tiếng Việt
- [ ] Toast notifications tiếng Việt

## 📱 Responsive Testing

- [ ] Mobile view - text hiển thị đủ không gian
- [ ] Tablet view - layout cân đối
- [ ] Desktop view - professional appearance

## 🌐 SEO Considerations

Cập nhật các meta tags trong `index.html`:

```html
<title>Sàn Giao Dịch Pin Xe Điện Đã Qua Sử Dụng</title>
<meta
  name="description"
  content="Mua bán pin xe điện đã qua sử dụng chất lượng cao, giá tốt nhất thị trường. Bảo hành 2-3 năm, giao hàng toàn quốc."
/>
<meta
  name="keywords"
  content="pin xe điện, pin tesla, pin nissan, pin bmw, mua pin cũ, pin xe điện cũ"
/>
<html lang="vi"></html>
```

## 🎨 UI/UX Notes

1. **Giá tiền VND** rất dài, đảm bảo:

   - Card có đủ width
   - Font size phù hợp
   - Line height tránh bị cắt

2. **Text tiếng Việt** dài hơn tiếng Anh:

   - Buttons cần width linh hoạt
   - Labels cần space đủ
   - Mobile view test kỹ

3. **Currency symbol**: Sử dụng `₫` (Unicode U+20AB)

## 📚 Resources

- [Vietnamese Locale - Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [Ant Design i18n](https://ant.design/docs/react/i18n)
- [React i18next](https://react.i18next.com/) - Để scale lớn hơn

## 🚀 Next Steps

1. Hoàn thành các component còn lại theo checklist
2. Test toàn bộ user flows
3. Cập nhật validation messages
4. Thêm error messages tiếng Việt
5. Consider thêm locale switcher (VI/EN) cho tương lai
