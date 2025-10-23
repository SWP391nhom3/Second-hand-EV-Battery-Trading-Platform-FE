import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, Avatar, Typography, theme, Switch } from "antd";
import logo from "../../assets/Logo-Page.png"; // ✅ dùng ảnh trong src/assets

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    { key: "1", icon: <UserOutlined />, label: "Người dùng" },
    { key: "2", icon: <ShopOutlined />, label: "Sản phẩm" },
    { key: "3", icon: <AppstoreOutlined />, label: "Danh mục" },
    { key: "4", icon: <BarChartOutlined />, label: "Báo cáo" },
    { key: "5", icon: <TeamOutlined />, label: "Nhân viên" },
    { key: "6", icon: <VideoCameraOutlined />, label: "Quảng cáo" },
    { key: "7", icon: <UploadOutlined />, label: "Tệp tải lên" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme={darkMode ? "dark" : "light"}
        style={{
          position: "sticky",
          left: 0,
          top: 0,
          bottom: 0,
          height: "100vh",
          boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 8,
            paddingLeft: collapsed ? 0 : 16,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: 36, height: 36, borderRadius: "50%" }}
          />
          {!collapsed && (
            <Title level={5} style={{ margin: 0 }}>
              EV Admin
            </Title>
          )}
        </div>

        <Menu
          theme={darkMode ? "dark" : "light"}
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
          style={{
            borderRight: "none",
            fontWeight: 500,
          }}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: colorBgContainer,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Title level={4} style={{ margin: 0 }}>
              Bảng điều khiển
            </Title>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Switch
              checkedChildren={<SunOutlined />}
              unCheckedChildren={<MoonOutlined />}
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1677ff" }}
            />
          </div>
        </Header>

        {/* Nội dung chính */}
        <Content style={{ margin: "24px 16px", overflow: "auto" }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              minHeight: "75vh",
            }}
          >
            <Title level={5}>Chào mừng đến với trang quản trị 🚀</Title>
            <p>
              Đây là giao diện Dashboard của admin. Bạn có thể quản lý người
              dùng, sản phẩm, báo cáo và nhiều mục khác ở menu bên trái.
            </p>
          </div>
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: "center", color: "#999" }}>
          EV Battery Hub Admin ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
