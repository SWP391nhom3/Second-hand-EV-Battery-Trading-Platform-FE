import React, { useState, useEffect } from "react";
import { Button, Badge, Avatar, Dropdown, message } from "antd";
import {
  MenuOutlined,
  CloseOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined, // added
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom"; // ✅ thêm dòng này

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  // khởi tạo từ localStorage để giữ chế độ người dùng đã chọn
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem("isDarkMode") === "true";
    } catch (e) {
      return false;
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); //  hook điều hướng

  // Sync auth state on mount and on events
  useEffect(() => {
    const checkAuth = () => {
      // ✅ Kiểm tra cả "token" và "authToken" để tương thích
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };
    checkAuth();
    window.addEventListener("authChanged", checkAuth);
    return () => window.removeEventListener("authChanged", checkAuth);
  }, []);

  const navItems = [
    { id: 1, name: "Trang chủ", href: "/" },
    { id: 2, name: "Sản phẩm", href: "/products" },
    { id: 3, name: "Gói đăng tin", href: "/packages" },
    { id: 4, name: "Giới thiệu", href: "/about" },
    { id: 5, name: "Liên hệ", href: "/contact" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try {
      localStorage.setItem("isDarkMode", next ? "true" : "false");
    } catch (e) {
      /* ignore */
    }
  };

  useEffect(() => {
    // set cả className và style trực tiếp để tránh CSS global làm nền tối không mong muốn
    document.body.className = isDarkMode ? "dark" : "light";
    document.body.style.background = isDarkMode ? "#141414" : "#ffffff";
    document.body.style.color = isDarkMode ? "#ffffff" : "#000000";
  }, [isDarkMode]);

  // ✅ Menu khi đã đăng nhập
  const loggedInMenuItems = [
    {
      key: "profile",
      label: <a href="/profile">👤 Hồ sơ cá nhân</a>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: () => {
        // ✅ Xóa tất cả auth data và notify listeners
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("authToken");
        setIsLoggedIn(false);
        message.success("Đã đăng xuất!");
        try {
          window.dispatchEvent(new Event("authChanged"));
        } catch (e) {
          /* ignore */
        }
        navigate("/");
      },
    },
  ];

  // ✅ Menu khi chưa đăng nhập
  const guestMenuItems = [
    {
      key: "login",
      icon: <LoginOutlined />,
      label: "Đăng nhập",
      onClick: () => {
        message.info("Chuyển đến trang đăng nhập...");
        navigate("/login"); // ✅ chuyển hướng sang trang login
      },
    },
  ];

  return (
    <header
      style={{
        backgroundColor: isDarkMode ? "#141414" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src="/assets/Logo-Page.png"
            alt="Logo"
            style={{ width: 35, height: 35 }}
          />
          <span style={{ fontWeight: "bold", fontSize: 18 }}>
            EV Battery Hub
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", gap: 20 }}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              style={{
                color: isDarkMode ? "#fff" : "#000",
                textDecoration: "none",
              }}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Dark mode toggle */}
          <Button
            type="text"
            shape="circle"
            onClick={toggleDarkMode}
            icon={isDarkMode ? "🌞" : "🌙"}
          />

          {/* Giỏ hàng */}
          <div style={{ position: "relative" }}>
            <Badge count={cartCount} size="small">
              <Button
                type="text"
                shape="circle"
                icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
                onClick={toggleCart}
              />
            </Badge>
            {isCartOpen && (
              <div
                style={{
                  position: "absolute",
                  top: 40,
                  right: 0,
                  width: 220,
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <h4>Giỏ hàng</h4>
                <p>Hiện chưa có sản phẩm nào.</p>
              </div>
            )}
          </div>

          {/* Avatar / Login */}
          <Dropdown
            menu={{ items: isLoggedIn ? loggedInMenuItems : guestMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Avatar
              src={
                isLoggedIn
                  ? (() => {
                      try {
                        const user = JSON.parse(localStorage.getItem("user") || "{}");
                        return user.member?.avatarUrl || user.avatarUrl || "https://i.pravatar.cc/40";
                      } catch {
                        return "https://i.pravatar.cc/40";
                      }
                    })()
                  : null
              }
              icon={<UserOutlined />}
              style={{ cursor: "pointer" }}
              title={
                isLoggedIn
                  ? (() => {
                      try {
                        const user = JSON.parse(localStorage.getItem("user") || "{}");
                        return user.email || user.member?.fullName || "User";
                      } catch {
                        return "User";
                      }
                    })()
                  : "Đăng nhập"
              }
            />
          </Dropdown>

          {/* Quick "Đăng bài" button */}
          <a href="/customer" style={{ textDecoration: "none" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
              }}
            >
              Đăng bài
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
