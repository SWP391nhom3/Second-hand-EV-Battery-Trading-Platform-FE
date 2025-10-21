import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  Input,
  Radio,
  Steps,
  Divider,
  Space,
  Tag,
  message,
  Checkbox,
  Alert,
  Typography,
} from "antd";
import {
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Header, Footer } from "../../components/layout";
import styles from "./PaymentPage.module.css";

const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Lấy thông tin từ state - có thể là gói đăng tin hoặc sản phẩm
  const paymentData = location.state || {};
  const isPackage = paymentData.type === "package";
  const isProduct = paymentData.type === "product";
  const isPostPackage = paymentData.type === "post-package"; // Gói cho bài đăng

  // Xử lý dữ liệu cho gói đăng tin
  const packageData = isPackage || isPostPackage
    ? paymentData.package
    : null;

  // Xử lý dữ liệu cho sản phẩm
  const productData = isProduct
    ? paymentData.product
    : null;

  // Dữ liệu sản phẩm khi chọn gói cho bài đăng
  const postProductData = isPostPackage
    ? paymentData.product
    : null;

  // Dữ liệu mặc định nếu không có gì được truyền
  const defaultData = {
    id: 0,
    name: "Gói Vàng",
    price: 499000,
    duration: "1 tháng",
    features: ["30 tin đăng/tháng", "Hiển thị 30 ngày", "Huy hiệu Vàng"],
  };

  // Lấy dữ liệu hiển thị
  const displayData = packageData || productData || defaultData;
  const itemType = isPostPackage 
    ? "gói đăng tin cho sản phẩm" 
    : isPackage 
    ? "gói đăng tin" 
    : isProduct 
    ? "sản phẩm" 
    : "đơn hàng";
  const quantity = productData?.quantity || 1;

  const paymentMethods = [
    {
      id: "bank",
      name: "Chuyển khoản ngân hàng",
      icon: <BankOutlined />,
      description: "Chuyển khoản trực tiếp qua ngân hàng",
      recommended: true,
    },
    {
      id: "momo",
      name: "Ví MoMo",
      icon: <WalletOutlined />,
      description: "Thanh toán qua ví điện tử MoMo",
    },
    {
      id: "zalopay",
      name: "ZaloPay",
      icon: <WalletOutlined />,
      description: "Thanh toán qua ví điện tử ZaloPay",
    },
    {
      id: "vnpay",
      name: "VNPay",
      icon: <WalletOutlined />,
      description: "Thanh toán qua cổng VNPay",
    },
    {
      id: "card",
      name: "Thẻ tín dụng/ghi nợ",
      icon: <CreditCardOutlined />,
      description: "Visa, Mastercard, JCB",
    },
  ];

  const bankInfo = {
    bank: "Ngân hàng Vietcombank",
    accountNumber: "1234567890",
    accountName: "CONG TY TNHH EV BATTERY HUB",
    branch: "Chi nhánh TP. Hồ Chí Minh",
    content: `THANHTOAN ${displayData.name.toUpperCase().replace(/\s/g, "")}`,
  };

  const handleFormSubmit = (values) => {
    if (!agreedToTerms) {
      message.error("Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(1);
      message.success("Thông tin đã được xác nhận!");
    }, 1500);
  };

  const handlePaymentConfirm = () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(2);
      message.success("Thanh toán thành công!");
    }, 2000);
  };

  const steps = [
    {
      title: "Thông tin",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "Thanh toán",
      icon: <CreditCardOutlined />,
    },
    {
      title: "Hoàn tất",
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <div className={styles.paymentPage}>
      <Header />

      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(isProduct ? "/products" : "/packages")}
            size="large"
            className={styles.backButton}
          >
            Quay lại
          </Button>
          <Title level={2} className={styles.pageTitle}>
            <LockOutlined /> Thanh toán an toàn
          </Title>
          <Text className={styles.pageSubtitle}>
            {isPackage && "Thanh toán gói đăng tin - "}
            {isProduct && "Thanh toán sản phẩm - "}
            Thông tin của bạn được bảo mật với công nghệ mã hóa SSL 256-bit
          </Text>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Progress Steps */}
        <div className={styles.stepsContainer}>
          <Steps current={currentStep} className={styles.steps}>
            {steps.map((step, index) => (
              <Step key={index} title={step.title} icon={step.icon} />
            ))}
          </Steps>
        </div>

        <Row gutter={[32, 32]}>
          {/* Left Column - Form */}
          <Col xs={24} lg={16}>
            {currentStep === 0 && (
              <Card className={styles.formCard}>
                <Title level={4}>Thông tin người mua</Title>
                <Divider />

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleFormSubmit}
                  size="large"
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[
                          { required: true, message: "Vui lòng nhập họ tên" },
                        ]}
                      >
                        <Input placeholder="Nguyễn Văn A" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại",
                          },
                          {
                            pattern: /^[0-9]{10}$/,
                            message: "Số điện thoại không hợp lệ",
                          },
                        ]}
                      >
                        <Input placeholder="0901234567" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input placeholder="example@email.com" />
                  </Form.Item>

                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[
                      { required: true, message: "Vui lòng nhập địa chỉ" },
                    ]}
                  >
                    <Input placeholder="Số nhà, tên đường, quận/huyện" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Thành phố"
                        name="city"
                        rules={[
                          { required: true, message: "Vui lòng nhập thành phố" },
                        ]}
                      >
                        <Input placeholder="TP. Hồ Chí Minh" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Mã giảm giá (nếu có)" name="coupon">
                        <Input placeholder="Nhập mã giảm giá" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Ghi chú" name="note">
                    <TextArea
                      rows={3}
                      placeholder="Thêm ghi chú cho đơn hàng (tùy chọn)"
                    />
                  </Form.Item>

                  <Divider />

                  <Form.Item>
                    <Checkbox
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    >
                      Tôi đồng ý với{" "}
                      <a href="/terms" target="_blank">
                        điều khoản và điều kiện
                      </a>{" "}
                      của EV Battery Hub
                    </Checkbox>
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                    disabled={!agreedToTerms}
                  >
                    Tiếp tục thanh toán
                  </Button>
                </Form>
              </Card>
            )}

            {currentStep === 1 && (
              <Card className={styles.formCard}>
                <Title level={4}>Chọn phương thức thanh toán</Title>
                <Divider />

                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={styles.paymentMethodGroup}
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {paymentMethods.map((method) => (
                      <Card
                        key={method.id}
                        className={`${styles.paymentMethodCard} ${
                          paymentMethod === method.id ? styles.selected : ""
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <Radio value={method.id}>
                          <Space>
                            <span className={styles.methodIcon}>{method.icon}</span>
                            <div>
                              <div className={styles.methodName}>
                                {method.name}
                                {method.recommended && (
                                  <Tag color="gold" style={{ marginLeft: 8 }}>
                                    Khuyến nghị
                                  </Tag>
                                )}
                              </div>
                              <div className={styles.methodDescription}>
                                {method.description}
                              </div>
                            </div>
                          </Space>
                        </Radio>
                      </Card>
                    ))}
                  </Space>
                </Radio.Group>

                <Divider />

                {paymentMethod === "bank" && (
                  <Alert
                    message="Thông tin chuyển khoản"
                    description={
                      <div className={styles.bankInfo}>
                        <div className={styles.bankInfoItem}>
                          <Text strong>Ngân hàng:</Text>
                          <Text>{bankInfo.bank}</Text>
                        </div>
                        <div className={styles.bankInfoItem}>
                          <Text strong>Số tài khoản:</Text>
                          <Text copyable className={styles.accountNumber}>
                            {bankInfo.accountNumber}
                          </Text>
                        </div>
                        <div className={styles.bankInfoItem}>
                          <Text strong>Chủ tài khoản:</Text>
                          <Text>{bankInfo.accountName}</Text>
                        </div>
                        <div className={styles.bankInfoItem}>
                          <Text strong>Chi nhánh:</Text>
                          <Text>{bankInfo.branch}</Text>
                        </div>
                        <div className={styles.bankInfoItem}>
                          <Text strong>Nội dung chuyển khoản:</Text>
                          <Text copyable className={styles.transferContent}>
                            {bankInfo.content} {form.getFieldValue("phone")}
                          </Text>
                        </div>
                        <div className={styles.bankInfoItem}>
                          <Text strong>Số tiền:</Text>
                          <Text className={styles.amount}>
                            {(displayData.price * quantity).toLocaleString("vi-VN")}₫
                          </Text>
                        </div>
                      </div>
                    }
                    type="info"
                    showIcon
                    icon={<BankOutlined />}
                  />
                )}

                {paymentMethod !== "bank" && (
                  <Alert
                    message="Bạn sẽ được chuyển đến trang thanh toán của đối tác"
                    type="info"
                    showIcon
                  />
                )}

                <Divider />

                <Space style={{ width: "100%" }} direction="vertical">
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={handlePaymentConfirm}
                    loading={loading}
                    icon={<LockOutlined />}
                  >
                    Xác nhận thanh toán
                  </Button>
                  <Button
                    size="large"
                    block
                    onClick={() => setCurrentStep(0)}
                  >
                    Quay lại
                  </Button>
                </Space>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className={styles.successCard}>
                <div className={styles.successContent}>
                  <CheckCircleOutlined className={styles.successIcon} />
                  <Title level={3}>Thanh toán thành công!</Title>
                  <Paragraph className={styles.successText}>
                    {isPackage && (
                      <>
                        Cảm ơn bạn đã đăng ký gói <strong>{displayData.name}</strong>.
                        Chúng tôi đã gửi email xác nhận đến địa chỉ của bạn.
                      </>
                    )}
                    {isProduct && (
                      <>
                        Cảm ơn bạn đã mua <strong>{displayData.name}</strong>.
                        Chúng tôi sẽ liên hệ với người bán và thông báo cho bạn sớm nhất.
                      </>
                    )}
                  </Paragraph>

                  <Alert
                    message="Lưu ý quan trọng"
                    description={
                      <div>
                        {isPackage && (
                          <>
                            <p>
                              <ClockCircleOutlined /> Gói của bạn sẽ được kích hoạt trong vòng{" "}
                              <strong>5-10 phút</strong> sau khi chúng tôi xác nhận thanh toán.
                            </p>
                            <p>
                              Bạn có thể kiểm tra trạng thái gói trong trang{" "}
                              <a href="/dashboard">Dashboard</a>.
                            </p>
                          </>
                        )}
                        {isProduct && (
                          <>
                            <p>
                              <ClockCircleOutlined /> Đơn hàng của bạn sẽ được xác nhận trong vòng{" "}
                              <strong>24 giờ</strong>.
                            </p>
                            <p>
                              Chúng tôi sẽ kết nối bạn với người bán để thỏa thuận về giao hàng và thanh toán.
                            </p>
                            <p>
                              Kiểm tra trạng thái đơn hàng trong{" "}
                              <a href="/dashboard">Dashboard</a>.
                            </p>
                          </>
                        )}
                      </div>
                    }
                    type="warning"
                    showIcon
                    style={{ marginTop: 24 }}
                  />

                  <Divider />

                  <Space size="middle">
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => navigate("/dashboard")}
                    >
                      Đến Dashboard
                    </Button>
                    <Button
                      size="large"
                      onClick={() => navigate("/products")}
                    >
                      Bắt đầu đăng tin
                    </Button>
                  </Space>
                </div>
              </Card>
            )}
          </Col>

          {/* Right Column - Order Summary */}
          <Col xs={24} lg={8}>
            <Card className={styles.summaryCard}>
              <Title level={4}>Tóm tắt đơn hàng</Title>
              <Divider />

              <div className={styles.packageInfo}>
                <div className={styles.packageHeader}>
                  <Title level={5}>{displayData.name}</Title>
                  {isPackage && <Tag color="blue">{displayData.duration}</Tag>}
                  {isPostPackage && <Tag color="gold">Gói cho bài đăng</Tag>}
                  {isProduct && <Tag color="green">Sản phẩm</Tag>}
                </div>

                {isPostPackage && postProductData && (
                  <div className={styles.postPackageInfo}>
                    <Alert
                      message="Gói đăng tin cho sản phẩm"
                      description={
                        <div>
                          <Text strong style={{ display: 'block', marginBottom: 8 }}>
                            Sản phẩm: {postProductData.name}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Gói {displayData.name} - Hiển thị {displayData.duration} ngày
                          </Text>
                        </div>
                      }
                      type="info"
                      style={{ marginBottom: 16 }}
                    />
                  </div>
                )}

                {isProduct && (
                  <div className={styles.productDetails}>
                    <div className={styles.detailRow}>
                      <Text>Thương hiệu:</Text>
                      <Text strong>{displayData.brand}</Text>
                    </div>
                    <div className={styles.detailRow}>
                      <Text>Dung lượng:</Text>
                      <Text strong>{displayData.capacity} kWh</Text>
                    </div>
                    <div className={styles.detailRow}>
                      <Text>Tình trạng:</Text>
                      <Text strong>{displayData.condition}</Text>
                    </div>
                    <div className={styles.detailRow}>
                      <Text>Số lượng:</Text>
                      <Text strong>{quantity}</Text>
                    </div>
                  </div>
                )}

                {(isPackage || isPostPackage) && (
                  <div className={styles.featuresList}>
                    {displayData.features?.map((feature, index) => (
                      <div key={index} className={styles.featureItem}>
                        <CheckCircleOutlined className={styles.checkIcon} />
                        <Text>{feature}</Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Divider />

              <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}>
                  <Text>{(isPackage || isPostPackage) ? "Giá gói:" : "Giá sản phẩm:"}</Text>
                  <Text strong>
                    {displayData.price.toLocaleString("vi-VN")}₫
                  </Text>
                </div>
                {isProduct && quantity > 1 && (
                  <div className={styles.priceRow}>
                    <Text>Số lượng:</Text>
                    <Text>x{quantity}</Text>
                  </div>
                )}
                <div className={styles.priceRow}>
                  <Text>Giảm giá:</Text>
                  <Text>0₫</Text>
                </div>
                <div className={styles.priceRow}>
                  <Text>VAT (10%):</Text>
                  <Text>
                    {((displayData.price * quantity) * 0.1).toLocaleString("vi-VN")}₫
                  </Text>
                </div>
                <Divider />
                <div className={styles.totalRow}>
                  <Title level={5}>Tổng cộng:</Title>
                  <Title level={4} className={styles.totalPrice}>
                    {((displayData.price * quantity) * 1.1).toLocaleString("vi-VN")}₫
                  </Title>
                </div>
              </div>

              <Divider />

              <div className={styles.securityBadges}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div className={styles.badge}>
                    <SafetyOutlined />
                    <Text>Thanh toán được bảo mật</Text>
                  </div>
                  <div className={styles.badge}>
                    <LockOutlined />
                    <Text>Mã hóa SSL 256-bit</Text>
                  </div>
                  <div className={styles.badge}>
                    <CheckCircleOutlined />
                    <Text>Đảm bảo hoàn tiền 100%</Text>
                  </div>
                </Space>
              </div>
            </Card>

            {/* Help Card */}
            <Card className={styles.helpCard}>
              <Title level={5}>Cần hỗ trợ?</Title>
              <Paragraph>
                Liên hệ với chúng tôi qua:
              </Paragraph>
              <Space direction="vertical">
                <Text>📞 Hotline: 1900 1234</Text>
                <Text>📧 Email: support@evbatteryhub.com</Text>
                <Text>💬 Chat: Góc dưới bên phải</Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
