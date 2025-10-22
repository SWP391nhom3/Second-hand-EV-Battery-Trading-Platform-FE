import React, { useState } from "react";
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
import styles from "./PackagesPage.module.css";

const { Meta } = Card;
const { TabPane } = Tabs;

const PackagesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Dữ liệu các gói đăng tin
  const packages = [
    {
      id: 1,
      name: "Gói Đồng",
      tier: "bronze",
      icon: <TrophyOutlined />,
      price: 0,
      duration: "Miễn phí",
      color: "#CD7F32",
      gradient: "linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)",
      popular: false,
      features: [
        { text: "3 tin đăng/tháng", icon: <CheckCircleOutlined /> },
        { text: "Hiển thị 7 ngày", icon: <CheckCircleOutlined /> },
        { text: "Hỗ trợ cơ bản", icon: <CheckCircleOutlined /> },
        {
          text: "Không ưu tiên hiển thị",
          icon: <CheckCircleOutlined />,
          disabled: true,
        },
        {
          text: "Không huy hiệu",
          icon: <CheckCircleOutlined />,
          disabled: true,
        },
      ],
      limits: {
        posts: 3,
        days: 7,
        priority: "Thấp",
        support: "Email",
      },
      benefits: [
        "Đăng tin cơ bản",
        "Phù hợp người mới bắt đầu",
        "Không mất phí",
      ],
    },
    {
      id: 2,
      name: "Gói Bạc",
      tier: "silver",
      icon: <StarOutlined />,
      price: 199000,
      duration: "1 tháng",
      color: "#C0C0C0",
      gradient: "linear-gradient(135deg, #E8E8E8 0%, #A8A8A8 100%)",
      popular: false,
      features: [
        { text: "10 tin đăng/tháng", icon: <CheckCircleOutlined /> },
        { text: "Hiển thị 14 ngày", icon: <CheckCircleOutlined /> },
        { text: "Huy hiệu Bạc", icon: <CheckCircleOutlined /> },
        { text: "Ưu tiên hiển thị thấp", icon: <CheckCircleOutlined /> },
        { text: "Hỗ trợ email ưu tiên", icon: <CheckCircleOutlined /> },
      ],
      limits: {
        posts: 10,
        days: 14,
        priority: "Trung bình",
        support: "Email + Chat",
      },
      benefits: [
        "Tăng khả năng tiếp cận",
        "Huy hiệu tin cậy",
        "Thống kê cơ bản",
      ],
    },
    {
      id: 3,
      name: "Gói Vàng",
      tier: "gold",
      icon: <FireOutlined />,
      price: 499000,
      duration: "1 tháng",
      color: "#FFD700",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      popular: true,
      features: [
        { text: "30 tin đăng/tháng", icon: <CheckCircleOutlined /> },
        { text: "Hiển thị 30 ngày", icon: <CheckCircleOutlined /> },
        { text: "Huy hiệu Vàng", icon: <CheckCircleOutlined /> },
        { text: "Ưu tiên hiển thị cao", icon: <CheckCircleOutlined /> },
        { text: "Hỗ trợ 24/7", icon: <CheckCircleOutlined /> },
        { text: "Đẩy tin tự động", icon: <CheckCircleOutlined /> },
        { text: "Thống kê chi tiết", icon: <CheckCircleOutlined /> },
      ],
      limits: {
        posts: 30,
        days: 30,
        priority: "Cao",
        support: "24/7 VIP",
      },
      benefits: [
        "Tối ưu doanh số",
        "Tiếp cận tối đa",
        "Công cụ marketing",
        "Dashboard chuyên nghiệp",
      ],
    },
    {
      id: 4,
      name: "Gói Kim Cương",
      tier: "diamond",
      icon: <CrownOutlined />,
      price: 999000,
      duration: "1 tháng",
      color: "#B9F2FF",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      popular: false,
      features: [
        { text: "Không giới hạn tin đăng", icon: <CheckCircleOutlined /> },
        { text: "Hiển thị vĩnh viễn", icon: <CheckCircleOutlined /> },
        { text: "Huy hiệu Kim Cương", icon: <CheckCircleOutlined /> },
        { text: "Ưu tiên tối đa", icon: <CheckCircleOutlined /> },
        { text: "Hỗ trợ VIP 24/7", icon: <CheckCircleOutlined /> },
        { text: "Đẩy tin tự động cao cấp", icon: <CheckCircleOutlined /> },
        { text: "Thống kê & phân tích AI", icon: <CheckCircleOutlined /> },
        { text: "Quản lý tài khoản riêng", icon: <CheckCircleOutlined /> },
        { text: "Đề xuất khách hàng tiềm năng", icon: <CheckCircleOutlined /> },
      ],
      limits: {
        posts: "Không giới hạn",
        days: "Vĩnh viễn",
        priority: "Tối đa",
        support: "VIP 24/7 + Manager",
      },
      benefits: [
        "Dành cho doanh nghiệp",
        "Tối ưu doanh thu tối đa",
        "AI hỗ trợ bán hàng",
        "Báo cáo chi tiết",
        "Tư vấn chiến lược",
      ],
    },
  ];

  const handleSelectPackage = (pkg) => {
    // Kiểm tra đăng nhập trước khi chuyển tới trang thanh toán
    const isAuth = !!(
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
    if (!isAuth) {
      message.info("Vui lòng đăng nhập để đăng ký gói");
      navigate(
        `/login?redirect=${encodeURIComponent(
          location.pathname + location.search
        )}`
      );
      return;
    }
    // Chuyển trực tiếp đến trang thanh toán (loại bỏ JSX element)
    const packageData = {
      id: pkg.id,
      name: pkg.name,
      tier: pkg.tier,
      price: pkg.price,
      duration: pkg.duration,
      color: pkg.color,
      gradient: pkg.gradient,
      features: pkg.features.map((f) => f.text),
      limits: pkg.limits,
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
            <RocketOutlined /> Nâng Cao Hiệu Quả Đăng Tin
          </h1>
          <p className={styles.heroSubtitle}>
            Chọn gói đăng tin phù hợp để tiếp cận hàng triệu khách hàng tiềm
            năng
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
        <div className={styles.tabsSection}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            size="large"
            className={styles.filterTabs}
          >
            <TabPane tab="Tất cả gói" key="all" />
            <TabPane tab="Miễn phí" key="free" />
            <TabPane tab="Trả phí" key="paid" />
            <TabPane tab="Phổ biến" key="popular" />
          </Tabs>
        </div>

        {/* Packages Grid */}
        <Row gutter={[24, 24]} className={styles.packagesGrid}>
          {getPackagesByTab().map((pkg) => (
            <Col xs={24} sm={12} lg={6} key={pkg.id}>
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
                    {pkg.price === 0 ? (
                      <div className={styles.freePrice}>
                        <span className={styles.priceAmount}>Miễn phí</span>
                      </div>
                    ) : (
                      <>
                        <span className={styles.priceAmount}>
                          {pkg.price.toLocaleString("vi-VN")}₫
                        </span>
                        <span className={styles.priceDuration}>
                          /{pkg.duration}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Package Features */}
                  <div className={styles.packageFeatures}>
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
                    <h4>
                      <SafetyOutlined /> Ưu điểm nổi bật
                    </h4>
                    <ul>
                      {pkg.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button
                    type="default"
                    size="large"
                    block
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleSelectPackage(pkg)}
                    className={styles.selectButton}
                  >
                    {pkg.price === 0 ? "Sử dụng ngay" : "Đăng ký ngay"}
                  </Button>

                  <div className={styles.packageInfo}>
                    <Tooltip title="Xem thông tin chi tiết">
                      <InfoCircleOutlined /> Chi tiết gói
                    </Tooltip>
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>

        {/* Comparison Table Section */}
        <div className={styles.comparisonSection}>
          <h2 className={styles.sectionTitle}>So Sánh Chi Tiết Các Gói</h2>
          <div className={styles.comparisonTable}>
            <table>
              <thead>
                <tr>
                  <th>Tính năng</th>
                  <th>
                    <div className={styles.tableHeader}>
                      <TrophyOutlined />
                      <span>Đồng</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <StarOutlined />
                      <span>Bạc</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <FireOutlined />
                      <span>Vàng</span>
                    </div>
                  </th>
                  <th>
                    <div className={styles.tableHeader}>
                      <CrownOutlined />
                      <span>Kim Cương</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Số tin đăng/tháng</td>
                  <td>3</td>
                  <td>10</td>
                  <td>30</td>
                  <td>Không giới hạn</td>
                </tr>
                <tr>
                  <td>Thời gian hiển thị</td>
                  <td>7 ngày</td>
                  <td>14 ngày</td>
                  <td>30 ngày</td>
                  <td>Vĩnh viễn</td>
                </tr>
                <tr>
                  <td>Mức độ ưu tiên</td>
                  <td>Thấp</td>
                  <td>Trung bình</td>
                  <td>Cao</td>
                  <td>Tối đa</td>
                </tr>
                <tr>
                  <td>Hỗ trợ khách hàng</td>
                  <td>Email</td>
                  <td>Email + Chat</td>
                  <td>24/7</td>
                  <td>VIP 24/7</td>
                </tr>
                <tr>
                  <td>Thống kê & phân tích</td>
                  <td>❌</td>
                  <td>Cơ bản</td>
                  <td>Chi tiết</td>
                  <td>AI nâng cao</td>
                </tr>
                <tr>
                  <td>Đẩy tin tự động</td>
                  <td>❌</td>
                  <td>❌</td>
                  <td>✅</td>
                  <td>✅ Cao cấp</td>
                </tr>
                <tr>
                  <td>Quản lý tài khoản riêng</td>
                  <td>❌</td>
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
                <h4>Làm thế nào để nâng cấp gói?</h4>
                <p>
                  Bạn có thể nâng cấp gói bất kỳ lúc nào từ trang quản lý tài
                  khoản. Phần chênh lệch sẽ được tính theo tỷ lệ thời gian còn
                  lại.
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className={styles.faqCard}>
                <h4>Có được hoàn tiền không?</h4>
                <p>
                  Chúng tôi có chính sách hoàn tiền trong vòng 7 ngày nếu bạn
                  chưa sử dụng bất kỳ tính năng nào của gói đã mua.
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className={styles.faqCard}>
                <h4>Tôi có thể hủy gói không?</h4>
                <p>
                  Có, bạn có thể hủy gói bất kỳ lúc nào. Gói sẽ vẫn hoạt động
                  đến hết chu kỳ thanh toán hiện tại.
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className={styles.faqCard}>
                <h4>Thanh toán như thế nào?</h4>
                <p>
                  Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng, chuyển khoản
                  ngân hàng, ví điện tử (Momo, ZaloPay, VNPay).
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
