import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import styles from './ProductDetailPage.module.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data - trong thực tế sẽ fetch từ API dựa trên id
  const product = {
    id: id,
    name: 'Pin Tesla Model S 85kWh',
    brand: 'Tesla',
    price: 240000000,
    originalPrice: 360000000,
    rating: 4.8,
    reviews: 156,
    sold: 89,
    inStock: true,
    stockQuantity: 15,
    membershipLevel: 4,
    tag: 'Kim cương',
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
      'https://images.unsplash.com/photo-1617788138058-1e97ae4b5aef?w=800',
      'https://images.unsplash.com/photo-1612538498613-76d10ae0c237?w=800',
    ],
    description: `Pin Tesla Model S 85kWh là giải pháp năng lượng cao cấp, được tái chế từ xe Tesla Model S đời 2018-2020. 
    Pin đã qua kiểm tra kỹ lưỡng và vẫn giữ được 92% dung lượng ban đầu, đảm bảo hiệu suất tối ưu cho nhu cầu sử dụng của bạn.`,
    
    specifications: {
      capacity: '85 kWh',
      voltage: '375V',
      current: '227A',
      cellType: 'Li-ion 18650',
      weight: '540 kg',
      dimensions: '2100 x 1200 x 150 mm',
      cycleLife: '3000+ chu kỳ',
      warranty: '24 tháng',
      condition: 'Như mới',
      healthStatus: '92%',
      yearManufactured: '2019',
      certification: 'CE, UL, UN38.3',
    },

    features: [
      'Dung lượng cao 85kWh phù hợp cho nhiều ứng dụng',
      'Độ sức khỏe pin 92% được chứng nhận',
      'Hệ thống BMS (Battery Management System) tích hợp',
      'Bảo hành chính hãng 24 tháng',
      'Đã qua kiểm tra an toàn nghiêm ngặt',
      'Hỗ trợ lắp đặt và tư vấn kỹ thuật miễn phí',
      'Chứng nhận chất lượng quốc tế',
      'Có thể kết nối song song để tăng dung lượng',
    ],

    applications: [
      'Hệ thống lưu trữ năng lượng mặt trời (Solar ESS)',
      'Trạm sạc xe điện công suất cao',
      'Nguồn điện dự phòng cho doanh nghiệp',
      'Hệ thống điện độc lập (Off-grid)',
      'Xe điện và xe buýt điện',
      'Tàu thuyền và du thuyền điện',
    ],

    seller: {
      name: 'Green Energy Solutions',
      rating: 4.9,
      responseRate: '98%',
      responseTime: '2 giờ',
      followers: 2453,
      products: 87,
      joinDate: 'Tháng 3, 2023',
      verified: true,
    },

    warranty: {
      period: '24 tháng',
      coverage: [
        'Bảo hành chất lượng pin',
        'Thay thế miễn phí nếu lỗi nhà sản xuất',
        'Hỗ trợ kỹ thuật 24/7',
        'Kiểm tra và bảo dưỡng định kỳ',
      ],
      notCovered: [
        'Hư hỏng do sử dụng sai cách',
        'Thiệt hại do thiên tai',
        'Tự ý sửa chữa, thay đổi',
      ],
    },

    shipping: {
      freeShipping: true,
      estimatedDays: '3-5 ngày',
      shippingFrom: 'TP. Hồ Chí Minh',
      methods: [
        'Giao hàng tiêu chuẩn (3-5 ngày)',
        'Giao hàng nhanh (1-2 ngày) +500.000₫',
        'Nhận tại kho (Miễn phí)',
      ],
    },

    reviews: [
      {
        id: 1,
        userName: 'Nguyễn Văn A',
        rating: 5,
        date: '15/10/2024',
        content: 'Pin chất lượng tuyệt vời, đúng như mô tả. Dung lượng vẫn rất tốt, đã lắp vào hệ thống solar của nhà và hoạt động ổn định.',
        images: ['https://via.placeholder.com/100'],
        helpful: 24,
      },
      {
        id: 2,
        userName: 'Trần Thị B',
        rating: 4,
        date: '10/10/2024',
        content: 'Sản phẩm tốt, giao hàng nhanh. Nhân viên hỗ trợ lắp đặt rất nhiệt tình.',
        helpful: 15,
      },
      {
        id: 3,
        userName: 'Lê Văn C',
        rating: 5,
        date: '05/10/2024',
        content: 'Mua lần 2 rồi, chất lượng ổn định. Giá cả hợp lý so với thị trường.',
        helpful: 18,
      },
    ],

    relatedProducts: [
      {
        id: 2,
        name: 'Pin Tesla Model 3 75kWh',
        price: 216000000,
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400',
        rating: 4.7,
      },
      {
        id: 3,
        name: 'Pin Nissan Leaf 40kWh',
        price: 120000000,
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400',
        rating: 4.5,
      },
    ],
  };

  const getMembershipInfo = (level) => {
    switch (level) {
      case 4:
        return { color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '💎', label: 'Kim cương' };
      case 3:
        return { color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '🥇', label: 'Vàng' };
      case 2:
        return { color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '🥈', label: 'Bạc' };
      case 1:
        return { color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: '🥉', label: 'Đồng' };
      default:
        return { color: '#f0f0f0', icon: '', label: '' };
    }
  };

  const membershipInfo = getMembershipInfo(product.membershipLevel);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    console.log('Thêm vào giỏ hàng:', { productId: id, quantity });
  };

  const handleBuyNow = () => {
    console.log('Mua ngay:', { productId: id, quantity });
  };

  const specColumns = [
    {
      title: 'Thông số',
      dataIndex: 'label',
      key: 'label',
      width: '40%',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const specData = Object.entries(product.specifications).map(([key, value], index) => ({
    key: index,
    label: key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1),
    value: value,
  }));

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
          <HomeOutlined onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        </Breadcrumb.Item>
        <Breadcrumb.Item onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
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
                    className={`${styles.thumbnail} ${selectedImage === index ? styles.activeThumbnail : ''}`}
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
                  {product.price.toLocaleString('vi-VN')}₫
                </div>
                {product.originalPrice > product.price && (
                  <div className={styles.originalPrice}>
                    {product.originalPrice.toLocaleString('vi-VN')}₫
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
                        <div className={styles.specValue}>{product.specifications.capacity}</div>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.specItem}>
                      <SafetyOutlined className={styles.specIcon} />
                      <div>
                        <Text type="secondary">Độ khỏe pin</Text>
                        <div className={styles.specValue}>{product.specifications.healthStatus}</div>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.specItem}>
                      <CheckCircleOutlined className={styles.specIcon} />
                      <div>
                        <Text type="secondary">Tình trạng</Text>
                        <div className={styles.specValue}>{product.specifications.condition}</div>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.specItem}>
                      <SafetyOutlined className={styles.specIcon} />
                      <div>
                        <Text type="secondary">Bảo hành</Text>
                        <div className={styles.specValue}>{product.specifications.warranty}</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <Divider />

              {/* Quantity & Actions */}
              <div className={styles.actionSection}>
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

                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
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
                  <Button
                    size="large"
                    onClick={handleBuyNow}
                    block
                    className={styles.buyNowBtn}
                  >
                    Mua ngay
                  </Button>
                  <Space size="middle" style={{ width: '100%', justifyContent: 'center' }}>
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
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
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
                  <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 8 }} />
                )}
              </Title>
              <Space size="large">
                <Text type="secondary">
                  <Rate disabled defaultValue={product.seller.rating} style={{ fontSize: 14 }} /> {product.seller.rating}
                </Text>
                <Text type="secondary">{product.seller.products} sản phẩm</Text>
                <Text type="secondary">{product.seller.followers} người theo dõi</Text>
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
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
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
                      <CheckCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
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
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
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
                    <CheckCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
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
                      <Text type="secondary">{product.reviews.length} đánh giá</Text>
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
                    dataSource={product.reviews}
                    renderItem={(review) => (
                      <List.Item
                        actions={[
                          <Text key="helpful">👍 Hữu ích ({review.helpful})</Text>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={
                            <Space>
                              <Text strong>{review.userName}</Text>
                              <Rate disabled defaultValue={review.rating} style={{ fontSize: 14 }} />
                            </Space>
                          }
                          description={<Text type="secondary">{review.date}</Text>}
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
                        {item.price.toLocaleString('vi-VN')}₫
                      </div>
                      <Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} />
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
