import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CarOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
  AppstoreOutlined,
  MoonOutlined,
  SunOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, Avatar, Typography, theme, Switch } from "antd";
import logo from "../../assets/Logo-Page.png";
import DashboardOverview from "./pages/DashboardOverview";
import UserManagement from "./pages/UserManagement";
import ProductManagement from "./pages/ProductManagement";
import TransactionManagement from "./pages/TransactionManagement";
import StaffRequestManagement from "./pages/StaffRequestManagement";
import OrderRequestManagement from "./pages/OrderRequestManagement";
import PostManagement from "./pages/PostManagement";

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
    { key: "products", icon: <CarOutlined />, label: "Sản phẩm" },
    { key: "transactions", icon: <DollarCircleOutlined />, label: "Giao dịch" },
    {
      key: "order-requests",
      icon: <ShoppingCartOutlined />,
      label: "Yêu cầu đơn hàng",
    },
    {
      key: "staff-requests",
      icon: <FileDoneOutlined />,
      label: "Yêu cầu Staff",
    },
    {
      key: "post-management",
      icon: <FileDoneOutlined />,
      label: "Quản lý bài viết",
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case "users":
        return <UserManagement />;
      case "products":
        return <ProductManagement />;
      case "transactions":
        return <TransactionManagement />;
      case "order-requests":
        return <OrderRequestManagement />;
      case "staff-requests":
        return <StaffRequestManagement />;
      case "post-management":
        return <PostManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme={darkMode ? "dark" : "light"}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          boxShadow: "2px 0 8px rgba(7, 7, 7, 0.06)",
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
            <Title
              level={5}
              style={{ margin: 0, color: darkMode ? "#fff" : "#000" }}
            >
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

      <Layout>
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
              checked={!darkMode}
              onChange={setDarkMode}
            />
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1677ff" }}
            />
          </div>
        </Header>

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

        <Footer style={{ textAlign: "center", color: "#999" }}>
          EV Battery Hub Admin ©{new Date().getFullYear()} - Quản lý xe điện &
          pin
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
