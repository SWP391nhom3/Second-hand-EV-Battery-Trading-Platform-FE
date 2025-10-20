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
import "./index.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <Row gutter={[32, 32]}>
          {/* Company Info */}
          <Col xs={24} sm={24} md={6}>
            <div className="footer-logo">⚡ EV Battery Hub</div>
            <p className="footer-description">
              Your trusted marketplace for high-quality second-hand electric vehicle batteries.
              We ensure every battery meets strict quality standards.
            </p>
            <div className="footer-social">
              <div className="social-icon">
                <FacebookOutlined />
              </div>
              <div className="social-icon">
                <TwitterOutlined />
              </div>
              <div className="social-icon">
                <InstagramOutlined />
              </div>
              <div className="social-icon">
                <LinkedinOutlined />
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={12} sm={12} md={6}>
            <h3 className="footer-section-title">Quick Links</h3>
            <a href="#about" className="footer-link">About Us</a>
            <a href="#products" className="footer-link">Browse Batteries</a>
            <a href="#how-it-works" className="footer-link">How It Works</a>
            <a href="#warranty" className="footer-link">Warranty Info</a>
            <a href="#blog" className="footer-link">Blog & News</a>
          </Col>

          {/* Customer Service */}
          <Col xs={12} sm={12} md={6}>
            <h3 className="footer-section-title">Customer Service</h3>
            <a href="#help" className="footer-link">Help Center</a>
            <a href="#shipping" className="footer-link">Shipping Info</a>
            <a href="#returns" className="footer-link">Returns & Refunds</a>
            <a href="#faq" className="footer-link">FAQ</a>
            <a href="#contact" className="footer-link">Contact Support</a>
          </Col>

          {/* Contact Info */}
          <Col xs={24} sm={24} md={6}>
            <h3 className="footer-section-title">Contact Us</h3>
            <Space direction="vertical" size="middle">
              <div style={{ display: "flex", alignItems: "start", gap: 8 }}>
                <EnvironmentOutlined style={{ marginTop: 4 }} />
                <span className="footer-link" style={{ margin: 0 }}>
                  123 EV Street, Tech City, TC 12345
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PhoneOutlined />
                <a href="tel:+1234567890" className="footer-link" style={{ margin: 0 }}>
                  +1 (234) 567-890
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MailOutlined />
                <a href="mailto:info@evbattery.com" className="footer-link" style={{ margin: 0 }}>
                  info@evbattery.com
                </a>
              </div>
            </Space>
          </Col>
        </Row>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p>© {currentYear} EV Battery Hub. All rights reserved.</p>
          <div className="footer-payment">
            <div className="payment-icon">💳 VISA</div>
            <div className="payment-icon">💳 Mastercard</div>
            <div className="payment-icon">💰 PayPal</div>
            <div className="payment-icon">🪙 Crypto</div>
          </div>
          <p style={{ marginTop: 16 }}>
            <a href="#privacy" className="footer-link" style={{ display: "inline", margin: "0 12px" }}>
              Privacy Policy
            </a>
            |
            <a href="#terms" className="footer-link" style={{ display: "inline", margin: "0 12px" }}>
              Terms of Service
            </a>
            |
            <a href="#cookies" className="footer-link" style={{ display: "inline", margin: "0 12px" }}>
              Cookie Policy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
