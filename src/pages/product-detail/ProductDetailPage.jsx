import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  InputNumber,
  Tag,
  Rate,
  Divider,
  Tabs,
  Table,
  Image,
  Space,
  Typography,
  Avatar,
  Progress,
  List,
  Breadcrumb,
  Spin,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import postService from "../../services/postService";
import styles from "./ProductDetailPage.module.css";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  // Fetch product details from API
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        console.log("📦 Fetching product detail for ID:", id);
        
        const response = await postService.getPostById(id);
        console.log("✅ Product detail response:", response);
        
        // Determine if product is available (status check)
        const isAvailable = response.status === "Active" || response.status === "Approved";
        
        // Transform API data to component format
        const productData = {
          // Post info
          id: response.postId,
          name: response.title,
          price: response.price,
          description: response.description || "Không có mô tả",
          postType: response.postType, // "Direct" or "Staff-Assisted"
          transactionType: response.transactionType, // Transaction type
          contactInfo: response.contactInfo,
          status: response.status,
          featured: response.featured || false,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          expiryDate: response.expiryDate,
          
          // Display info
          brand: response.battery?.brand || response.vehicle?.brand || "Unknown",
          originalPrice: response.price * 1.5, // Calculate discount
          rating: response.member?.rating || 4.5,
          reviews: 0,
          sold: 0,
          inStock: isAvailable,
          stockQuantity: isAvailable ? 1 : 0,
          membershipLevel: 3,
          tag: response.featured ? "Nổi bật" : "Tiêu chuẩn",
          category: response.batteryId ? 'battery' : response.vehicleId ? 'vehicle' : 'unknown',
          images: response.images || [
            "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800"
          ],
          
          // Battery specifications
          specifications: response.battery ? {
            type: "Pin điện",
            capacity: `${response.battery.capacityKWh} kWh`,
            cycleCount: response.battery.cycleCount?.toString() || "N/A",
            manufactureYear: response.battery.manufactureYear?.toString() || "N/A",
            condition: response.battery.condition || "good",
            healthStatus: response.battery.cycleCount ? 
              `${Math.max(100 - (response.battery.cycleCount / 30), 50).toFixed(0)}%` : "90%",
            brand: response.battery.brand,
            description: response.battery.description,
          } : response.vehicle ? {
            // Vehicle specifications
            type: "Xe điện",
            brand: response.vehicle.brand,
            model: response.vehicle.model,
            manufactureYear: response.vehicle.manufactureYear?.toString() || "N/A",
            mileageKm: `${response.vehicle.mileageKm?.toLocaleString()} km` || "N/A",
            batteryCapacity: `${response.vehicle.batteryCapacity} kWh`,
            condition: response.vehicle.condition || "good",
            description: response.vehicle.description,
          } : {},
          
          features: [
            response.postType === "Staff-Assisted" ? "Có hỗ trợ từ nhân viên" : "Giao dịch trực tiếp",
            response.featured ? "Tin đăng nổi bật" : "Tin đăng thường",
            "Đã qua kiểm tra",
            response.battery ? "Pin chất lượng" : "Xe điện đầy đủ",
          ],
          
          applications: [
            response.battery ? "Thay thế pin cũ" : "Sử dụng cá nhân",
            "Tiết kiệm năng lượng",
            "Thân thiện môi trường",
          ],
          
          // Seller info from Member
          seller: {
            id: response.member?.memberId,
            name: response.member?.fullName || "Người bán",
            avatar: response.member?.avatarUrl,
            address: response.member?.address,
            rating: response.member?.rating || 4.5,
            joinDate: response.member?.joinedAt ? 
              new Date(response.member.joinedAt).getFullYear() : "2024",
            status: response.member?.status,
            verified: response.member?.status === "Active",
            responseRate: "95%",
            responseTime: "2 giờ",
            followers: 100,
            products: 10,
          },
          
          // Staff info if staff-assisted
          staff: response.staff ? {
            id: response.staff.memberId,
            name: response.staff.fullName,
          } : null,
          
          warranty: {
            period: "12 tháng",
            coverage: [
              "Bảo hành chất lượng sản phẩm",
              "Hỗ trợ kỹ thuật",
            ],
            notCovered: [
              "Hư hỏng do sử dụng sai cách",
            ],
          },
          
          shipping: {
            freeShipping: true,
            estimatedDays: "3-5 ngày",
            shippingFrom: response.member?.address || "TP. Hồ Chí Minh",
            methods: [
              "Giao hàng tiêu chuẩn (3-5 ngày)",
              "Giao hàng nhanh (1-2 ngày)",
            ],
          },
          
          reviewsList: [],
          relatedProducts: [],
        };
        
        setProduct(productData);
      } catch (error) {
        console.error("❌ Error fetching product detail:", error);
        message.error("Không thể tải thông tin sản phẩm. Vui lòng thử lại!");
        // Optionally navigate back if product not found
        if (error.response?.status === 404) {
          setTimeout(() => navigate("/products"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" indicator={<LoadingOutlined spin />} />
        <div style={{ marginTop: 20 }}>Đang tải thông tin sản phẩm...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Title level={3}>Không tìm thấy sản phẩm</Title>
        <Button type="primary" onClick={() => navigate('/products')}>
          Quay lại trang sản phẩm
        </Button>
      </div>
    );
  }

  const getMembershipInfo = (level) => {
    switch (level) {
      case 4:
        return {
          color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          icon: "💎",
          label: "Kim cương",
        };
      case 3:
        return {
          color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          icon: "🥇",
          label: "Vàng",
        };
      case 2:
        return {
          color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          icon: "🥈",
          label: "Bạc",
        };
      case 1:
        return {
          color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
          icon: "🥉",
          label: "Đồng",
        };
      default:
        return { color: "#f0f0f0", icon: "", label: "" };
    }
  };

  const membershipInfo = getMembershipInfo(product.membershipLevel);
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  
  // Kiểm tra xem sản phẩm có phải xe máy hoặc ô tô không
  const isVehicle = product.category === 'motorcycle' || product.category === 'car';

  const handleAddToCart = () => {
    // Ngăn không cho xe máy/ô tô được thêm vào giỏ
    if (isVehicle) {
      alert('Sản phẩm xe máy và ô tô điện không thể thêm vào giỏ hàng. Vui lòng sử dụng tính năng "Để lại thông tin".');
      return;
    }
    console.log("Thêm vào giỏ hàng:", { productId: id, quantity });
  };

  const handleBuyNow = () => {
    // Nếu là xe máy hoặc ô tô, chuyển đến trang để lại thông tin
    if (isVehicle) {
      navigate(`/contact-vehicle/${id}`, {
        state: {
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            brand: product.brand,
            category: product.category,
          }
        }
      });
    } else {
      // Nếu là pin, chuyển đến trang thanh toán
      console.log("Mua ngay:", { productId: id, quantity });
      navigate('/payment', {
        state: {
          type: 'product',
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
          },
          quantity: quantity,
        }
      });
    }
  };

  const specColumns = [
    {
      title: "Thông số",
      dataIndex: "label",
      key: "label",
      width: "40%",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
    },
  ];

  const specData = Object.entries(product.specifications).map(
    ([key, value], index) => ({
      key: index,
      label:
        key
          .replace(/([A-Z])/g, " $1")
          .charAt(0)
          .toUpperCase() + key.replace(/([A-Z])/g, " $1").slice(1),
      value: value,
    })
  );

  const ratingDistribution = [
    { stars: 5, count: 98, percentage: 63 },
    { stars: 4, count: 42, percentage: 27 },
    { stars: 3, count: 12, percentage: 8 },
    { stars: 2, count: 3, percentage: 2 },
    { stars: 1, count: 1, percentage: 0 },
  ];

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>
          <HomeOutlined
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() => navigate("/products")}
          style={{ cursor: "pointer" }}
        >
          Sản phẩm
        </Breadcrumb.Item>
        <Breadcrumb.Item>{product.brand}</Breadcrumb.Item>
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Product Main Info */}
      <Card className={styles.mainCard}>
        <Row gutter={[32, 32]}>
          {/* Product Images */}
          <Col xs={24} md={10}>
            <div className={styles.imageSection}>
              <div className={styles.mainImage}>
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  preview={{
                    src: product.images[selectedImage],
                  }}
                />
                {discount > 0 && (
                  <div className={styles.discountBadge}>-{discount}%</div>
                )}
                <div
                  className={styles.membershipBadge}
                  style={{ background: membershipInfo.color }}
                >
                  <span>{membershipInfo.icon}</span> {product.tag}
                </div>
              </div>
              <div className={styles.thumbnails}>
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`${styles.thumbnail} ${
                      selectedImage === index ? styles.activeThumbnail : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Product Details */}
          <Col xs={24} md={14}>
            <div className={styles.detailSection}>
              <div className={styles.brandTag}>
                <Tag color="blue">{product.brand}</Tag>
                {product.seller.verified && (
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Người bán đã xác thực
                  </Tag>
                )}
              </div>

              <Title level={2} className={styles.productName}>
                {product.name}
              </Title>

              <div className={styles.ratingSection}>
                <Rate disabled defaultValue={product.rating} allowHalf />
                <Text className={styles.ratingText}>
                  {product.rating} ({product.reviews} đánh giá)
                </Text>
                <Divider type="vertical" />
                <Text className={styles.soldText}>Đã bán: {product.sold}</Text>
              </div>

              <div className={styles.priceSection}>
                <div className={styles.currentPrice}>
                  {product.price.toLocaleString("vi-VN")}₫
                </div>
                {product.originalPrice > product.price && (
                  <div className={styles.originalPrice}>
                    {product.originalPrice.toLocaleString("vi-VN")}₫
                  </div>
                )}
              </div>

              <Divider />

              {/* Key Specs */}
              <div className={styles.keySpecs}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className={styles.specItem}>
                      <ThunderboltOutlined className={styles.specIcon} />
                      <div>
                        <Text type="secondary">Dung lượng</Text>
                        <div className={styles.specValue}>
                          {product.specifications.capacity}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.specItem}>
                      <SafetyOutlined className={styles.specIcon} />
                      <div>
                        <Text type="secondary">Độ khỏe pin</Text>
                        <div className={styles.specValue}>
                          {product.specifications.healthStatus}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.specItem}>
                      <CheckCircleOutlined className={styles.specIcon} />
                      <div>
                        <Text type="secondary">Tình trạng</Text>
                        <div className={styles.specValue}>
                          {product.specifications.condition}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.specItem}>
                      <SafetyOutlined className={styles.specIcon} />
                      <div>
                        <Text type="secondary">Bảo hành</Text>
                        <div className={styles.specValue}>
                          {product.specifications.warranty}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <Divider />

              {/* Quantity & Actions */}
              <div className={styles.actionSection}>
                {!isVehicle && (
                  <div className={styles.quantitySection}>
                    <Text className={styles.quantityLabel}>Số lượng:</Text>
                    <InputNumber
                      min={1}
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={setQuantity}
                      className={styles.quantityInput}
                    />
                    <Text type="secondary">
                      {product.stockQuantity} sản phẩm có sẵn
                    </Text>
                  </div>
                )}

                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                >
                  {!isVehicle && (
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleAddToCart}
                      block
                      className={styles.addToCartBtn}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  )}
                  <Button
                    size="large"
                    onClick={handleBuyNow}
                    block
                    className={styles.buyNowBtn}
                    icon={isVehicle ? <UserOutlined /> : undefined}
                    style={isVehicle ? {
                      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 600,
                    } : {}}
                  >
                    {isVehicle ? "Để lại thông tin" : "Mua ngay"}
                  </Button>
                  <Space
                    size="middle"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    <Button icon={<HeartOutlined />}>Yêu thích</Button>
                    <Button icon={<ShareAltOutlined />}>Chia sẻ</Button>
                  </Space>
                </Space>
              </div>

              {/* Shipping Info */}
              <div className={styles.shippingInfo}>
                <Title level={5}>Thông tin vận chuyển</Title>
                <Space direction="vertical" size="small">
                  {product.shipping.freeShipping && (
                    <Text>
                      <CheckCircleOutlined
                        style={{ color: "#52c41a", marginRight: 8 }}
                      />
                      Miễn phí vận chuyển
                    </Text>
                  )}
                  <Text type="secondary">
                    Giao hàng từ: {product.shipping.shippingFrom}
                  </Text>
                  <Text type="secondary">
                    Thời gian giao hàng: {product.shipping.estimatedDays}
                  </Text>
                </Space>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Seller Info Card */}
      <Card className={styles.sellerCard}>
        <Row align="middle" gutter={[16, 16]}>
          <Col>
            <Avatar size={64} icon={<UserOutlined />} />
          </Col>
          <Col flex="auto">
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {product.seller.name}
                {product.seller.verified && (
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", marginLeft: 8 }}
                  />
                )}
              </Title>
              <Space size="large">
                <Text type="secondary">
                  <Rate
                    disabled
                    defaultValue={product.seller.rating}
                    style={{ fontSize: 14 }}
                  />{" "}
                  {product.seller.rating}
                </Text>
                <Text type="secondary">{product.seller.products} sản phẩm</Text>
                <Text type="secondary">
                  {product.seller.followers} người theo dõi
                </Text>
              </Space>
            </div>
          </Col>
          <Col>
            <Space>
              <Button>Xem shop</Button>
              <Button type="primary">Theo dõi</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Detailed Information Tabs */}
      <Card className={styles.detailTabs}>
        <Tabs defaultActiveKey="1" size="large">
          {/* Description Tab */}
          <TabPane tab="Mô tả sản phẩm" key="1">
            <div className={styles.tabContent}>
              <Paragraph className={styles.description}>
                {product.description}
              </Paragraph>

              <Title level={4}>Tính năng nổi bật</Title>
              <List
                dataSource={product.features}
                renderItem={(item) => (
                  <List.Item>
                    <CheckCircleOutlined
                      style={{ color: "#52c41a", marginRight: 8 }}
                    />
                    {item}
                  </List.Item>
                )}
              />

              <Divider />

              <Title level={4}>Ứng dụng</Title>
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3 }}
                dataSource={product.applications}
                renderItem={(item) => (
                  <List.Item>
                    <Card size="small">
                      <CheckCircleOutlined
                        style={{ color: "#1890ff", marginRight: 8 }}
                      />
                      {item}
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </TabPane>

          {/* Specifications Tab */}
          <TabPane tab="Thông số kỹ thuật" key="2">
            <div className={styles.tabContent}>
              <Table
                columns={specColumns}
                dataSource={specData}
                pagination={false}
                bordered
                size="middle"
              />
            </div>
          </TabPane>

          {/* Warranty Tab */}
          <TabPane tab="Bảo hành & Vận chuyển" key="3">
            <div className={styles.tabContent}>
              <Title level={4}>Chính sách bảo hành</Title>
              <Paragraph>
                <strong>Thời gian bảo hành:</strong> {product.warranty.period}
              </Paragraph>
              <Paragraph>
                <strong>Bảo hành bao gồm:</strong>
              </Paragraph>
              <List
                dataSource={product.warranty.coverage}
                renderItem={(item) => (
                  <List.Item>
                    <CheckCircleOutlined
                      style={{ color: "#52c41a", marginRight: 8 }}
                    />
                    {item}
                  </List.Item>
                )}
              />
              <Paragraph>
                <strong>Không bảo hành:</strong>
              </Paragraph>
              <List
                dataSource={product.warranty.notCovered}
                renderItem={(item) => (
                  <List.Item>
                    <Text type="danger">✕ {item}</Text>
                  </List.Item>
                )}
              />

              <Divider />

              <Title level={4}>Phương thức vận chuyển</Title>
              <List
                dataSource={product.shipping.methods}
                renderItem={(item) => (
                  <List.Item>
                    <CheckCircleOutlined
                      style={{ color: "#1890ff", marginRight: 8 }}
                    />
                    {item}
                  </List.Item>
                )}
              />
            </div>
          </TabPane>

          {/* Reviews Tab */}
          <TabPane tab={`Đánh giá (${product.reviews.length})`} key="4">
            <div className={styles.tabContent}>
              <Row gutter={[32, 32]}>
                <Col xs={24} md={8}>
                  <div className={styles.ratingOverview}>
                    <div className={styles.ratingScore}>
                      <div className={styles.scoreNumber}>{product.rating}</div>
                      <Rate disabled defaultValue={product.rating} allowHalf />
                      <Text type="secondary">
                        {product.reviews.length} đánh giá
                      </Text>
                    </div>
                    <Divider />
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className={styles.ratingBar}>
                        <Text>{item.stars} ⭐</Text>
                        <Progress
                          percent={item.percentage}
                          strokeColor="#fadb14"
                          showInfo={false}
                        />
                        <Text type="secondary">{item.count}</Text>
                      </div>
                    ))}
                  </div>
                </Col>
                <Col xs={24} md={16}>
                  <List
                    itemLayout="vertical"
                    dataSource={product.reviewsList}
                    renderItem={(review) => (
                      <List.Item
                        actions={[
                          <Text key="helpful">
                            👍 Hữu ích ({review.helpful})
                          </Text>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={
                            <Space>
                              <Text strong>{review.userName}</Text>
                              <Rate
                                disabled
                                defaultValue={review.rating}
                                style={{ fontSize: 14 }}
                              />
                            </Space>
                          }
                          description={
                            <Text type="secondary">{review.date}</Text>
                          }
                        />
                        <Paragraph>{review.content}</Paragraph>
                        {review.images && (
                          <Space>
                            {review.images.map((img, idx) => (
                              <Image key={idx} src={img} width={100} />
                            ))}
                          </Space>
                        )}
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Related Products */}
      <Card title="Sản phẩm liên quan" className={styles.relatedProducts}>
        <Row gutter={[16, 16]}>
          {product.relatedProducts.map((item) => (
            <Col key={item.id} xs={12} sm={8} md={6}>
              <Card
                hoverable
                cover={<img alt={item.name} src={item.image} />}
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <Card.Meta
                  title={item.name}
                  description={
                    <>
                      <div className={styles.relatedPrice}>
                        {item.price.toLocaleString("vi-VN")}₫
                      </div>
                      <Rate
                        disabled
                        defaultValue={item.rating}
                        style={{ fontSize: 12 }}
                      />
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
