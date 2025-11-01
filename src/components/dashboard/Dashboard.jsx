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
import logo from "../../assets/Logo-Page.png";

// import các trang con
import DashboardOverview from "./pages/DashboardOverView";
import UserManagement from "./pages/UserManagement";
import PostManagement from "./pages/PostManagement";
import Transaction from "./pages/Transaction";
import Commission from "./pages/Commission";
import Request from "./pages/Request";
import Reporting from "./pages/Reporting";

const { Header, Sider, Content, Footer } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedKey, setSelectedKey] = useState("overview");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    { key: "overview", icon: <AppstoreOutlined />, label: "Tổng quan" },
    { key: "users", icon: <UserOutlined />, label: "Người dùng" },
    { key: "posts", icon: <ShopOutlined />, label: "Sản phẩm" },
    { key: "transaction", icon: <UploadOutlined />, label: "Giao dịch" },
    { key: "commission", icon: <TeamOutlined />, label: "Hoa hồng" },
    { key: "request", icon: <VideoCameraOutlined />, label: "Yêu cầu" },
    { key: "reporting", icon: <BarChartOutlined />, label: "Báo cáo" },
  ];

  // render nội dung tương ứng
  const renderContent = () => {
    switch (selectedKey) {
      case "users":
        return <UserManagement />;
      case "posts":
        return <PostManagement />;
      case "transaction":
        return <Transaction />;
      case "commission":
        return <Commission />;
      case "request":
        return <Request />;
      case "reporting":
        return <Reporting />;
      default:
        return <DashboardOverview />;
    }
  };

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
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key)}
          items={menuItems}
          style={{ borderRight: "none", fontWeight: 500 }}
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
              {menuItems.find((i) => i.key === selectedKey)?.label ||
                "Bảng điều khiển"}
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
            {renderContent()}
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
