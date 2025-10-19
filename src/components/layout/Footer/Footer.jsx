import React from "react";
import { Row, Col, Space } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { label: "Giới thiệu", href: "/about" },
      { label: "Xem sản phẩm", href: "/products" },
      { label: "Cách hoạt động", href: "/how-it-works" },
      { label: "Thông tin bảo hành", href: "/warranty" },
      { label: "Tin tức", href: "/blog" },
    ],
    customerService: [
      { label: "Trung tâm trợ giúp", href: "/help" },
      { label: "Thông tin vận chuyển", href: "/shipping" },
      { label: "Đổi trả & Hoàn tiền", href: "/returns" },
      { label: "Câu hỏi thường gặp", href: "/faq" },
      { label: "Hỗ trợ khách hàng", href: "/contact" },
    ],
    policies: [
      { label: "Chính sách bảo mật", href: "/privacy" },
      { label: "Điều khoản dịch vụ", href: "/terms" },
      { label: "Chính sách Cookie", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { icon: <FacebookOutlined />, href: "#", label: "Facebook" },
    { icon: <TwitterOutlined />, href: "#", label: "Twitter" },
    { icon: <InstagramOutlined />, href: "#", label: "Instagram" },
    { icon: <LinkedinOutlined />, href: "#", label: "LinkedIn" },
  ];

  const paymentMethods = ["VISA", "Mastercard", "PayPal", "Crypto"];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <Row gutter={[32, 32]}>
          {/* Company Info */}
          <Col xs={24} sm={24} md={6}>
            <div className={styles.footerLogo}>⚡ Sàn Giao Dịch Pin EV</div>
            <p className={styles.footerDescription}>
              Sàn giao dịch đáng tin cậy cho pin xe điện đã qua sử dụng chất lượng cao.
              Chúng tôi đảm bảo mọi viên pin đáp ứng tiêu chuẩn chất lượng nghiêm ngặt.
            </p>
            <div className={styles.footerSocial}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={styles.socialIcon}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={12} sm={12} md={6}>
            <h3 className={styles.footerSectionTitle}>Liên kết nhanh</h3>
            {footerLinks.quickLinks.map((link, index) => (
              <a key={index} href={link.href} className={styles.footerLink}>
                {link.label}
              </a>
            ))}
          </Col>

          {/* Customer Service */}
          <Col xs={12} sm={12} md={6}>
            <h3 className={styles.footerSectionTitle}>Dịch vụ khách hàng</h3>
            {footerLinks.customerService.map((link, index) => (
              <a key={index} href={link.href} className={styles.footerLink}>
                {link.label}
              </a>
            ))}
          </Col>

          {/* Contact Info */}
          <Col xs={24} sm={24} md={6}>
            <h3 className={styles.footerSectionTitle}>Liên hệ</h3>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className={styles.contactItem}>
                <EnvironmentOutlined />
                <span>123 Đường Pin EV, Thành phố Công nghệ, TC 12345</span>
              </div>
              <div className={styles.contactItem}>
                <PhoneOutlined />
                <a href="tel:+84123456789">+84 (123) 456-789</a>
              </div>
              <div className={styles.contactItem}>
                <MailOutlined />
                <a href="mailto:lienhe@pinev.com">lienhe@pinev.com</a>
              </div>
            </Space>
          </Col>
        </Row>

        <div className={styles.footerDivider} />

        <div className={styles.footerBottom}>
          <p>© {currentYear} Sàn Giao Dịch Pin EV. Bảo lưu mọi quyền.</p>
          <div className={styles.footerPayment}>
            {paymentMethods.map((method, index) => (
              <div key={index} className={styles.paymentIcon}>
                💳 {method}
              </div>
            ))}
          </div>
          <p className={styles.policyLinks}>
            {footerLinks.policies.map((link, index) => (
              <React.Fragment key={index}>
                <a href={link.href} className={styles.policyLink}>
                  {link.label}
                </a>
                {index < footerLinks.policies.length - 1 && ' | '}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
