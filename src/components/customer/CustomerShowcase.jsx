import React from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Space,
  Divider,
  Alert,
} from "antd";
import {
  RocketOutlined,
  StarOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  CrownOutlined,
  FireOutlined,
  GiftOutlined,
  SafetyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import styles from "./CustomerShowcase.module.css";

const { Title, Text, Paragraph } = Typography;

const CustomerShowcase = () => {
  return (
    <div className={styles.showcase}>
      <div className={styles.header}>
        <Title level={1}>🎨 Customer Dashboard Showcase</Title>
        <Paragraph style={{ fontSize: "16px", maxWidth: "800px", margin: "0 auto" }}>
          Bộ sưu tập các card components chuyên nghiệp với màu sắc và layout đẹp mắt.
          Tất cả components đều responsive và có animation effects.
        </Paragraph>
      </div>

      {/* Gradient Cards */}
      <section className={styles.section}>
        <Title level={2}>🌈 Gradient Cards</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.gradientCard} style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              <div style={{ color: "white", textAlign: "center" }}>
                <RocketOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
                <Title level={3} style={{ color: "white", margin: "8px 0" }}>
                  Pro Plan
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>
                  $99/tháng
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.gradientCard} style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
              <div style={{ color: "white", textAlign: "center" }}>
                <HeartOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
                <Title level={3} style={{ color: "white", margin: "8px 0" }}>
                  Premium
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>
                  $199/tháng
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.gradientCard} style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
              <div style={{ color: "white", textAlign: "center" }}>
                <StarOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
                <Title level={3} style={{ color: "white", margin: "8px 0" }}>
                  Elite
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>
                  $299/tháng
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.gradientCard} style={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }}>
              <div style={{ color: "white", textAlign: "center" }}>
                <CrownOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
                <Title level={3} style={{ color: "white", margin: "8px 0" }}>
                  VIP
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>
                  $499/tháng
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Statistic Cards */}
      <section className={styles.section}>
        <Title level={2}>📊 Statistic Cards</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ background: "#e6f7ff", color: "#1890ff" }}>
                  <TeamOutlined style={{ fontSize: "32px" }} />
                </div>
                <div>
                  <Text type="secondary">Tổng khách hàng</Text>
                  <Title level={2} style={{ margin: "8px 0" }}>12,458</Title>
                  <Text type="success">↑ 12% tháng này</Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ background: "#f6ffed", color: "#52c41a" }}>
                  <FireOutlined style={{ fontSize: "32px" }} />
                </div>
                <div>
                  <Text type="secondary">Doanh thu</Text>
                  <Title level={2} style={{ margin: "8px 0" }}>$89,542</Title>
                  <Text type="success">↑ 24% tháng này</Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ background: "#fff7e6", color: "#faad14" }}>
                  <TrophyOutlined style={{ fontSize: "32px" }} />
                </div>
                <div>
                  <Text type="secondary">Thành tích</Text>
                  <Title level={2} style={{ margin: "8px 0" }}>247</Title>
                  <Text type="warning">↑ 8% tháng này</Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className={styles.statCard} hoverable>
              <div className={styles.statContent}>
                <div className={styles.statIcon} style={{ background: "#fff1f0", color: "#ff4d4f" }}>
                  <ThunderboltOutlined style={{ fontSize: "32px" }} />
                </div>
                <div>
                  <Text type="secondary">Hoạt động</Text>
                  <Title level={2} style={{ margin: "8px 0" }}>3,892</Title>
                  <Text type="danger">↓ 3% tháng này</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Feature Cards */}
      <section className={styles.section}>
        <Title level={2}>⭐ Feature Cards</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card className={styles.featureCard} hoverable>
              <div style={{ textAlign: "center" }}>
                <div className={styles.featureIcon} style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                  <RocketOutlined style={{ fontSize: "40px", color: "white" }} />
                </div>
                <Title level={4}>Tốc độ cao</Title>
                <Paragraph type="secondary">
                  Hiệu suất tối ưu với công nghệ mới nhất. Load time dưới 1 giây.
                </Paragraph>
                <Button type="primary" icon={<ThunderboltOutlined />}>
                  Tìm hiểu thêm
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className={styles.featureCard} hoverable>
              <div style={{ textAlign: "center" }}>
                <div className={styles.featureIcon} style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
                  <SafetyOutlined style={{ fontSize: "40px", color: "white" }} />
                </div>
                <Title level={4}>Bảo mật</Title>
                <Paragraph type="secondary">
                  Mã hóa SSL 256-bit. Dữ liệu của bạn luôn được bảo vệ an toàn.
                </Paragraph>
                <Button type="primary" icon={<SafetyOutlined />}>
                  Tìm hiểu thêm
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className={styles.featureCard} hoverable>
              <div style={{ textAlign: "center" }}>
                <div className={styles.featureIcon} style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
                  <GiftOutlined style={{ fontSize: "40px", color: "white" }} />
                </div>
                <Title level={4}>Ưu đãi</Title>
                <Paragraph type="secondary">
                  Nhiều chương trình khuyến mãi hấp dẫn dành cho thành viên.
                </Paragraph>
                <Button type="primary" icon={<GiftOutlined />}>
                  Tìm hiểu thêm
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Pricing Cards */}
      <section className={styles.section}>
        <Title level={2}>💎 Pricing Cards</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card className={styles.pricingCard}>
              <div style={{ textAlign: "center" }}>
                <StarOutlined style={{ fontSize: "48px", color: "#C0C0C0" }} />
                <Title level={3}>Gói Bạc</Title>
                <Title level={1} style={{ color: "#1890ff", margin: "16px 0" }}>
                  $49<Text type="secondary" style={{ fontSize: "16px" }}>/tháng</Text>
                </Title>
                <Divider />
                <Space direction="vertical" size="small" style={{ width: "100%", textAlign: "left" }}>
                  <Text>✓ 10 tin đăng/tháng</Text>
                  <Text>✓ Hỗ trợ email</Text>
                  <Text>✓ Thống kê cơ bản</Text>
                  <Text type="secondary">✗ Ưu tiên hiển thị</Text>
                  <Text type="secondary">✗ API access</Text>
                </Space>
                <Divider />
                <Button type="default" size="large" block>
                  Chọn gói
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className={`${styles.pricingCard} ${styles.popularCard}`}>
              <div className={styles.popularBadge}>Phổ biến nhất</div>
              <div style={{ textAlign: "center" }}>
                <FireOutlined style={{ fontSize: "48px", color: "#FFD700" }} />
                <Title level={3}>Gói Vàng</Title>
                <Title level={1} style={{ color: "#1890ff", margin: "16px 0" }}>
                  $99<Text type="secondary" style={{ fontSize: "16px" }}>/tháng</Text>
                </Title>
                <Divider />
                <Space direction="vertical" size="small" style={{ width: "100%", textAlign: "left" }}>
                  <Text>✓ 30 tin đăng/tháng</Text>
                  <Text>✓ Hỗ trợ 24/7</Text>
                  <Text>✓ Thống kê nâng cao</Text>
                  <Text>✓ Ưu tiên hiển thị</Text>
                  <Text type="secondary">✗ API access</Text>
                </Space>
                <Divider />
                <Button type="primary" size="large" block>
                  Chọn gói
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className={styles.pricingCard}>
              <div style={{ textAlign: "center" }}>
                <CrownOutlined style={{ fontSize: "48px", color: "#B9F2FF" }} />
                <Title level={3}>Gói Kim Cương</Title>
                <Title level={1} style={{ color: "#1890ff", margin: "16px 0" }}>
                  $199<Text type="secondary" style={{ fontSize: "16px" }}>/tháng</Text>
                </Title>
                <Divider />
                <Space direction="vertical" size="small" style={{ width: "100%", textAlign: "left" }}>
                  <Text>✓ Không giới hạn tin</Text>
                  <Text>✓ Hỗ trợ VIP 24/7</Text>
                  <Text>✓ AI Analytics</Text>
                  <Text>✓ Ưu tiên tối đa</Text>
                  <Text>✓ Full API access</Text>
                </Space>
                <Divider />
                <Button type="primary" size="large" block>
                  Chọn gói
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Alert Cards */}
      <section className={styles.section}>
        <Title level={2}>⚡ Alert Cards</Title>
        <Space direction="vertical" size="large" style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
          <Alert
            message="Thành công!"
            description="Giao dịch của bạn đã được xử lý thành công. Chúng tôi đã gửi email xác nhận."
            type="success"
            showIcon
            closable
          />
          <Alert
            message="Thông tin quan trọng"
            description="Bạn có 3 tin nhắn mới từ khách hàng. Vui lòng kiểm tra hộp thư của bạn."
            type="info"
            showIcon
            closable
          />
          <Alert
            message="Cảnh báo"
            description="Gói của bạn sắp hết hạn. Vui lòng gia hạn để tiếp tục sử dụng dịch vụ."
            type="warning"
            showIcon
            closable
          />
          <Alert
            message="Lỗi thanh toán"
            description="Không thể xử lý thanh toán. Vui lòng kiểm tra thông tin thẻ và thử lại."
            type="error"
            showIcon
            closable
          />
        </Space>
      </section>

      {/* Footer */}
      <div className={styles.footer}>
        <Divider />
        <Text type="secondary">
          💡 <strong>Pro Tip:</strong> Tất cả components đều responsive, có animation effects và dark mode support.
        </Text>
      </div>
    </div>
  );
};

export default CustomerShowcase;
