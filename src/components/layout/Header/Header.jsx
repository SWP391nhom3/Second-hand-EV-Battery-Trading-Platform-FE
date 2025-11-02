import React, { useState, useEffect } from "react"; // ← THÊM DÒNG NÀY!
import { Button, Badge, Avatar, Dropdown, message, Space } from "antd";
import {
  MenuOutlined,
  CloseOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem("isDarkMode") === "true";
    } catch {
      return false;
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
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
    } catch {}
  };

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "light";
    document.body.style.background = isDarkMode ? "#141414" : "#ffffff";
    document.body.style.color = isDarkMode ? "#ffffff" : "#000000";
  }, [isDarkMode]);

  // Lấy thông tin user
  const getUserInfo = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const name = user.member?.fullName || user.email?.split("@")[0] || "User";
      const avatar =
        user.member?.avatarUrl ||
        user.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=1890ff&color=fff`;
      return { name, avatar };
    } catch {
      return {
        name: "User",
        avatar: `https://ui-avatars.com/api/?name=U&background=1890ff&color=fff`,
      };
    }
  };

  const { name: userName, avatar: userAvatar } = getUserInfo();
  const role = localStorage.getItem("role")?.toLowerCase();

  const menuItems = isLoggedIn
    ? [
        {
          key: "profile",
          label: (
            <Space>
              <UserOutlined />
              Hồ sơ cá nhân
            </Space>
          ),
          onClick: () => navigate("/profile"),
        },
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label:
            role === "admin"
              ? "Quản trị"
              : role === "staff"
              ? "Nhân viên"
              : "Trang cá nhân",
          onClick: () => {
            if (role === "admin") navigate("/admin");
            else if (role === "staff") navigate("/staff");
            else navigate("/customer");
          },
        },
        { type: "divider" },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Đăng xuất",
          danger: true,
          onClick: () => {
            localStorage.clear();
            sessionStorage.clear();
            setIsLoggedIn(false);
            message.success("Đã đăng xuất!");
            window.dispatchEvent(new Event("authChanged"));
            navigate("/");
          },
        },
      ]
    : [
        {
          key: "login",
          icon: <LoginOutlined />,
          label: "Đăng nhập",
          onClick: () => navigate("/login"),
        },
        {
          key: "register",
          label: "Đăng ký",
          onClick: () => navigate("/register"),
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
          {/* Dark mode */}
          <Button
            type="text"
            shape="circle"
            onClick={toggleDarkMode}
            icon={isDarkMode ? "☀️" : "🌙"} // ← Fix icon
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
                  color: "#000",
                  zIndex: 1000,
                }}
              >
                <h4>Giỏ hàng</h4>
                <p>Hiện chưa có sản phẩm nào.</p>
              </div>
            )}
          </div>

          {/* Avatar + Menu */}
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <a
              onClick={(e) => e.preventDefault()}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              {isLoggedIn ? (
                <>
                  <Avatar src={userAvatar} size="default" />
                  <span
                    style={{
                      fontWeight: 500,
                      maxWidth: 100,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userName}
                  </span>
                </>
              ) : (
                <>
                  <Avatar icon={<UserOutlined />} />
                  <span>Đăng nhập</span>
                </>
              )}
            </a>
          </Dropdown>

          {/* Đăng bài */}
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
