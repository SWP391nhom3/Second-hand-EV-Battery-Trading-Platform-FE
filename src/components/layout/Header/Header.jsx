import React, { useState, useEffect } from "react";
import { Button, Badge, Avatar, Dropdown } from "antd";
import { MenuOutlined, CloseOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./Header.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navItems = [
    { id: 1, name: "Trang chủ", href: "/" },
    { id: 2, name: "Sản phẩm", href: "/products" },
    { id: 3, name: "Gói đăng tin", href: "/packages" },
    { id: 4, name: "Giới thiệu", href: "/about" },
    { id: 5, name: "Liên hệ", href: "/contact" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  // Avatar dropdown menu items
  const avatarMenuItems = [
    {
      key: 'profile',
      label: <a href="/profile">👤 Hồ sơ</a>,
    },
    {
      key: 'settings',
      label: <a href="/settings">⚙️ Cài đặt</a>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '🚪 Đăng xuất',
      onClick: () => alert("Đã đăng xuất!"),
    },
  ];

  return (
    <header 
      className={styles.header}
      style={{
        backgroundColor: isDarkMode ? '#141414' : '#fff',
        color: isDarkMode ? '#fff' : 'rgba(0, 0, 0, 0.88)',
      }}
    >
      <div className={styles.headerContent}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <img
            className={styles.logoImage}
            src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Volkswagen_logo_2019.svg"
            alt="EV Battery Hub Logo"
          />
          <span className={styles.logoText}>EV Battery Hub</span>
        </div>

        {/* Navigation links (hidden on mobile) */}
        <nav className={styles.navLinks}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={styles.navLink}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Actions section */}
        <div className={styles.actionsSection}>
          {/* Dark mode toggle */}
          <Button
            type="text"
            shape="circle"
            onClick={toggleDarkMode}
            icon={isDarkMode ? "🌞" : "🌙"}
            aria-label="Toggle dark mode"
          />

          {/* Shopping cart */}
          <div style={{ position: 'relative' }}>
            <Badge count={cartCount} size="small">
              <Button
                type="text"
                shape="circle"
                icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}
                onClick={toggleCart}
                aria-label="Shopping cart"
              />
            </Badge>
            
            {isCartOpen && (
              <div className={styles.dropdownMenu}>
                <h3 className={styles.dropdownTitle}>Giỏ hàng</h3>
                <p className={styles.dropdownText}>Giỏ hàng của bạn đang trống</p>
              </div>
            )}
          </div>

          {/* User avatar with dropdown */}
          <Dropdown
            menu={{ items: avatarMenuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Avatar
              src="https://i.pravatar.cc/40"
              alt="User avatar"
              style={{ cursor: 'pointer' }}
              icon={<UserOutlined />}
            />
          </Dropdown>

          {/* Mobile menu toggle */}
          <Button
            type="text"
            shape="circle"
            className={styles.mobileMenuToggle}
            onClick={toggleMenu}
            icon={isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            aria-label="Toggle menu"
          />
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div 
          className={styles.mobileMenu}
          style={{
            backgroundColor: isDarkMode ? '#141414' : '#fff',
            borderTopColor: isDarkMode ? '#303030' : '#f0f0f0',
          }}
        >
          <div className={styles.mobileMenuContent}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={styles.mobileNavLink}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
