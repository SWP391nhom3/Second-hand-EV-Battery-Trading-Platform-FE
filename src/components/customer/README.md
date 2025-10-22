# Customer Dashboard Component

## Mô tả

Component Customer Dashboard hiển thị tất cả thông tin của khách hàng trong một giao diện chuyên nghiệp với layout hợp lý và màu sắc đẹp mắt.

## Tính năng

### 1. **Welcome Banner**

- Hiển thị thông tin cá nhân
- Avatar và tên người dùng
- Hạng thành viên (Đồng, Bạc, Vàng, Kim Cương)
- Điểm tích lũy và đánh giá

### 2. **Thống kê tổng quan** (4 Cards)

- 📊 Tổng tin đăng
- 👁️ Lượt xem
- ❤️ Lượt thích
- ✅ Giao dịch thành công

### 3. **Gói hiện tại**

- Số bài đăng còn lại
- Progress bar hiển thị trực quan
- Thời gian còn lại
- Nút gia hạn/nâng cấp

### 4. **Tin đăng nổi bật**

- Top 3 tin đăng có hiệu suất cao nhất
- Hiển thị lượt xem, lượt thích
- Trạng thái: Đang bán/Đã bán

### 5. **Hoạt động gần đây**

- Timeline hiển thị các hoạt động
- Đăng tin mới
- Tin nhắn
- Giao dịch

### 6. **Hiệu suất**

- Tỷ lệ phản hồi (Progress bar)
- Đánh giá (Rating stars)
- Thời gian phản hồi trung bình
- Gợi ý cải thiện

### 7. **Thành tích**

- Badge hệ thống
- Người bán uy tín
- Phản hồi nhanh
- Sao vàng
- VIP Member

### 8. **Hành động nhanh**

- Đăng tin mới
- Tin nhắn
- Thông báo
- Cài đặt

### 9. **Tips Card**

- Mẹo bán hàng hiệu quả

## Màu sắc chuyên nghiệp

- **Primary**: #667eea (Gradient purple)
- **Success**: #52c41a (Green)
- **Warning**: #faad14 (Orange)
- **Danger**: #ff4d4f (Red)
- **Info**: #1890ff (Blue)
- **Gold**: #FFD700
- **Silver**: #C0C0C0
- **Bronze**: #CD7F32

## Responsive Design

- ✅ Desktop (>1200px): Full layout 3 columns
- ✅ Tablet (768-1199px): 2 columns
- ✅ Mobile (<768px): 1 column, stack layout

## Animation Effects

- Fade in up animation
- Hover effects
- Card transitions
- Progress animations

## Cách sử dụng

### 1. Truy cập trực tiếp

```
http://localhost:5174/customer
```

### 2. Import vào component khác

```jsx
import { CustomerDashboard } from "../../components/customer";

function MyPage() {
  return <CustomerDashboard />;
}
```

### 3. Customize data

Thay đổi `customerData` object trong component để hiển thị dữ liệu thực từ API:

```jsx
const customerData = {
  profile: { ... },
  stats: { ... },
  currentPackage: { ... },
  // ... more data
};
```

## Tech Stack

- **React 19.1.1**
- **Ant Design 5.27.4** - UI Components
- **CSS Modules** - Styling
- **React Router 7.9.4** - Routing

## Các thành phần Ant Design được sử dụng

- Card
- Row/Col (Grid System)
- Statistic
- Progress
- Timeline
- List
- Avatar
- Badge
- Tag
- Button
- Space
- Typography
- Divider
- Rate
- Tooltip

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Performance

- Lightweight (~50KB gzipped)
- Lazy loading ready
- Optimized animations
- CSS modules for scoped styles

## Next Steps / Improvements

1. **Connect to API**: Replace mock data với real API calls
2. **Add filtering**: Filter activities, posts by date/status
3. **Real-time updates**: WebSocket cho notifications
4. **Export data**: PDF/Excel export functionality
5. **Dark mode**: Toggle theme support
6. **Internationalization**: Multi-language support
7. **Charts**: Add visualization với Chart.js hoặc Recharts
8. **Mobile app**: React Native version

## Screenshots

### Desktop View

- Welcome banner với gradient background
- 4 statistic cards với icons màu sắc
- Package status card với progress bar
- Top posts list với actions
- Timeline activities
- Performance metrics
- Achievement badges
- Quick actions buttons

### Mobile View

- Stack layout
- Touch-friendly buttons
- Responsive grid
- Optimized spacing

---

**Created by**: Your Team
**Last Updated**: October 23, 2025
**Version**: 1.0.0
