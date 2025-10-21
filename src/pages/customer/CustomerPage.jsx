import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Tabs,
  Table,
  Statistic,
  Progress,
  Tooltip,
  Badge,
  Empty,
  Divider,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  ShoppingOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  HeartOutlined,
  MessageOutlined,
  StarFilled,
  CrownOutlined,
  TrophyOutlined,
  FireOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Header, Footer } from "../../components/layout";
import styles from "./CustomerPage.module.css";

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const CustomerPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("my-products");
  const [modalVisible, setModalVisible] = useState(false);
  const [packageModalVisible, setPackageModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProductForPackage, setSelectedProductForPackage] = useState(null);
  const [form] = Form.useForm();

  // Dữ liệu các gói đăng tin cho từng bài
  const postPackages = [
    {
      id: 1,
      name: "Gói Đồng",
      tier: "bronze",
      price: 0,
      duration: 7,
      color: "#CD7F32",
      gradient: "linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)",
      features: [
        "Hiển thị 7 ngày",
        "Không ưu tiên",
        "Không huy hiệu",
      ],
      priority: 1,
    },
    {
      id: 2,
      name: "Gói Bạc",
      tier: "silver",
      price: 50000,
      duration: 14,
      color: "#C0C0C0",
      gradient: "linear-gradient(135deg, #E8E8E8 0%, #A8A8A8 100%)",
      features: [
        "Hiển thị 14 ngày",
        "Ưu tiên thấp",
        "Huy hiệu Bạc",
      ],
      priority: 2,
    },
    {
      id: 3,
      name: "Gói Vàng",
      tier: "gold",
      price: 100000,
      duration: 30,
      color: "#FFD700",
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
      features: [
        "Hiển thị 30 ngày",
        "Ưu tiên cao",
        "Huy hiệu Vàng",
        "Lên top tìm kiếm",
      ],
      priority: 3,
      popular: true,
    },
    {
      id: 4,
      name: "Gói Kim Cương",
      tier: "diamond",
      price: 200000,
      duration: 60,
      color: "#B9F2FF",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      features: [
        "Hiển thị 60 ngày",
        "Ưu tiên cao nhất",
        "Huy hiệu Kim Cương",
        "Luôn ở đầu trang",
        "Tăng gấp 3x lượt xem",
      ],
      priority: 4,
    },
  ];

  // Mock data - Thông tin người dùng
  const userData = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    avatar: "https://i.pravatar.cc/150?img=12",
    membershipLevel: 3, // 1=Bronze, 2=Silver, 3=Gold, 4=Diamond
    membershipName: "Gói Vàng",
    joinDate: "15/03/2024",
    totalProducts: 12,
    soldProducts: 8,
    activeProducts: 4,
    rating: 4.8,
    reviews: 24,
  };

  // Mock data - Sản phẩm của customer
  const [myProducts, setMyProducts] = useState([
    {
      id: 1,
      name: "Pin LFP 100Ah",
      brand: "CATL",
      capacity: 100,
      voltage: 48,
      price: 15000000,
      originalPrice: 18000000,
      condition: "Như mới",
      batteryHealth: 95,
      usageYears: 1,
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400",
      status: "active", // active, pending, sold
      views: 234,
      favorites: 18,
      messages: 5,
      postedDate: "2024-01-15",
      location: "TP. Hồ Chí Minh",
      package: "gold", // Gói đã áp dụng cho bài đăng này
      packageExpiry: "2024-02-15",
      description: "Pin LFP CATL chính hãng, xuất xứ rõ ràng. Đã sử dụng 1 năm cho hệ thống lưu trữ năng lượng mặt trời. Pin vẫn giữ được 95% dung lượng ban đầu, hoạt động ổn định, không bị phồng rộp hay hư hỏng.",
      advantages: "- Dung lượng cao 100Ah, phù hợp nhiều ứng dụng\n- Công nghệ LFP an toàn, tuổi thọ cao\n- Đã kiểm tra kỹ lưỡng bởi kỹ thuật viên\n- Giá cả hợp lý, tiết kiệm 20% so với mới",
      warrantyPolicy: "6 tháng",
      returnPolicy: "Đổi trả trong 15 ngày",
      shippingPolicy: "Miễn phí trong thành phố",
      installationSupport: "Hỗ trợ lắp đặt tại nhà",
      additionalNotes: "Giao hàng trong 2-3 ngày. Hỗ trợ kiểm tra trước khi nhận hàng.",
    },
    {
      id: 2,
      name: "Pin NCM 80Ah",
      brand: "BYD",
      capacity: 80,
      voltage: 60,
      price: 12000000,
      originalPrice: 15000000,
      condition: "Tốt",
      batteryHealth: 88,
      usageYears: 2,
      image: "https://images.unsplash.com/photo-1609557927203-62e3fbb3b112?w=400",
      status: "sold",
      views: 456,
      favorites: 32,
      messages: 12,
      postedDate: "2024-01-10",
      soldDate: "2024-01-20",
      location: "Hà Nội",
      package: "silver",
      packageExpiry: "2024-01-24",
      description: "Pin NCM BYD chất lượng cao, sử dụng cho xe điện 2 năm. Bảo dưỡng định kỳ, không va chạm mạnh.",
      advantages: "- Mật độ năng lượng cao\n- Thời gian sạc nhanh\n- Giá tốt nhất thị trường",
      warrantyPolicy: "3 tháng",
      returnPolicy: "Đổi trả trong 7 ngày",
      shippingPolicy: "Người mua chịu phí",
      installationSupport: "Hướng dẫn qua điện thoại",
    },
    {
      id: 3,
      name: "Pin NMC 120Ah",
      brand: "Samsung SDI",
      capacity: 120,
      voltage: 72,
      price: 25000000,
      originalPrice: 30000000,
      condition: "Như mới",
      batteryHealth: 92,
      usageYears: 1,
      image: "https://images.unsplash.com/photo-1625519778794-a81e13e66f9d?w=400",
      status: "pending",
      views: 89,
      favorites: 7,
      messages: 2,
      postedDate: "2024-01-18",
      location: "Đà Nẵng",
      package: "bronze",
      packageExpiry: "2024-01-25",
      description: "Pin Samsung SDI cao cấp, công nghệ NMC tiên tiến. Sử dụng 1 năm cho xe điện cao cấp, bảo dưỡng định kỳ theo tiêu chuẩn nhà sản xuất.",
      advantages: "- Dung lượng lớn 120Ah\n- Công nghệ NMC hiện đại\n- Sạc nhanh, hiệu suất cao\n- Đã kiểm tra và test kỹ lưỡng",
      warrantyPolicy: "12 tháng",
      returnPolicy: "Đổi trả trong 30 ngày",
      shippingPolicy: "Miễn phí toàn quốc",
      installationSupport: "Lắp đặt miễn phí",
      additionalNotes: "Tặng kèm bộ sạc chuyên dụng. Giao hàng trong 1-2 ngày.",
    },
  ]);

  // Mock statistics
  const statistics = {
    totalViews: myProducts.reduce((sum, p) => sum + p.views, 0),
    totalFavorites: myProducts.reduce((sum, p) => sum + p.favorites, 0),
    totalMessages: myProducts.reduce((sum, p) => sum + p.messages, 0),
    totalRevenue: myProducts
      .filter(p => p.status === "sold")
      .reduce((sum, p) => sum + p.price, 0),
  };

  const getMembershipInfo = (level) => {
    const levels = {
      1: { name: "Đồng", color: "#CD7F32", icon: <TrophyOutlined />, bgColor: "linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)" },
      2: { name: "Bạc", color: "#C0C0C0", icon: <StarFilled />, bgColor: "linear-gradient(135deg, #E8E8E8 0%, #A8A8A8 100%)" },
      3: { name: "Vàng", color: "#FFD700", icon: <CrownOutlined />, bgColor: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)" },
      4: { name: "Kim cương", color: "#B9F2FF", icon: <FireOutlined />, bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    };
    return levels[level] || levels[1];
  };

  const getPackageInfo = (packageTier) => {
    const packages = {
      bronze: { name: "Đồng", color: "#CD7F32", icon: <TrophyOutlined />, bgColor: "linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)" },
      silver: { name: "Bạc", color: "#C0C0C0", icon: <StarFilled />, bgColor: "linear-gradient(135deg, #E8E8E8 0%, #A8A8A8 100%)" },
      gold: { name: "Vàng", color: "#FFD700", icon: <CrownOutlined />, bgColor: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)" },
      diamond: { name: "Kim Cương", color: "#B9F2FF", icon: <FireOutlined />, bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    };
    return packages[packageTier] || packages.bronze;
  };

  const membershipInfo = getMembershipInfo(userData.membershipLevel);

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setModalVisible(true);
  };

  const handleDeleteProduct = (productId) => {
    Modal.confirm({
      title: "Xác nhận xóa sản phẩm",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        setMyProducts(myProducts.filter(p => p.id !== productId));
        message.success("Đã xóa sản phẩm thành công!");
      },
    });
  };

  const handleSubmitProduct = (values) => {
    if (editingProduct) {
      // Update existing product
      setMyProducts(
        myProducts.map(p =>
          p.id === editingProduct.id
            ? { ...p, ...values, image: values.image || p.image }
            : p
        )
      );
      message.success("Đã cập nhật sản phẩm thành công!");
      setModalVisible(false);
      form.resetFields();
    } else {
      // Add new product - chuyển sang chọn gói
      const newProduct = {
        id: Date.now(),
        ...values,
        image: values.image || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400",
        status: "pending",
        views: 0,
        favorites: 0,
        messages: 0,
        postedDate: new Date().toISOString().split('T')[0],
      };
      
      setSelectedProductForPackage(newProduct);
      setModalVisible(false);
      setPackageModalVisible(true);
      form.resetFields();
    }
  };

  const handleSelectPackage = (selectedPackage) => {
    if (selectedProductForPackage) {
      // Thêm sản phẩm mới với gói đã chọn
      const productWithPackage = {
        ...selectedProductForPackage,
        package: selectedPackage.tier,
        packageExpiry: new Date(Date.now() + selectedPackage.duration * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      };

      // Nếu gói miễn phí thì active luôn, còn không thì chờ thanh toán
      if (selectedPackage.price === 0) {
        productWithPackage.status = "active";
        setMyProducts([productWithPackage, ...myProducts]);
        message.success("Đã đăng sản phẩm thành công với Gói Đồng!");
        setPackageModalVisible(false);
        setSelectedProductForPackage(null);
      } else {
        // Chuyển sang trang thanh toán
        navigate("/payment", {
          state: {
            type: "post-package",
            package: {
              id: selectedPackage.id,
              name: selectedPackage.name,
              tier: selectedPackage.tier,
              price: selectedPackage.price,
              duration: selectedPackage.duration,
              color: selectedPackage.color,
              gradient: selectedPackage.gradient,
              features: selectedPackage.features,
            },
            product: productWithPackage,
          },
        });
        setPackageModalVisible(false);
        setSelectedProductForPackage(null);
      }
    }
  };

  const handleUpgradePackage = (product) => {
    setSelectedProductForPackage(product);
    setPackageModalVisible(true);
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      active: { color: "success", text: "Đang bán", icon: <CheckCircleOutlined /> },
      pending: { color: "warning", text: "Chờ duyệt", icon: <ClockCircleOutlined /> },
      sold: { color: "default", text: "Đã bán", icon: <CheckCircleOutlined /> },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const filteredProducts = myProducts.filter(p => {
    if (activeTab === "my-products") return true;
    if (activeTab === "active") return p.status === "active";
    if (activeTab === "pending") return p.status === "pending";
    if (activeTab === "sold") return p.status === "sold";
    return true;
  });

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <img
            src={record.image}
            alt={text}
            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
          />
          <div>
            <div style={{ fontWeight: 600 }}>{text}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{record.brand}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span style={{ fontWeight: 600, color: "#f5222d" }}>
          {price.toLocaleString("vi-VN")}₫
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Gói đăng tin",
      dataIndex: "package",
      key: "package",
      render: (packageTier, record) => {
        const pkgInfo = getPackageInfo(packageTier);
        return (
          <Space direction="vertical" size="small">
            <Tag
              style={{
                background: pkgInfo.bgColor,
                border: "none",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {pkgInfo.icon} {pkgInfo.name}
            </Tag>
            {record.packageExpiry && (
              <span style={{ fontSize: 11, color: "#888" }}>
                Hết hạn: {new Date(record.packageExpiry).toLocaleDateString("vi-VN")}
              </span>
            )}
          </Space>
        );
      },
    },
    {
      title: "Thống kê",
      key: "stats",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <span><EyeOutlined /> {record.views} lượt xem</span>
          <span><HeartOutlined /> {record.favorites} yêu thích</span>
          <span><MessageOutlined /> {record.messages} tin nhắn</span>
        </Space>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: "postedDate",
      key: "postedDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/product/${record.id}`)}
              />
            </Tooltip>
            {record.status !== "sold" && (
              <>
                <Tooltip title="Chỉnh sửa">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEditProduct(record)}
                  />
                </Tooltip>
                <Tooltip title="Xóa">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteProduct(record.id)}
                  />
                </Tooltip>
              </>
            )}
          </Space>
          {record.status !== "sold" && (
            <Button
              type="primary"
              size="small"
              icon={<CrownOutlined />}
              onClick={() => handleUpgradePackage(record)}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
              }}
            >
              Nâng cấp gói
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.customerPage}>
      <Header />
      
      <div className={styles.pageContainer}>
        {/* Hero Section with User Info */}
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={8}>
                <Card className={styles.profileCard}>
                  <div className={styles.profileHeader}>
                    <Avatar size={80} src={userData.avatar} icon={<UserOutlined />} />
                    <div className={styles.profileInfo}>
                      <h2>{userData.name}</h2>
                      <Badge
                        count={
                          <div
                            style={{
                              background: membershipInfo.bgColor,
                              color: "#fff",
                              padding: "4px 12px",
                              borderRadius: 16,
                              fontSize: 12,
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            {membershipInfo.icon}
                            {userData.membershipName}
                          </div>
                        }
                      />
                    </div>
                  </div>
                  <Divider />
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div className={styles.infoItem}>
                      <span>Email:</span> <strong>{userData.email}</strong>
                    </div>
                    <div className={styles.infoItem}>
                      <span>Số điện thoại:</span> <strong>{userData.phone}</strong>
                    </div>
                    <div className={styles.infoItem}>
                      <span>Ngày tham gia:</span> <strong>{userData.joinDate}</strong>
                    </div>
                    <div className={styles.infoItem}>
                      <span>Đánh giá:</span>
                      <strong>
                        <StarFilled style={{ color: "#faad14" }} /> {userData.rating}/5.0 ({userData.reviews} đánh giá)
                      </strong>
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} md={16}>
                <Row gutter={[16, 16]}>
                  <Col xs={12} sm={6}>
                    <Card className={styles.statCard}>
                      <Statistic
                        title="Tổng sản phẩm"
                        value={userData.totalProducts}
                        prefix={<ShoppingOutlined />}
                        valueStyle={{ color: "#1890ff" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card className={styles.statCard}>
                      <Statistic
                        title="Đã bán"
                        value={userData.soldProducts}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: "#52c41a" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card className={styles.statCard}>
                      <Statistic
                        title="Lượt xem"
                        value={statistics.totalViews}
                        prefix={<EyeOutlined />}
                        valueStyle={{ color: "#faad14" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card className={styles.statCard}>
                      <Statistic
                        title="Doanh thu"
                        value={statistics.totalRevenue}
                        prefix={<DollarOutlined />}
                        valueStyle={{ color: "#f5222d" }}
                        suffix="₫"
                      />
                    </Card>
                  </Col>
                </Row>

                <Card className={styles.activityCard} style={{ marginTop: 16 }}>
                  <h3>Hoạt động gần đây</h3>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <div className={styles.activityItem}>
                        <HeartOutlined style={{ fontSize: 24, color: "#eb2f96" }} />
                        <div>
                          <div className={styles.activityValue}>{statistics.totalFavorites}</div>
                          <div className={styles.activityLabel}>Lượt yêu thích</div>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={styles.activityItem}>
                        <MessageOutlined style={{ fontSize: 24, color: "#52c41a" }} />
                        <div>
                          <div className={styles.activityValue}>{statistics.totalMessages}</div>
                          <div className={styles.activityLabel}>Tin nhắn mới</div>
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={styles.activityItem}>
                        <ShoppingOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                        <div>
                          <div className={styles.activityValue}>{userData.activeProducts}</div>
                          <div className={styles.activityLabel}>Đang bán</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* Products Section */}
        <div className={styles.productsSection}>
          <div className={styles.sectionHeader}>
            <h2>Quản lý sản phẩm</h2>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleAddProduct}
              className={styles.addButton}
            >
              Đăng sản phẩm mới
            </Button>
          </div>

          <Card className={styles.productsCard}>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabBarStyle={{ marginBottom: 24 }}
            >
              <TabPane tab={`Tất cả (${myProducts.length})`} key="my-products" />
              <TabPane
                tab={`Đang bán (${myProducts.filter(p => p.status === "active").length})`}
                key="active"
              />
              <TabPane
                tab={`Chờ duyệt (${myProducts.filter(p => p.status === "pending").length})`}
                key="pending"
              />
              <TabPane
                tab={`Đã bán (${myProducts.filter(p => p.status === "sold").length})`}
                key="sold"
              />
            </Tabs>

            {filteredProducts.length > 0 ? (
              <>
                {/* Card View for Mobile */}
                <div className={styles.cardView}>
                  <Row gutter={[16, 16]}>
                    {filteredProducts.map((product) => (
                      <Col xs={24} sm={12} lg={8} key={product.id}>
                        <Card
                          hoverable
                          className={styles.productCard}
                          cover={
                            <div className={styles.productImageWrapper}>
                              <img
                                alt={product.name}
                                src={product.image}
                                className={styles.productImage}
                              />
                              <div className={styles.productBadge}>
                                {getStatusTag(product.status)}
                              </div>
                            </div>
                          }
                          actions={[
                            <Tooltip title="Xem chi tiết">
                              <EyeOutlined onClick={() => navigate(`/product/${product.id}`)} />
                            </Tooltip>,
                            product.status !== "sold" && (
                              <Tooltip title="Chỉnh sửa">
                                <EditOutlined onClick={() => handleEditProduct(product)} />
                              </Tooltip>
                            ),
                            product.status !== "sold" && (
                              <Tooltip title="Xóa">
                                <DeleteOutlined onClick={() => handleDeleteProduct(product.id)} />
                              </Tooltip>
                            ),
                          ].filter(Boolean)}
                        >
                          <Card.Meta
                            title={
                              <div>
                                <div className={styles.productName}>{product.name}</div>
                                <Tag color="blue">{product.brand}</Tag>
                              </div>
                            }
                            description={
                              <Space direction="vertical" style={{ width: "100%" }}>
                                <div className={styles.productPrice}>
                                  {product.price.toLocaleString("vi-VN")}₫
                                </div>
                                <div className={styles.productSpecs}>
                                  <span>
                                    <ThunderboltOutlined /> {product.capacity}kWh
                                  </span>
                                  <span>
                                    <SafetyOutlined /> {product.batteryHealth}%
                                  </span>
                                </div>
                                <div className={styles.productStats}>
                                  <span><EyeOutlined /> {product.views}</span>
                                  <span><HeartOutlined /> {product.favorites}</span>
                                  <span><MessageOutlined /> {product.messages}</span>
                                </div>
                              </Space>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Table View for Desktop */}
                <div className={styles.tableView}>
                  <Table
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </div>
              </>
            ) : (
              <Empty description="Chưa có sản phẩm nào" />
            )}
          </Card>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Đăng sản phẩm mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={900}
        className={styles.productModal}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
        centered={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitProduct}
          initialValues={{
            condition: "Tốt",
            batteryHealth: 85,
            usageYears: 1,
            warrantyPolicy: "3 tháng",
            returnPolicy: "Đổi trả trong 7 ngày",
            shippingPolicy: "Người mua chịu phí",
            installationSupport: "Không hỗ trợ",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              >
                <Input placeholder="VD: Pin LFP 100Ah" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="brand"
                label="Thương hiệu"
                rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
              >
                <Select placeholder="Chọn thương hiệu" size="large">
                  <Option value="CATL">CATL</Option>
                  <Option value="BYD">BYD</Option>
                  <Option value="Samsung SDI">Samsung SDI</Option>
                  <Option value="LG Energy">LG Energy</Option>
                  <Option value="Panasonic">Panasonic</Option>
                  <Option value="VinFast">VinFast</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="capacity"
                label="Dung lượng (kWh)"
                rules={[{ required: true, message: "Vui lòng nhập dung lượng" }]}
              >
                <InputNumber
                  placeholder="100"
                  style={{ width: "100%" }}
                  min={1}
                  max={1000}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="voltage"
                label="Điện áp (V)"
                rules={[{ required: true, message: "Vui lòng nhập điện áp" }]}
              >
                <InputNumber
                  placeholder="48"
                  style={{ width: "100%" }}
                  min={1}
                  max={1000}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="usageYears"
                label="Số năm sử dụng"
                rules={[{ required: true, message: "Vui lòng nhập số năm" }]}
              >
                <InputNumber
                  placeholder="1"
                  style={{ width: "100%" }}
                  min={0}
                  max={20}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá bán (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập giá" }]}
              >
                <InputNumber
                  placeholder="15000000"
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="originalPrice" label="Giá gốc (VNĐ)">
                <InputNumber
                  placeholder="18000000"
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="condition"
                label="Tình trạng"
                rules={[{ required: true, message: "Vui lòng chọn tình trạng" }]}
              >
                <Select placeholder="Chọn tình trạng" size="large">
                  <Option value="Như mới">Như mới</Option>
                  <Option value="Tốt">Tốt</Option>
                  <Option value="Khá">Khá</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="batteryHealth"
                label="Độ khỏe pin (%)"
                rules={[{ required: true, message: "Vui lòng nhập độ khỏe pin" }]}
              >
                <InputNumber
                  placeholder="85"
                  style={{ width: "100%" }}
                  min={50}
                  max={100}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="location"
            label="Địa điểm"
            rules={[{ required: true, message: "Vui lòng chọn địa điểm" }]}
          >
            <Select placeholder="Chọn địa điểm" size="large">
              <Option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</Option>
              <Option value="Hà Nội">Hà Nội</Option>
              <Option value="Đà Nẵng">Đà Nẵng</Option>
              <Option value="Cần Thơ">Cần Thơ</Option>
              <Option value="Hải Phòng">Hải Phòng</Option>
              <Option value="Biên Hòa">Biên Hòa</Option>
              <Option value="Nha Trang">Nha Trang</Option>
              <Option value="Vũng Tàu">Vũng Tàu</Option>
            </Select>
          </Form.Item>

          <Form.Item name="image" label="URL hình ảnh">
            <Input
              placeholder="https://example.com/image.jpg"
              size="large"
            />
          </Form.Item>

          <Divider orientation="left">Chi tiết sản phẩm</Divider>

          <Form.Item
            name="description"
            label="Mô tả chi tiết"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả sản phẩm" },
              { min: 50, message: "Mô tả cần ít nhất 50 ký tự" },
            ]}
          >
            <TextArea
              placeholder="Nhập mô tả chi tiết về sản phẩm: xuất xứ, lịch sử sử dụng, tình trạng hiện tại, lý do bán..."
              rows={5}
              showCount
              maxLength={1000}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="advantages"
            label="Ưu điểm nổi bật"
            rules={[
              { required: true, message: "Vui lòng nhập ưu điểm sản phẩm" },
            ]}
            tooltip="Nhập mỗi ưu điểm trên một dòng"
          >
            <TextArea
              placeholder="VD:&#10;- Dung lượng cao, phù hợp nhiều ứng dụng&#10;- Thời gian sạc nhanh&#10;- Giá cả hợp lý&#10;- Đã kiểm tra kỹ lưỡng"
              rows={6}
              showCount
              maxLength={500}
              size="large"
            />
          </Form.Item>

          <Divider orientation="left">Chính sách bán hàng</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="warrantyPolicy"
                label="Chính sách bảo hành"
                rules={[
                  { required: true, message: "Vui lòng nhập chính sách bảo hành" },
                ]}
              >
                <Select placeholder="Chọn thời gian bảo hành" size="large">
                  <Option value="Không bảo hành">Không bảo hành</Option>
                  <Option value="1 tháng">Bảo hành 1 tháng</Option>
                  <Option value="3 tháng">Bảo hành 3 tháng</Option>
                  <Option value="6 tháng">Bảo hành 6 tháng</Option>
                  <Option value="12 tháng">Bảo hành 12 tháng</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="returnPolicy"
                label="Chính sách đổi trả"
                rules={[
                  { required: true, message: "Vui lòng chọn chính sách đổi trả" },
                ]}
              >
                <Select placeholder="Chọn chính sách đổi trả" size="large">
                  <Option value="Không hỗ trợ đổi trả">Không hỗ trợ đổi trả</Option>
                  <Option value="Đổi trả trong 7 ngày">Đổi trả trong 7 ngày</Option>
                  <Option value="Đổi trả trong 15 ngày">Đổi trả trong 15 ngày</Option>
                  <Option value="Đổi trả trong 30 ngày">Đổi trả trong 30 ngày</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="shippingPolicy"
                label="Chính sách vận chuyển"
                rules={[
                  { required: true, message: "Vui lòng chọn chính sách vận chuyển" },
                ]}
              >
                <Select placeholder="Chọn chính sách vận chuyển" size="large">
                  <Option value="Người mua chịu phí">Người mua chịu phí vận chuyển</Option>
                  <Option value="Miễn phí trong thành phố">Miễn phí trong thành phố</Option>
                  <Option value="Miễn phí toàn quốc">Miễn phí vận chuyển toàn quốc</Option>
                  <Option value="Giao tận nơi miễn phí">Giao tận nơi miễn phí (trong 10km)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="installationSupport"
                label="Hỗ trợ lắp đặt"
                rules={[
                  { required: true, message: "Vui lòng chọn hỗ trợ lắp đặt" },
                ]}
              >
                <Select placeholder="Chọn hỗ trợ lắp đặt" size="large">
                  <Option value="Không hỗ trợ">Không hỗ trợ lắp đặt</Option>
                  <Option value="Hướng dẫn qua điện thoại">Hướng dẫn qua điện thoại</Option>
                  <Option value="Hỗ trợ lắp đặt tại nhà">Hỗ trợ lắp đặt tại nhà (phí 500k)</Option>
                  <Option value="Lắp đặt miễn phí">Lắp đặt miễn phí tại nhà</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="additionalNotes"
            label="Ghi chú thêm (không bắt buộc)"
          >
            <TextArea
              placeholder="Thông tin bổ sung khác: thời gian giao hàng, yêu cầu đặc biệt, khuyến mãi..."
              rows={3}
              showCount
              maxLength={300}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}
                size="large"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                {editingProduct ? "Cập nhật" : "Tiếp tục"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Package Selection Modal */}
      <Modal
        title={
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            <CrownOutlined style={{ marginRight: 8 }} />
            Chọn gói đăng tin cho sản phẩm
          </div>
        }
        open={packageModalVisible}
        onCancel={() => {
          setPackageModalVisible(false);
          setSelectedProductForPackage(null);
        }}
        footer={null}
        width={1000}
        className={styles.packageModal}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
        centered={false}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: "#8c8c8c" }}>
            Chọn gói đăng tin phù hợp để tăng khả năng tiếp cận và bán hàng nhanh hơn
          </p>
        </div>

        <Row gutter={[16, 16]}>
          {postPackages.map((pkg) => (
            <Col xs={24} sm={12} md={6} key={pkg.id}>
              <Card
                hoverable
                className={styles.packageCard}
                style={{
                  border: pkg.popular ? "2px solid #FFD700" : "1px solid #d9d9d9",
                  position: "relative",
                }}
              >
                {pkg.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      right: 10,
                      background: "#FFD700",
                      color: "#000",
                      padding: "4px 12px",
                      borderRadius: 16,
                      fontSize: 12,
                      fontWeight: 700,
                      zIndex: 1,
                    }}
                  >
                    <FireOutlined /> Phổ biến
                  </div>
                )}

                <div
                  style={{
                    textAlign: "center",
                    padding: "20px 0",
                    background: pkg.gradient,
                    margin: "-24px -24px 16px",
                    borderRadius: "8px 8px 0 0",
                  }}
                >
                  <h3
                    style={{
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: 700,
                      margin: "0 0 8px 0",
                    }}
                  >
                    {pkg.name}
                  </h3>
                  <div style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>
                    {pkg.price === 0 ? (
                      "Miễn phí"
                    ) : (
                      <>
                        {pkg.price.toLocaleString("vi-VN")}
                        <span style={{ fontSize: 14 }}>₫</span>
                      </>
                    )}
                  </div>
                  <div style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>
                    {pkg.duration} ngày
                  </div>
                </div>

                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  {pkg.features.map((feature, index) => (
                    <div
                      key={index}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <span style={{ fontSize: 13 }}>{feature}</span>
                    </div>
                  ))}
                </Space>

                <Button
                  type={pkg.popular ? "primary" : "default"}
                  block
                  size="large"
                  icon={pkg.price === 0 ? <CheckCircleOutlined /> : <ShoppingOutlined />}
                  onClick={() => handleSelectPackage(pkg)}
                  style={{
                    marginTop: 16,
                    ...(pkg.popular && {
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                    }),
                  }}
                >
                  {pkg.price === 0 ? "Sử dụng miễn phí" : "Chọn gói này"}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "#f5f7fa",
            borderRadius: 8,
          }}
        >
          <h4 style={{ margin: "0 0 8px 0" }}>
            <InfoCircleOutlined style={{ marginRight: 8 }} />
            Lưu ý:
          </h4>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#595959" }}>
            <li>Gói Đồng hoàn toàn miễn phí, phù hợp để thử nghiệm</li>
            <li>Gói càng cao, sản phẩm hiển thị càng ưu tiên và lâu hơn</li>
            <li>Bạn có thể nâng cấp gói bất cứ lúc nào</li>
            <li>Sau khi thanh toán, sản phẩm sẽ được duyệt trong 24h</li>
          </ul>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default CustomerPage;
