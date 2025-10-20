import React from "react";
import { Card, Button, Tag, Space, Rate, Tooltip, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  FireOutlined,
  CheckCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const navigate = useNavigate();
  const {
    id,
    name,
    price,
    originalPrice,
    image,
    capacity,
    voltage,
    condition,
    warranty,
    rating,
    reviews,
    discount,
    tag,
    membershipLevel,
    brand,
    inStock = true,
    seller,
    batteryHealth,
    usageYears,
    location,
    postedDate,
  } = product;

  // Định nghĩa màu sắc cho từng gói membership
  const getMembershipColor = (level) => {
    switch (level) {
      case 4: // Kim cương
        return {
          color: '#00d4ff',
          bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          icon: '💎',
          label: 'Kim cương'
        };
      case 3: // Vàng
        return {
          color: '#ffd700',
          bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          icon: '🥇',
          label: 'Vàng'
        };
      case 2: // Bạc
        return {
          color: '#c0c0c0',
          bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          icon: '🥈',
          label: 'Bạc'
        };
      case 1: // Đồng
        return {
          color: '#cd7f32',
          bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          icon: '🥉',
          label: 'Đồng'
        };
      default:
        return {
          color: '#888',
          bgColor: '#f0f0f0',
          icon: '',
          label: ''
        };
    }
  };

  const membershipInfo = getMembershipColor(membershipLevel);

  const discountPercentage = discount || 
    (originalPrice && price ? 
      `-${Math.round(((originalPrice - price) / originalPrice) * 100)}%` 
      : null);

  const handleBuyNow = (e) => {
    e.stopPropagation();
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
        quantity: 1,
      },
    });
  };

  return (
    <Card
      hoverable
      className={styles.productCard}
      cover={
        <div className={styles.imageContainer}>
          <img alt={name} src={image} className={styles.productImage} />
          {!inStock && (
            <div className={styles.outOfStock}>
              <span>Out of Stock</span>
            </div>
          )}
          {tag && inStock && membershipLevel && (
            <div 
              className={styles.badge}
              style={{ 
                background: membershipInfo.bgColor,
                color: '#fff',
                fontWeight: 'bold',
                boxShadow: `0 4px 15px ${membershipInfo.color}40`
              }}
            >
              <span style={{ marginRight: '4px' }}>{membershipInfo.icon}</span>
              {tag}
            </div>
          )}
          <div className={styles.quickActions}>
            <Tooltip title="Add to Wishlist">
              <Button
                shape="circle"
                icon={<HeartOutlined />}
                className={styles.actionButton}
              />
            </Tooltip>
            <Tooltip title="Quick View">
              <Button
                shape="circle"
                icon={<EyeOutlined />}
                className={styles.actionButton}
                onClick={() => onViewDetails(product)}
              />
            </Tooltip>
          </div>
        </div>
      }
    >
      <div className={styles.cardContent}>
        {/* Seller Info */}
        <div className={styles.sellerInfo}>
          <Avatar 
            size={32} 
            icon={<UserOutlined />} 
            src={seller?.avatar}
            className={styles.sellerAvatar}
          />
          <div className={styles.sellerDetails}>
            <div className={styles.sellerName}>{seller?.name || 'Người bán'}</div>
            <div className={styles.sellerMeta}>
              <EnvironmentOutlined className={styles.metaIcon} />
              <span className={styles.metaText}>{location || 'TP.HCM'}</span>
            </div>
          </div>
        </div>

        {/* Brand & Membership */}
        <div className={styles.tagsRow}>
          {brand && (
            <Tag color="blue" className={styles.brandTag}>
              {brand}
            </Tag>
          )}
          {membershipLevel && (
            <Tag 
              className={styles.membershipTag}
              style={{ 
                background: membershipInfo.bgColor,
                border: 'none',
                color: '#fff'
              }}
            >
              {membershipInfo.icon} {tag}
            </Tag>
          )}
        </div>

        {/* Product Name */}
        <h3 className={styles.productName}>{name}</h3>

        {/* Battery Health & Condition */}
        <div className={styles.conditionRow}>
          <div className={styles.healthBadge}>
            <SafetyOutlined className={styles.healthIcon} />
            <span className={styles.healthText}>Độ khỏe: {batteryHealth || '90'}%</span>
          </div>
          <Tag color={condition === 'Như mới' ? 'green' : condition === 'Tốt' ? 'blue' : 'orange'}>
            {condition}
          </Tag>
        </div>

        {/* Specifications */}
        <div className={styles.specs}>
          <div className={styles.specItem}>
            <ThunderboltOutlined className={styles.specIcon} />
            <span>{capacity} kWh</span>
          </div>
          <div className={styles.specItem}>
            <SafetyOutlined className={styles.specIcon} />
            <span>{voltage}V</span>
          </div>
          <div className={styles.specItem}>
            <CalendarOutlined className={styles.specIcon} />
            <span>{usageYears || warranty} năm SD</span>
          </div>
        </div>

        {/* Posted Date */}
        <div className={styles.postedDate}>
          <ClockCircleOutlined className={styles.dateIcon} />
          <span>Đăng {postedDate || '2 ngày trước'}</span>
        </div>

        {/* Price */}
        <div className={styles.priceSection}>
          <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>
              {typeof price === 'number' ? price.toLocaleString('vi-VN') : price}₫
            </span>
            {originalPrice && originalPrice > price && (
              <span className={styles.originalPrice}>
                {typeof originalPrice === 'number' ? originalPrice.toLocaleString('vi-VN') : originalPrice}₫
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <div style={{ display: 'flex', gap: '8px', width: '100%', marginBottom: 8 }}>
            <Button
              type="default"
              icon={<ShoppingCartOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              disabled={!inStock}
              style={{ 
                width: 'calc(50% - 4px)',
                minWidth: 'calc(50% - 4px)',
                maxWidth: 'calc(50% - 4px)',
                flex: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 8px',
                whiteSpace: 'nowrap'
              }}
            >
              Thêm giỏ
            </Button>
            <Button
              type="primary"
              icon={<CreditCardOutlined />}
              onClick={handleBuyNow}
              disabled={!inStock}
              style={{ 
                width: 'calc(50% - 4px)',
                minWidth: 'calc(50% - 4px)',
                maxWidth: 'calc(50% - 4px)',
                flex: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px 8px',
                whiteSpace: 'nowrap'
              }}
            >
              Mua ngay
            </Button>
          </div>
          <Button
            icon={<EyeOutlined />}
            block
            size="large"
            className={styles.viewDetailsButton}
            onClick={(e) => {
              e.stopPropagation();
              if (onViewDetails) {
                onViewDetails(product);
              } else {
                navigate(`/product/${id}`);
              }
            }}
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
