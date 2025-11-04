import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Space,
  Statistic,
  Badge,
  Tooltip,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tabs,
  Spin,
  Empty,
} from "antd";
import {
  CrownOutlined,
  ThunderboltOutlined,
  StarOutlined,
  CheckCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  RocketOutlined,
  SafetyOutlined,
  ShoppingCartOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Header, Footer } from "../../components/layout";
import api from "../../configs/axios";
import styles from "./PackagesPage.module.css";

const { Meta } = Card;
const { TabPane } = Tabs;

const PackagesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch packages from API on mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/PostPackage/active");
      
      console.log("✅ API Response:", response.data);
      
      if (!response.data || response.data.length === 0) {
        message.warning("Hiện tại chưa có gói đăng tin nào!");
        setPackages([]);
        return;
      }
      
      // Transform API data to match frontend format
      const transformedPackages = response.data.map((pkg) => {
        let features = [];
        let benefits = [];
        
        try {
          features = typeof pkg.features === 'string' 
            ? JSON.parse(pkg.features) 
            : (Array.isArray(pkg.features) ? pkg.features : []);
        } catch (e) {
          features = [];
        }
        
        try {
          benefits = typeof pkg.benefits === 'string' 
            ? JSON.parse(pkg.benefits) 
            : (Array.isArray(pkg.benefits) ? pkg.benefits : []);
        } catch (e) {
          benefits = [];
        }

        const formattedFeatures = features.map(feature => ({
          text: typeof feature === 'string' ? feature : feature.text || '',
          icon: <CheckCircleOutlined />,
          disabled: false
        }));

        // Xác định thời gian mặc định dựa trên tier
        const tierLower = (pkg.packageName || pkg.name || "").toLowerCase();
        let defaultDisplayDays = 3; // Mặc định cho Cơ Bản
        if (tierLower.includes("tiêu chuẩn") || tierLower.includes("standard") || tierLower.includes("silver")) {
          defaultDisplayDays = 7;
        } else if (tierLower.includes("premium") || tierLower.includes("cao cấp") || tierLower.includes("diamond")) {
          defaultDisplayDays = 20;
        }

        return {
          id: pkg.id || pkg.packageId,
          name: pkg.packageName || pkg.name || "Gói đăng tin",
          tier: (pkg.packageName || pkg.name || "").toLowerCase().replace(/\s+/g, "-"),
          icon: getIconByTier(pkg.packageName || pkg.name),
          pricePerPost: pkg.price || pkg.pricePerPost || 0,
          originalPrice: pkg.originalPrice || 0,
          minPosts: pkg.minPosts || 1,
          maxPosts: pkg.maxPosts || 100,
          color: getColorByTier(pkg.packageName || pkg.name),
          gradient: getGradientByTier(pkg.packageName || pkg.name),
          popular: pkg.isPopular || false,
          features: formattedFeatures,
          displayDays: pkg.durationDays || pkg.displayDays || defaultDisplayDays,
          priority: pkg.priority || "Trung bình",
          support: pkg.support || "Email",
          badge: pkg.badge || null,
          benefits: benefits,
          description: pkg.description || "",
          isActive: pkg.isActive !== false,
        };
      });

      setPackages(transformedPackages);
      message.success(`Đã tải ${transformedPackages.length} gói thành công!`);
    } catch (error) {
      console.error("❌ Error fetching packages:", error);
      message.error("Không thể tải danh sách gói từ server!");
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for icons and colors
  const getIconByTier = (tier) => {
    const tierLower = tier?.toLowerCase() || "";
    if (tierLower.includes("basic") || tierLower.includes("cơ bản")) return <TrophyOutlined />;
    if (tierLower.includes("silver") || tierLower.includes("bạc") || tierLower.includes("tiết kiệm")) return <StarOutlined />;
    if (tierLower.includes("gold") || tierLower.includes("vàng") || tierLower.includes("phổ biến")) return <FireOutlined />;
    if (tierLower.includes("diamond") || tierLower.includes("kim cương") || tierLower.includes("cao cấp")) return <CrownOutlined />;
    return <StarOutlined />;
  };

  const getColorByTier = (tier) => {
    const tierLower = tier?.toLowerCase() || "";
    if (tierLower.includes("basic") || tierLower.includes("cơ bản")) return "#CD7F32";
    if (tierLower.includes("silver") || tierLower.includes("bạc") || tierLower.includes("tiết kiệm")) return "#C0C0C0";
    if (tierLower.includes("gold") || tierLower.includes("vàng") || tierLower.includes("phổ biến")) return "#FFD700";
    if (tierLower.includes("diamond") || tierLower.includes("kim cương") || tierLower.includes("cao cấp")) return "#B9F2FF";
    return "#1890ff";
  };

  const getGradientByTier = (tier) => {
    const tierLower = tier?.toLowerCase() || "";
    if (tierLower.includes("basic") || tierLower.includes("cơ bản")) return "linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)";
    if (tierLower.includes("silver") || tierLower.includes("bạc") || tierLower.includes("tiết kiệm")) return "linear-gradient(135deg, #E8E8E8 0%, #A8A8A8 100%)";
    if (tierLower.includes("gold") || tierLower.includes("vàng") || tierLower.includes("phổ biến")) return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
    if (tierLower.includes("diamond") || tierLower.includes("kim cương") || tierLower.includes("cao cấp")) return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
  };

  const handleSelectPackage = (pkg) => {
    // Kiểm tra đăng nhập trước khi chuyển tới trang thanh toán
    const isAuth = !!(
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
    if (!isAuth) {
      message.info("Vui lòng đăng nhập để mua bài đăng");
      navigate(
        `/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`
      );
      return;
    }
    
    // Chuyển trực tiếp đến trang thanh toán
    const packageData = {
      id: pkg.id,
      name: pkg.name,
      tier: pkg.tier,
      pricePerPost: pkg.pricePerPost,
      originalPrice: pkg.originalPrice,
      quantity: 1,
      totalPrice: pkg.pricePerPost,
      color: pkg.color,
      gradient: pkg.gradient,
      displayDays: pkg.displayDays,
      priority: pkg.priority,
      support: pkg.support,
      badge: pkg.badge,
      features: pkg.features.map((f) => f.text),
      benefits: pkg.benefits,
    };
    navigate("/payment", {
      state: {
        type: "package",
        package: packageData,
      },
    });
  };

  const handlePurchase = (values) => {
    // Function này không còn dùng nữa, giữ lại để tránh lỗi
    navigate("/payment", {
      state: {
        type: "package",
        package: {
          ...selectedPackage,
          features: selectedPackage.features.map((f) => f.text),
        },
        userData: values,
      },
    });
    setModalVisible(false);
  };

  const getPackagesByTab = () => {
    if (activeTab === "all") return packages;
    if (activeTab === "free") return packages.filter((p) => p.price === 0);
    if (activeTab === "paid") return packages.filter((p) => p.price > 0);
    if (activeTab === "popular") return packages.filter((p) => p.popular);
    return packages;
  };

  return (
    <div className={styles.packagesPage}>
      <Header />

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <RocketOutlined /> Đăng Tin Linh Hoạt - Thanh Toán Theo Bài
          </h1>
          <p className={styles.heroSubtitle}>
            Chọn số lượng bài đăng phù hợp - Chỉ trả tiền cho những gì bạn cần
          </p>
          <div className={styles.heroStats}>
            <Statistic
              title="Người dùng hoạt động"
              value={15420}
              prefix={<ThunderboltOutlined />}
              suffix="+"
            />
            <Statistic
              title="Giao dịch thành công"
              value={8750}
              prefix={<CheckCircleOutlined />}
              suffix="+"
            />
            <Statistic
              title="Đánh giá 5 sao"
              value={98}
              suffix="%"
              prefix={<StarOutlined />}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.contentWrapper}>
        {/* Information Section */}
        <div className={styles.infoSection}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className={styles.infoCard} bordered={false}>
                <ThunderboltOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
                <h3>Linh Hoạt Tối Đa</h3>
                <p>Chọn số lượng bài đăng phù hợp với nhu cầu. Không bị ràng buộc gói cố định, chỉ trả tiền cho những gì bạn sử dụng.</p>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className={styles.infoCard} bordered={false}>
                <SafetyOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 16 }} />
                <h3>Bảo Mật & Uy Tín</h3>
                <p>Tin đăng của bạn được kiểm duyệt kỹ lưỡng, hiển thị cho đúng khách hàng tiềm năng với độ tin cậy cao nhất.</p>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className={styles.infoCard} bordered={false}>
                <RocketOutlined style={{ fontSize: 32, color: '#722ed1', marginBottom: 16 }} />
                <h3>Tăng Trưởng Nhanh</h3>
                <p>Các gói cao cấp giúp tin của bạn được ưu tiên hiển thị, tăng lượt xem và tỷ lệ chuyển đổi đáng kể.</p>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Packages Grid */}
        <Row gutter={[24, 24]} className={styles.packagesGrid} justify="center">
          {getPackagesByTab().map((pkg) => (
            <Col xs={24} sm={12} md={12} lg={8} xl={6} key={pkg.id}>
              <Badge.Ribbon
                text={pkg.popular ? "Phổ biến nhất" : null}
                color="red"
                style={{ display: pkg.popular ? "block" : "none" }}
              >
                <Card
                  className={`${styles.packageCard} ${
                    pkg.popular ? styles.popularCard : ""
                  }`}
                  hoverable
                  bordered={false}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  {/* Package Header */}
                  <div
                    className={styles.packageHeader}
                    style={{ background: pkg.gradient }}
                  >
                    <div className={styles.packageIcon}>{pkg.icon}</div>
                    <h3 className={styles.packageName}>{pkg.name}</h3>
                    <Tag
                      color={pkg.tier}
                      className={styles.tierTag}
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        border: "none",
                        color: "#fff",
                      }}
                    >
                      {pkg.tier.toUpperCase()}
                    </Tag>
                  </div>

                  {/* Package Price */}
                  <div className={styles.packagePrice}>
                    {pkg.pricePerPost === 0 ? (
                      <div className={styles.freePrice}>
                        <span className={styles.priceAmount}>Miễn phí</span>
                        <span className={styles.postLimit}>Tối đa {pkg.maxPosts} bài</span>
                      </div>
                    ) : (
                      <>
                        <div className={styles.priceInfo}>
                          {pkg.originalPrice > pkg.pricePerPost && (
                            <span className={styles.originalPrice}>
                              {pkg.originalPrice.toLocaleString("vi-VN")}₫
                            </span>
                          )}
                          <span className={styles.priceAmount}>
                            {pkg.pricePerPost.toLocaleString("vi-VN")}₫
                          </span>
                          <span className={styles.priceUnit}>/bài đăng</span>
                        </div>
                        {pkg.originalPrice > pkg.pricePerPost && (
                          <Tag color="red" className={styles.discountTag}>
                            Giảm {Math.round((1 - pkg.pricePerPost / pkg.originalPrice) * 100)}%
                          </Tag>
                        )}
                      </>
                    )}
                  </div>

                  {/* Package Details */}
                  <div className={styles.packageDetails}>
                    <Row gutter={[8, 12]}>
                      <Col span={12}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailIcon}>⏱️</span>
                          <div className={styles.detailContent}>
                            <div className={styles.detailLabel}>Thời hạn</div>
                            <div className={styles.detailValue}>{pkg.displayDays} ngày/bài</div>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailIcon}>🎯</span>
                          <div className={styles.detailContent}>
                            <div className={styles.detailLabel}>Ưu tiên</div>
                            <div className={styles.detailValue}>{pkg.priority}</div>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailIcon}>💬</span>
                          <div className={styles.detailContent}>
                            <div className={styles.detailLabel}>Hỗ trợ</div>
                            <div className={styles.detailValue}>{pkg.support}</div>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailIcon}>
                            {pkg.badge ? '🏆' : '📝'}
                          </span>
                          <div className={styles.detailContent}>
                            <div className={styles.detailLabel}>Huy hiệu</div>
                            <div className={styles.detailValue}>
                              {pkg.badge || 'Không'}
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Package Features */}
                  <div className={styles.packageFeatures} style={{ flex: 1 }}>
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ width: "100%" }}
                    >
                      {pkg.features.map((feature, index) => (
                        <div
                          key={index}
                          className={`${styles.featureItem} ${
                            feature.disabled ? styles.featureDisabled : ""
                          }`}
                        >
                          <span className={styles.featureIcon}>
                            {feature.icon}
                          </span>
                          <span className={styles.featureText}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </Space>
                  </div>

                  {/* Package Benefits */}
                  <div className={styles.packageBenefits}>
                    <ul>
                      {pkg.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>

        {/* Comparison Table Section */}
        <div className={styles.comparisonSection}>
          <h2 className={styles.sectionTitle}>
            <InfoCircleOutlined /> So Sánh Chi Tiết Các Gói
          </h2>
          <div className={styles.tableWrapper}>
            <table className={styles.comparisonTable}>
              <thead>
                <tr>
                  <th>Tính năng</th>
                  <th>
                    <div className={styles.tableHeader}>
                      <TrophyOutlined />
                      <span>Gói Cơ Bản</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <StarOutlined />
                      <span>Gói Tiêu Chuẩn</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <CrownOutlined />
                      <span>Gói Premium</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Giá/bài đăng</strong></td>
                  <td>50.000₫</td>
                  <td>90.000₫</td>
                  <td>180.000₫</td>
                </tr>
                {/* <tr>
                  <td><strong>Số lượng tối đa</strong></td>
                  <td>3 bài</td>
                  <td>50 bài</td>
                  <td>500 bài</td>
                </tr> */}
                <tr>
                  <td><strong>Thời gian hiển thị</strong></td>
                  <td>3 ngày</td>
                  <td>7 ngày</td>
                  <td>20 ngày</td>
                </tr>
                <tr>
                  <td><strong>Mức độ ưu tiên</strong></td>
                  <td>Thấp</td>
                  <td>Trung bình</td>
                  <td>Tối đa</td>
                </tr>
                <tr>
                  <td><strong>Hỗ trợ khách hàng</strong></td>
                  <td>Email</td>
                  <td>Email + Chat</td>
                  <td>VIP 24/7</td>
                </tr>
                <tr>
                  <td><strong>Huy hiệu</strong></td>
                  <td>Bạc</td>
                  <td>Vàng</td>
                  <td>Kim Cương</td>
                </tr>
                <tr>
                  <td><strong>Thống kê & phân tích</strong></td>
                  <td>❌</td>
                  <td>Cơ bản</td>
                  <td>AI nâng cao</td>
                </tr>
                <tr>
                  <td><strong>Đẩy tin tự động</strong></td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅ Cao cấp</td>
                </tr>
                <tr>
                  <td><strong>Tư vấn chiến lược</strong></td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Câu Hỏi Thường Gặp</h2>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card className={styles.faqCard}>
                <h4>Bài đăng có thời hạn bao lâu?</h4>
                <p>
                  Thời hạn hiển thị tùy thuộc vào gói bạn chọn: Cơ Bản (3 ngày),
                  Tiết Kiệm (7 ngày), Phổ Biến (14 ngày), Cao Cấp (30 ngày).
                  Sau thời hạn, bài đăng sẽ tự động ẩn khỏi trang chủ.
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className={styles.faqCard}>
                <h4>Mỗi lần mua được bao nhiêu bài đăng?</h4>
                <p>
                  Mỗi lần mua bạn sẽ nhận được 1 bài đăng. Bạn có thể mua nhiều
                  lần và số bài đăng sẽ được cộng dồn vào tài khoản để sử dụng
                  linh hoạt khi cần.
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className={styles.faqCard}>
                <h4>Tại sao các gói có giá khác nhau?</h4>
                <p>
                  Giá phụ thuộc vào thời gian hiển thị và tính năng: Gói Tiết Kiệm
                  (50.000₫), Gói Phổ Biến (100.000₫), Gói Cao Cấp (150.000₫). 
                  Gói cao hơn có thời gian hiển thị dài hơn và nhiều tính năng hơn.
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className={styles.faqCard}>
                <h4>Có được hoàn tiền không?</h4>
                <p>
                  Chúng tôi có chính sách hoàn tiền trong vòng 24 giờ nếu bạn
                  chưa sử dụng bài đăng. Sau khi đã đăng tin, bạn sẽ không được
                  hoàn tiền.
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Purchase Modal */}
      <Modal
        title={
          <Space>
            {selectedPackage?.icon}
            <span>Đăng ký {selectedPackage?.name}</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        className={styles.purchaseModal}
      >
        {selectedPackage && (
          <>
            <div className={styles.modalSummary}>
              <div className={styles.summaryItem}>
                <span>Gói đã chọn:</span>
                <strong>{selectedPackage.name}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Giá:</span>
                <strong className={styles.price}>
                  {selectedPackage.price === 0
                    ? "Miễn phí"
                    : `${selectedPackage.price.toLocaleString("vi-VN")}₫`}
                </strong>
              </div>
              <div className={styles.summaryItem}>
                <span>Thời hạn:</span>
                <strong>{selectedPackage.duration}</strong>
              </div>
            </div>

            <Form layout="vertical" onFinish={handlePurchase}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input size="large" placeholder="Nguyễn Văn A" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input size="large" placeholder="example@email.com" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input size="large" placeholder="0901234567" />
              </Form.Item>

              {selectedPackage.price > 0 && (
                <Form.Item
                  label="Phương thức thanh toán"
                  name="paymentMethod"
                  rules={[
                    { required: true, message: "Vui lòng chọn phương thức" },
                  ]}
                >
                  <Select size="large" placeholder="Chọn phương thức">
                    <Select.Option value="bank">
                      Chuyển khoản ngân hàng
                    </Select.Option>
                    <Select.Option value="momo">Ví MoMo</Select.Option>
                    <Select.Option value="zalopay">ZaloPay</Select.Option>
                    <Select.Option value="vnpay">VNPay</Select.Option>
                    <Select.Option value="card">
                      Thẻ tín dụng/ghi nợ
                    </Select.Option>
                  </Select>
                </Form.Item>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  icon={<ShoppingCartOutlined />}
                >
                  {selectedPackage.price === 0
                    ? "Kích hoạt ngay"
                    : "Xác nhận thanh toán"}
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>

      <Footer />
    </div>
  );
};

export default PackagesPage;
