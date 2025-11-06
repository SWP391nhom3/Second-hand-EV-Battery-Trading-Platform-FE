import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  Row,
  Col,
  Image,
  Button,
  Tag,
  Rate,
  Divider,
  Descriptions,
  Avatar,
  Space,
  InputNumber,
  Tabs,
  List,
  Typography,
  Progress,
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MessageOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  FireOutlined,
  StarOutlined,
} from '@ant-design/icons';
import styles from './ProductDetailModal.module.css';

const { Title, Text, Paragraph } = Typography;

const ProductDetailModal = ({ visible, product, onClose, onAddToCart }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const {
    id,
    name,
    brand,
    price,
    originalPrice,
    image,
    capacity,
    voltage,
    condition,
    warranty,
    rating,
    reviews,
    seller,
    batteryHealth,
    usageYears,
    location,
    postedDate,
    membershipLevel,
    tag,
    inStock = true,
    category, // 'battery', 'motorcycle', 'car', 'vehicle'
    description, // Mô tả thực từ user
    cycleCount, // Số chu kỳ pin
    manufactureYear, // Năm sản xuất
    model, // Model xe (cho vehicle)
    mileageKm, // Số km đã đi (cho vehicle)
    contactInfo, // Thông tin liên hệ thực
    status, // Trạng thái bài đăng
    package: packageInfo, // Package information
    packageSubscription, // Package subscription details
  } = product;

  // Kiểm tra xem sản phẩm có phải xe máy hoặc ô tô không
  const isVehicle = category === 'motorcycle' || category === 'car' || category === 'vehicle';

  // Get images from product data and filter out empty values
  const images = (product.images || [image]).filter(Boolean);

  const getMembershipColor = (level) => {
    switch (level) {
      case 4:
        return { color: '#667eea', icon: '💎', label: 'Kim cương' };
      case 3:
        return { color: '#f093fb', icon: '🥇', label: 'Vàng' };
      case 2:
        return { color: '#4facfe', icon: '🥈', label: 'Bạc' };
      case 1:
        return { color: '#fa709a', icon: '🥉', label: 'Đồng' };
      default:
        return { color: '#888', icon: '', label: '' };
    }
  };

  const membershipInfo = getMembershipColor(membershipLevel);

  const handleAddToCart = () => {
    // Ngăn không cho xe máy/ô tô được thêm vào giỏ
    if (isVehicle) {
      Modal.warning({
        title: 'Không thể thêm vào giỏ hàng',
        content: 'Sản phẩm xe máy và ô tô điện cần liên hệ trực tiếp. Vui lòng nhấn "Để lại thông tin" để chúng tôi hỗ trợ bạn.',
      });
      return;
    }
    
    // Mặc định số lượng = 1 cho sản phẩm pin/xe điện (hàng unique)
    onAddToCart({ ...product, quantity: 1 });
    Modal.success({
      title: 'Thành công!',
      content: `Đã thêm sản phẩm vào giỏ hàng`,
    });
  };

  const handleBuyNow = () => {
    // Đóng modal trước
    onClose();
    
    // Nếu là xe máy hoặc ô tô, chuyển đến trang để lại thông tin
    if (isVehicle) {
      navigate(`/contact-vehicle/${id}`, {
        state: {
          product: {
            id,
            name,
            price,
            image,
            brand,
            category,
          }
        }
      });
    } else {
      // Nếu là pin, chuyển đến trang thanh toán
      navigate('/payment', {
        state: {
          type: 'product',
          product: {
            id,
            name,
            brand,
            capacity,
            voltage,
            condition,
            price,
            image,
            warranty,
            seller,
            location,
            batteryHealth,
            usageYears,
          },
          quantity: 1, // Mặc định 1 cho sản phẩm unique
        },
      });
    }
  };

  const handleContactSeller = () => {
    if (!seller) {
      Modal.warning({
        title: 'Không có thông tin',
        content: 'Thông tin người bán chưa sẵn sàng',
      });
      return;
    }

    Modal.info({
      title: 'Liên hệ người bán',
      content: (
        <div>
          {seller?.name && <p><strong>Tên:</strong> {seller.name}</p>}
          {contactInfo && <p><strong>Liên hệ:</strong> {contactInfo}</p>}
          {seller?.phone && <p><strong>Điện thoại:</strong> {seller.phone}</p>}
          {seller?.email && <p><strong>Email:</strong> {seller.email}</p>}
          {seller?.address && <p><strong>Địa chỉ:</strong> {seller.address}</p>}
        </div>
      ),
    });
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1200}
      className={styles.productModal}
      centered
    >
      <Row gutter={[32, 32]}>
        {/* Left Side - Images */}
        <Col xs={24} md={12}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              {images.length > 0 ? (
                <Image
                  src={images[selectedImage]}
                  alt={name}
                  width="100%"
                  height={400}
                  style={{ objectFit: 'cover', borderRadius: '12px' }}
                />
              ) : (
                <div className={styles.imagePlaceholderModal} style={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: '#fafafa' }}>
                  <ThunderboltOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                </div>
              )}
              {membershipLevel && (
                <div
                  className={styles.membershipBadge}
                  style={{ background: membershipInfo.color }}
                >
                  {membershipInfo.icon} {tag}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={`${styles.thumbnail} ${
                      selectedImage === index ? styles.activeThumbnail : ''
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>

        {/* Right Side - Details */}
        <Col xs={24} md={12}>
          <div className={styles.detailSection}>
            {/* Seller Info */}
            {seller && (
              <div className={styles.sellerCard}>
                <Avatar size={48} icon={<UserOutlined />} src={seller?.avatar} />
                <div className={styles.sellerInfo}>
                  <Text strong style={{ fontSize: '16px' }}>
                    {seller?.name}
                  </Text>
                  {seller?.rating && (
                    <div className={styles.sellerMeta}>
                      <Rate disabled defaultValue={seller.rating} style={{ fontSize: 12 }} />
                      {seller?.totalSales !== undefined && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          ({seller.totalSales} giao dịch)
                        </Text>
                      )}
                    </div>
                  )}
                  {location && (
                    <div className={styles.sellerLocation}>
                      <EnvironmentOutlined />
                      <Text type="secondary">{location}</Text>
                    </div>
                  )}
                </div>
                <Space direction="vertical" size="small">
                  <Button
                    icon={<PhoneOutlined />}
                    size="small"
                    type="primary"
                    onClick={handleContactSeller}
                  >
                    Gọi
                  </Button>
                  <Button icon={<MessageOutlined />} size="small">
                    Chat
                  </Button>
                </Space>
              </div>
            )}

            <Divider />

            {/* Package Information - Simplified */}
            {packageInfo && (
              <>
                <div className={styles.packageSection}>
                  <div className={styles.packageHeader}>
                    <Text strong style={{ fontSize: 18, color: '#faad14' }}>
                      � Gói đăng tin
                    </Text>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <Tag 
                      color="gold"
                      icon={<CheckCircleOutlined />}
                      style={{ 
                        fontSize: 15, 
                        padding: '6px 16px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        border: '2px solid #faad14',
                        boxShadow: '0 4px 12px rgba(250, 173, 20, 0.3)'
                      }}
                    >
                      👑 {packageInfo.name}
                    </Tag>
                  </div>
                </div>
                <Divider />
              </>
            )}

            {/* Product Title */}
            <div className={styles.titleSection}>
              {brand && <Tag color="blue">{brand}</Tag>}
              <Title level={3} style={{ margin: '8px 0' }}>
                {name}
              </Title>
              <Space>
                {rating !== undefined && rating !== null && (
                  <>
                    <Rate disabled defaultValue={rating} allowHalf style={{ fontSize: 16 }} />
                    {reviews !== undefined && reviews !== null && (
                      <Text type="secondary">({reviews} đánh giá)</Text>
                    )}
                  </>
                )}
                {postedDate && (
                  <>
                    <Divider type="vertical" />
                    <ClockCircleOutlined />
                    <Text type="secondary">{postedDate}</Text>
                  </>
                )}
              </Space>
            </div>

            <Divider />

            {/* Price */}
            <div className={styles.priceSection}>
              <div className={styles.currentPrice}>
                {price?.toLocaleString('vi-VN')}₫
              </div>
              {originalPrice && originalPrice > price && (
                <div className={styles.priceRow}>
                  <Text delete type="secondary" style={{ fontSize: 16 }}>
                    {originalPrice?.toLocaleString('vi-VN')}₫
                  </Text>
                  <Tag color="red" style={{ marginLeft: 8 }}>
                    Giảm {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                  </Tag>
                </div>
              )}
            </div>

            <Divider />

            {/* Battery Health */}
            {batteryHealth && (
              <div className={styles.healthSection}>
                <div className={styles.healthHeader}>
                  <SafetyOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  <Text strong style={{ fontSize: 16 }}>
                    Tình trạng pin
                  </Text>
                </div>
                <div className={styles.healthBar}>
                  <Text>Độ khỏe pin:</Text>
                  <Progress
                    percent={batteryHealth}
                    strokeColor={{
                      '0%': '#52c41a',
                      '100%': '#73d13d',
                    }}
                    style={{ flex: 1, margin: '0 12px' }}
                  />
                  <Text strong>{batteryHealth}%</Text>
                </div>
                {condition && (
                  <Tag
                    color={
                      condition === 'Như mới'
                        ? 'green'
                        : condition === 'Tốt'
                        ? 'blue'
                        : 'orange'
                    }
                    style={{ marginTop: 8 }}
                  >
                    {condition}
                  </Tag>
                )}
              </div>
            )}

            <Divider />

            {/* Specifications */}
            <Descriptions column={2} size="small" bordered>
              {capacity && (
                <Descriptions.Item
                  label={
                    <>
                      <ThunderboltOutlined /> Dung lượng
                    </>
                  }
                >
                  <Text strong>{capacity} kWh</Text>
                </Descriptions.Item>
              )}
              {voltage && (
                <Descriptions.Item
                  label={
                    <>
                      <SafetyOutlined /> Điện áp
                    </>
                  }
                >
                  <Text strong>{voltage}V</Text>
                </Descriptions.Item>
              )}
              {(usageYears || manufactureYear) && (
                <Descriptions.Item
                  label={
                    <>
                      <CalendarOutlined /> {manufactureYear ? 'Năm sản xuất' : 'Thời gian sử dụng'}
                    </>
                  }
                >
                  <Text strong>{manufactureYear || `${usageYears} năm`}</Text>
                </Descriptions.Item>
              )}
              {cycleCount !== undefined && cycleCount !== null && (
                <Descriptions.Item
                  label={
                    <>
                      <ThunderboltOutlined /> Số chu kỳ
                    </>
                  }
                >
                  <Text strong>{cycleCount} lần</Text>
                </Descriptions.Item>
              )}
              {mileageKm && (
                <Descriptions.Item
                  label={
                    <>
                      <CalendarOutlined /> Số km đã đi
                    </>
                  }
                >
                  <Text strong>{mileageKm.toLocaleString('vi-VN')} km</Text>
                </Descriptions.Item>
              )}
              {model && (
                <Descriptions.Item
                  label={
                    <>
                      <CheckCircleOutlined /> Model
                    </>
                  }
                >
                  <Text strong>{model}</Text>
                </Descriptions.Item>
              )}
              {warranty && (
                <Descriptions.Item
                  label={
                    <>
                      <CheckCircleOutlined /> Bảo hành
                    </>
                  }
                >
                  <Text strong>{warranty} tháng</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            {/* Actions */}
            <div className={styles.actionSection}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  {!isVehicle && (
                    <Button
                      type="default"
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleAddToCart}
                      disabled={!inStock}
                      style={{ 
                        width: 'calc(50% - 6px)',
                        minWidth: 'calc(50% - 6px)',
                        maxWidth: 'calc(50% - 6px)',
                        flex: 'none',
                        height: 50, 
                        fontSize: 16, 
                        fontWeight: 600,
                        borderColor: '#1890ff',
                        color: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 16px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Thêm giỏ hàng
                    </Button>
                  )}
                  <Button
                    type="primary"
                    size="large"
                    icon={isVehicle ? <UserOutlined /> : <CreditCardOutlined />}
                    onClick={handleBuyNow}
                    disabled={!inStock}
                    style={{ 
                      width: isVehicle ? '100%' : 'calc(50% - 6px)',
                      minWidth: isVehicle ? '100%' : 'calc(50% - 6px)',
                      maxWidth: isVehicle ? '100%' : 'calc(50% - 6px)',
                      flex: 'none',
                      height: 50, 
                      fontSize: 16, 
                      fontWeight: 600,
                      background: isVehicle 
                        ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 16px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isVehicle ? "Để lại thông tin" : "Mua ngay"}
                  </Button>
                </div>
                <Space style={{ width: '100%', justifyContent: 'center' }}>
                  <Button icon={<HeartOutlined />} size="large">
                    Yêu thích
                  </Button>
                  <Button icon={<ShareAltOutlined />} size="large">
                    Chia sẻ
                  </Button>
                </Space>
              </Space>
            </div>

            {/* Additional Info */}
            {(product.qualityChecked || product.freeShipping || product.installationSupport) && (
              <div className={styles.infoBox}>
                <Space direction="vertical" size="small">
                  {product.qualityChecked && (
                    <div className={styles.infoItem}>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text>Đã kiểm tra chất lượng</Text>
                    </div>
                  )}
                  {product.freeShipping && (
                    <div className={styles.infoItem}>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text>Giao hàng miễn phí</Text>
                    </div>
                  )}
                  {product.installationSupport && (
                    <div className={styles.infoItem}>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text>Hỗ trợ lắp đặt</Text>
                    </div>
                  )}
                </Space>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Additional Tabs */}
      <Divider />
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Mô tả chi tiết" key="1">
          {description && (
            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
              {description}
            </Paragraph>
          )}
          {(capacity || batteryHealth || cycleCount || manufactureYear) && (
            <List
              header={<Text strong>Thông số kỹ thuật:</Text>}
              dataSource={[
                capacity && `Dung lượng: ${capacity} kWh`,
                batteryHealth && `Độ khỏe pin: ${batteryHealth}%`,
                cycleCount !== undefined && cycleCount !== null && `Số chu kỳ: ${cycleCount} lần`,
                manufactureYear && `Năm sản xuất: ${manufactureYear}`,
                mileageKm && `Số km đã đi: ${mileageKm.toLocaleString('vi-VN')} km`,
                model && `Model: ${model}`,
                condition && `Tình trạng: ${condition}`,
              ].filter(Boolean)}
              renderItem={(item) => (
                <List.Item>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  {item}
                </List.Item>
              )}
            />
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Chính sách" key="2">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {product.returnPolicy && (
              <div>
                <Text strong>Chính sách đổi trả:</Text>
                <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                  {product.returnPolicy}
                </Paragraph>
              </div>
            )}
            {(warranty || product.warrantyPolicy) && (
              <div>
                <Text strong>Chính sách bảo hành:</Text>
                <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                  {product.warrantyPolicy || (warranty && `Bảo hành ${warranty} tháng`)}
                </Paragraph>
              </div>
            )}
            {product.shippingPolicy && (
              <div>
                <Text strong>Chính sách vận chuyển:</Text>
                <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                  {product.shippingPolicy}
                </Paragraph>
              </div>
            )}
          </Space>
        </Tabs.TabPane>
        {seller && (
          <Tabs.TabPane tab="Thông tin người bán" key="3">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Avatar size={64} icon={<UserOutlined />} src={seller.avatar} />
                <div>
                  <Text strong style={{ fontSize: 18 }}>{seller.name}</Text>
                  {seller.rating !== undefined && (
                    <div>
                      <Rate disabled value={seller.rating} style={{ fontSize: 14 }} />
                      {seller.totalSales !== undefined && (
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                          ({seller.totalSales} giao dịch)
                        </Text>
                      )}
                    </div>
                  )}
                  {seller.joinedAt && (
                    <Text type="secondary" style={{ display: 'block' }}>
                      Tham gia: {new Date(seller.joinedAt).toLocaleDateString('vi-VN')}
                    </Text>
                  )}
                </div>
              </div>
              {seller.address && (
                <div>
                  <Text strong>Địa chỉ:</Text>
                  <Paragraph>{seller.address}</Paragraph>
                </div>
              )}
              {(contactInfo || seller.phone || seller.email) && (
                <div>
                  <Text strong>Thông tin liên hệ:</Text>
                  <Paragraph>
                    {contactInfo && <div>{contactInfo}</div>}
                    {seller.phone && <div>Điện thoại: {seller.phone}</div>}
                    {seller.email && <div>Email: {seller.email}</div>}
                  </Paragraph>
                </div>
              )}
              {seller.verified && (
                <div className={styles.infoItem}>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text style={{ color: '#52c41a' }}>Đã xác thực tài khoản</Text>
                </div>
              )}
            </Space>
          </Tabs.TabPane>
        )}
      </Tabs>
    </Modal>
  );
};

export default ProductDetailModal;
