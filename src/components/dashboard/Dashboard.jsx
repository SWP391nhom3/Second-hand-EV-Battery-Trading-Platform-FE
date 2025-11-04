import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CarOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
  AppstoreOutlined,
  MoonOutlined,
  SunOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Typography,
  theme,
  Switch,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Badge,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
} from "antd";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import logo from "../../assets/Logo-Page.png";
import PostManagement from "./pages/PostManagement";

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

// === DỮ LIỆU GIẢ ===
const fakeOverview = {
  totalUsers: 1234,
  totalProducts: 89,
  totalTransactions: 567,
  totalRevenue: 125000000,
  pendingPayments: 12,
  pendingStaff: 8,
};

const fakeUsers = [
  {
    key: "1",
    name: "Nguyễn Văn Admin",
    email: "admin@example.com",
    phone: "0901111111",
    role: "admin",
    status: "Hoạt động",
  },
  {
    key: "2",
    name: "Trần Thị Staff",
    email: "staff@example.com",
    phone: "0902222222",
    role: "staff",
    status: "Hoạt động",
  },
  {
    key: "3",
    name: "Lê Văn Member",
    email: "member@example.com",
    phone: "0903333333",
    role: "member",
    status: "Hoạt động",
  },
  {
    key: "4",
    name: "Phạm Thị Member",
    email: "member2@example.com",
    phone: "0904444444",
    role: "member",
    status: "Bị khóa",
  },
];

const fakeProducts = [
  {
    key: "1",
    name: "VinFast VF e34",
    type: "Ô tô điện",
    price: 690000000,
    stock: 15,
    status: "Còn hàng",
    paymentFlow: "staff",
  },
  {
    key: "2",
    name: "VinFast VF 8",
    type: "Ô tô điện",
    price: 1200000000,
    stock: 8,
    status: "Còn hàng",
    paymentFlow: "staff",
  },
  {
    key: "3",
    name: "DatBike Weaver",
    type: "Xe máy điện",
    price: 45000000,
    stock: 0,
    status: "Hết hàng",
    paymentFlow: "staff",
  },
  {
    key: "4",
    name: "Pin Lithium 60V 30Ah",
    type: "Pin",
    price: 12000000,
    stock: 50,
    status: "Còn hàng",
    paymentFlow: "direct",
    transactionStatus: "Đã thanh toán",
  },
  {
    key: "5",
    name: "Xe đạp điện Asama",
    type: "Xe đạp điện",
    price: 8500000,
    stock: 120,
    status: "Còn hàng",
    paymentFlow: "direct",
    transactionStatus: "Chờ thanh toán",
  },
];

const fakeTransactions = [
  {
    key: "1",
    orderId: "#ORD001",
    customer: "Nguyễn Văn A",
    product: "VinFast VF e34",
    amount: 690000000,
    status: "Đang chờ Staff",
    date: "2025-10-30",
  },
  {
    key: "2",
    orderId: "#ORD002",
    customer: "Trần Thị B",
    product: "Pin Lithium 60V",
    amount: 12000000,
    status: "Đã thanh toán",
    date: "2025-11-01",
  },
  {
    key: "3",
    orderId: "#ORD003",
    customer: "Lê Văn C",
    product: "Xe đạp điện Asama",
    amount: 8500000,
    status: "Chờ thanh toán",
    date: "2025-11-02",
  },
  {
    key: "4",
    orderId: "#ORD004",
    customer: "Phạm D",
    product: "Pin Lithium 60V",
    amount: 12000000,
    status: "Hủy",
    date: "2025-11-02",
  },
];

const fakeStaffRequests = [
  {
    key: "1",
    product: "VinFast VF e34",
    customer: "Nguyễn Văn A",
    phone: "0901234567",
    note: "Hỗ trợ vay 70%",
    status: "Mới",
    date: "2025-11-01",
  },
  {
    key: "2",
    product: "VinFast VF 8",
    customer: "Trần Thị B",
    phone: "0912345678",
    note: "Màu trắng, giao nhanh",
    status: "Đã xử lý",
    date: "2025-10-30",
  },
];

// === DASHBOARD OVERVIEW - THIẾT KẾ CARSALE ===
const monthlySalesData = [
  { month: "Th1", sales: 32 },
  { month: "Th2", sales: 45 },
  { month: "Th3", sales: 38 },
  { month: "Th4", sales: 52 },
  { month: "Th5", sales: 61 },
  { month: "Th6", sales: 58 },
  { month: "Th7", sales: 45 },
  { month: "Th8", sales: 67 },
  { month: "Th9", sales: 72 },
  { month: "Th10", sales: 68 },
  { month: "Th11", sales: 78 },
];

const statisticsData = [
  { name: "Tổng doanh thu", value: 125000000, trend: 12.5 },
  { name: "Giao dịch tháng", value: 245, trend: 8.2 },
];

const DashboardOverview = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0, color: "#1677ff" }}>
            Dashboard
          </Title>
          <Text type="secondary">Chào mừng trở lại, Admin!</Text>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" ghost>
            Xuất báo cáo
          </Button>
          <Button type="primary">Tạo mới</Button>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text
                  style={{
                    fontSize: 12,
                    opacity: 0.8,
                    marginBottom: 8,
                    display: "block",
                  }}
                >
                  Tổng khách hàng
                </Text>
                <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                  689K
                </Title>
                <Text style={{ fontSize: 12, opacity: 0.8 }}>
                  <span style={{ color: "#52c41a" }}>+56%</span> so với tháng
                  trước
                </Text>
              </div>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserOutlined style={{ fontSize: 28, color: "white" }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(245, 87, 108, 0.3)",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text
                  style={{
                    fontSize: 12,
                    opacity: 0.8,
                    marginBottom: 8,
                    display: "block",
                  }}
                >
                  Tổng doanh thu
                </Text>
                <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                  125.4T ₫
                </Title>
                <Text style={{ fontSize: 12, opacity: 0.8 }}>
                  <span style={{ color: "#52c41a" }}>+1.2%</span> so với tháng
                  trước
                </Text>
              </div>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DollarCircleOutlined
                  style={{ fontSize: 28, color: "white" }}
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(79, 172, 254, 0.3)",
            }}
            bodyStyle={{ padding: "24px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text
                  style={{
                    fontSize: 12,
                    opacity: 0.8,
                    marginBottom: 8,
                    display: "block",
                  }}
                >
                  Doanh số tháng
                </Text>
                <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
                  2.451K
                </Title>
                <Text style={{ fontSize: 12, opacity: 0.8 }}>
                  <span style={{ color: "#52c41a" }}>+56%</span>
                </Text>
              </div>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingCartOutlined
                  style={{ fontSize: 28, color: "white" }}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card
            title={
              <span style={{ color: "#1677ff", fontWeight: 600 }}>
                Doanh số hàng tháng
              </span>
            }
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip
                  formatter={(v) => `${v}K`}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar dataKey="sales" fill="#1890ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title={
              <span style={{ color: "#1677ff", fontWeight: 600 }}>
                Thống kê nhanh
              </span>
            }
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            {statisticsData.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px 0",
                  borderBottom:
                    i < statisticsData.length - 1
                      ? "1px solid #f0f0f0"
                      : "none",
                }}
              >
                <Text style={{ fontSize: 14, color: "#666" }}>{item.name}</Text>
                <div style={{ textAlign: "right" }}>
                  <Text
                    strong
                    style={{ fontSize: 18, color: "#1677ff", display: "block" }}
                  >
                    {item.value.toLocaleString()}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: item.trend >= 0 ? "#52c41a" : "#ff4d4f",
                    }}
                  >
                    {item.trend >= 0 ? `+${item.trend}%` : `${item.trend}%`}
                  </Text>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title={
              <span style={{ color: "#1677ff", fontWeight: 600 }}>
                Xu hướng doanh thu
              </span>
            }
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <RechartsTooltip formatter={(v) => `${v}K`} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#1890ff"
                  strokeWidth={3}
                  dot={{ fill: "#1890ff", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// === USER MANAGEMENT ===
const UserManagement = () => {
  const getRoleTag = (role) => {
    switch (role) {
      case "admin":
        return (
          <Tag color="volcano" icon={<UserOutlined />}>
            Quản trị viên
          </Tag>
        );
      case "staff":
        return (
          <Tag color="geekblue" icon={<UserOutlined />}>
            Nhân viên
          </Tag>
        );
      case "member":
        return (
          <Tag color="green" icon={<UserOutlined />}>
            Thành viên
          </Tag>
        );
      default:
        return <Tag>{role}</Tag>;
    }
  };

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title: "Vai trò", dataIndex: "role", key: "role", render: getRoleTag },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={s === "Hoạt động" ? "green" : "red"}>{s}</Tag>,
    },
  ];

  return (
    <div>
      <Title level={3}>Quản lý người dùng</Title>
      <Table
        dataSource={fakeUsers}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

// === PRODUCT MANAGEMENT ===
const ProductManagement = () => {
  const [products, setProducts] = useState(fakeProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();

  const handleStatusChange = (key, newStatus) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.key === key ? { ...p, transactionStatus: newStatus } : p
      )
    );
    message.success("Cập nhật trạng thái thành công!");
  };

  const columns = [
    { title: "Sản phẩm", dataIndex: "name", key: "name" },
    { title: "Loại", dataIndex: "type", key: "type" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (p) => `${p.toLocaleString()}₫`,
    },
    { title: "Tồn kho", dataIndex: "stock", key: "stock" },
    {
      title: "Trạng thái giao dịch",
      key: "transactionStatus",
      render: (_, record) => {
        if (record.paymentFlow === "staff")
          return <Tag color="orange">Qua Staff</Tag>;
        const status = record.transactionStatus || "Chưa xác định";
        return (
          <Select
            value={status}
            size="small"
            style={{ width: 140 }}
            onChange={(val) => handleStatusChange(record.key, val)}
          >
            <Select.Option value="Chờ thanh toán">
              <Tag color="orange">Chờ thanh toán</Tag>
            </Select.Option>
            <Select.Option value="Đã thanh toán">
              <Tag color="green">Đã thanh toán</Tag>
            </Select.Option>
            <Select.Option value="Hủy">
              <Tag color="red">Hủy</Tag>
            </Select.Option>
          </Select>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          {record.paymentFlow === "staff" ? (
            <Button
              size="small"
              icon={<SendOutlined />}
              onClick={() => {
                setSelectedProduct(record);
                setIsModalOpen(true);
              }}
            >
              Gửi Staff
            </Button>
          ) : (
            <Button
              size="small"
              type="primary"
              icon={<CheckCircleOutlined />}
              disabled={record.stock === 0}
            >
              Thanh toán
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Quản lý sản phẩm</Title>
      <Table
        dataSource={products}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Gửi yêu cầu đến Staff"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Sản phẩm">
            <Input value={selectedProduct?.name} disabled />
          </Form.Item>
          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input placeholder="090..." />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <TextArea rows={3} placeholder="Hỗ trợ vay, màu xe..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// === TRANSACTION MANAGEMENT ===
const TransactionManagement = () => {
  const [transactions, setTransactions] = useState(fakeTransactions);

  const updateStatus = (key, status) => {
    setTransactions((prev) =>
      prev.map((t) => (t.key === key ? { ...t, status } : t))
    );
    message.success("Cập nhật trạng thái giao dịch thành công!");
  };

  const columns = [
    { title: "Mã đơn", dataIndex: "orderId", key: "orderId" },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    { title: "Sản phẩm", dataIndex: "product", key: "product" },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (a) => `${a.toLocaleString()}₫`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ width: 150 }}
          onChange={(val) => updateStatus(record.key, val)}
        >
          <Select.Option value="Chờ thanh toán">
            <Tag color="orange" icon={<ClockCircleOutlined />}>
              Chờ thanh toán
            </Tag>
          </Select.Option>
          <Select.Option value="Đã thanh toán">
            <Tag color="green" icon={<CheckCircleOutlined />}>
              Đã thanh toán
            </Tag>
          </Select.Option>
          <Select.Option value="Đang chờ Staff">
            <Tag color="processing">Đang chờ Staff</Tag>
          </Select.Option>
          <Select.Option value="Hủy">
            <Tag color="red" icon={<StopOutlined />}>
              Hủy
            </Tag>
          </Select.Option>
        </Select>
      ),
    },
    { title: "Ngày", dataIndex: "date", key: "date" },
  ];

  return (
    <div>
      <Title level={3}>Quản lý giao dịch</Title>
      <Table
        dataSource={transactions}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

// === STAFF REQUEST MANAGEMENT ===
const StaffRequestManagement = () => {
  const columns = [
    { title: "Sản phẩm", dataIndex: "product", key: "product" },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title: "Ghi chú", dataIndex: "note", key: "note" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Badge status={s === "Mới" ? "processing" : "success"} text={s} />
      ),
    },
    { title: "Ngày", dataIndex: "date", key: "date" },
  ];

  return (
    <div>
      <Title level={3}>Yêu cầu gửi đến Staff</Title>
      <Table
        dataSource={fakeStaffRequests}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

// === DASHBOARD CHÍNH ===
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
