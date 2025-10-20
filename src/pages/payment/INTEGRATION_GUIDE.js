// ============================================
// HƯỚNG DẪN TÍCH HỢP THANH TOÁN
// ============================================

/**
 * Trang thanh toán (/payment) hỗ trợ 2 loại:
 * 1. Thanh toán gói đăng tin (từ /packages)
 * 2. Thanh toán sản phẩm pin (từ /products)
 */

// ============================================
// 1. THANH TOÁN GÓI ĐĂNG TIN (ĐÃ TÍCH HỢP)
// ============================================
// File: src/pages/packages/PackagesPage.jsx
/*
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const handlePurchase = (values) => {
  navigate("/payment", {
    state: {
      type: "package",                    // Loại: gói đăng tin
      package: {
        id: 3,
        name: "Gói Vàng",
        price: 499000,
        duration: "1 tháng",
        features: [
          "30 tin đăng/tháng",
          "Hiển thị 30 ngày",
          "Huy hiệu Vàng"
        ],
      },
      userData: values,                   // Thông tin từ form
    },
  });
};
*/

// ============================================
// 2. THANH TOÁN SẢN PHẨM PIN (CẦN TÍCH HỢP)
// ============================================
// File: src/pages/products/ProductsPage.jsx hoặc ProductDetailModal.jsx
/*
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const handleBuyProduct = (product, quantity = 1) => {
  navigate("/payment", {
    state: {
      type: "product",                    // Loại: sản phẩm
      product: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        capacity: product.capacity,
        condition: product.condition,
        price: product.price,
        image: product.image,
        // Thông tin người bán (nếu có)
        seller: product.seller,
      },
      quantity: quantity,                 // Số lượng sản phẩm
    },
  });
};
*/

// ============================================
// VÍ DỤ TÍCH HỢP VÀO PRODUCT DETAIL MODAL
// ============================================
/*
// File: src/components/products/ProductDetailModal/ProductDetailModal.jsx

import { useNavigate } from "react-router-dom";

const ProductDetailModal = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleBuyNow = () => {
    // Đóng modal trước
    onClose();
    
    // Chuyển đến trang thanh toán
    navigate("/payment", {
      state: {
        type: "product",
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          capacity: product.capacity,
          voltage: product.voltage,
          condition: product.condition,
          price: product.price,
          image: product.image,
          warranty: product.warranty,
          seller: product.seller,
          location: product.location,
        },
        quantity: quantity,
      },
    });
  };

  return (
    <Modal>
      // ... UI code ...
      
      <Button 
        type="primary" 
        size="large"
        onClick={handleBuyNow}
      >
        Mua ngay
      </Button>
    </Modal>
  );
};
*/

// ============================================
// VÍ DỤ TÍCH HỢP VÀO PRODUCT CARD
// ============================================
/*
// File: src/components/products/ProductCard/ProductCard.jsx

import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleQuickBuy = (e) => {
    e.stopPropagation(); // Ngăn không cho mở modal detail
    
    navigate("/payment", {
      state: {
        type: "product",
        product: {
          id: product.id,
          name: product.name,
          brand: product.brand,
          capacity: product.capacity,
          condition: product.condition,
          price: product.price,
          image: product.image,
          seller: product.seller,
        },
        quantity: 1,
      },
    });
  };

  return (
    <Card>
      // ... UI code ...
      
      <Button onClick={handleQuickBuy}>
        Mua nhanh
      </Button>
    </Card>
  );
};
*/

// ============================================
// TỔNG KẾT
// ============================================
/*
TRANG THANH TOÁN SẼ TỰ ĐỘNG XỬ LÝ:

1. Hiển thị thông tin phù hợp:
   - Gói đăng tin: Hiển thị features, duration
   - Sản phẩm: Hiển thị brand, capacity, condition, quantity

2. Nút "Quay lại":
   - Gói đăng tin: Quay về /packages
   - Sản phẩm: Quay về /products

3. Thông báo thành công:
   - Gói đăng tin: "Gói sẽ được kích hoạt trong 5-10 phút"
   - Sản phẩm: "Đơn hàng được xác nhận trong 24h, sẽ kết nối với người bán"

4. Tính toán giá:
   - Tự động tính VAT 10%
   - Hỗ trợ quantity cho sản phẩm
   - Hiển thị tổng tiền cuối cùng
*/

export default {};
