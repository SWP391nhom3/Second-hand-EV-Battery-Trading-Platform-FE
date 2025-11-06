import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  DollarCircleOutlined,
  ShoppingCartOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Button, Typography, Card, Row, Col } from "antd";
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

const { Title, Text } = Typography;

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
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  return (
    <div
      style={{
        opacity: animated ? 1 : 0,
        transform: animated ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.6s ease-out",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <div>
          <Title
            level={2}
            style={{
              margin: 0,
              color: "#1677ff",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}
          >
            <RocketOutlined style={{ marginRight: 8 }} />
            Dashboard
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Chào mừng trở lại, Admin! 👋
          </Text>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="primary"
            ghost
            style={{
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(22, 119, 255, 0.2)",
            }}
          >
            📊 Xuất báo cáo
          </Button>
          <Button
            type="primary"
            style={{
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(22, 119, 255, 0.4)",
            }}
          >
            ➕ Tạo mới
          </Button>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card
            className="stat-card"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            bodyStyle={{ padding: "24px" }}
            hoverable
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(102, 126, 234, 0.3)";
            }}
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
                    opacity: 0.9,
                    marginBottom: 8,
                    display: "block",
                    fontWeight: 500,
                  }}
                >
                  Tổng khách hàng
                </Text>
                <Title
                  level={3}
                  style={{ margin: 0, fontWeight: 700, fontSize: 32 }}
                >
                  689K
                </Title>
                <Text style={{ fontSize: 12, opacity: 0.9, fontWeight: 500 }}>
                  <span style={{ color: "#52c41a", fontWeight: 600 }}>
                    +56%
                  </span>{" "}
                  so với tháng trước
                </Text>
              </div>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.35)";
                  e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                }}
              >
                <UserOutlined style={{ fontSize: 28, color: "white" }} />
              </div>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            className="stat-card"
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(245, 87, 108, 0.3)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            bodyStyle={{ padding: "24px" }}
            hoverable
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(245, 87, 108, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(245, 87, 108, 0.3)";
            }}
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
                    opacity: 0.9,
                    marginBottom: 8,
                    display: "block",
                    fontWeight: 500,
                  }}
                >
                  Tổng doanh thu
                </Text>
                <Title
                  level={3}
                  style={{ margin: 0, fontWeight: 700, fontSize: 32 }}
                >
                  125.4T ₫
                </Title>
                <Text style={{ fontSize: 12, opacity: 0.9, fontWeight: 500 }}>
                  <span style={{ color: "#52c41a", fontWeight: 600 }}>
                    +1.2%
                  </span>{" "}
                  so với tháng trước
                </Text>
              </div>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.35)";
                  e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.transform = "scale(1) rotate(0deg)";
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
            className="stat-card"
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(79, 172, 254, 0.3)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            bodyStyle={{ padding: "24px" }}
            hoverable
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 40px rgba(79, 172, 254, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(79, 172, 254, 0.3)";
            }}
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
                    opacity: 0.9,
                    marginBottom: 8,
                    display: "block",
                    fontWeight: 500,
                  }}
                >
                  Doanh số tháng
                </Text>
                <Title
                  level={3}
                  style={{ margin: 0, fontWeight: 700, fontSize: 32 }}
                >
                  2.451K
                </Title>
                <Text style={{ fontSize: 12, opacity: 0.9, fontWeight: 500 }}>
                  <span style={{ color: "#52c41a", fontWeight: 600 }}>
                    +56%
                  </span>
                </Text>
              </div>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.35)";
                  e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.transform = "scale(1) rotate(0deg)";
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
              <span style={{ color: "#1677ff", fontWeight: 600, fontSize: 16 }}>
                📊 Doanh số hàng tháng
              </span>
            }
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
            }}
            hoverable
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
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
              <span style={{ color: "#1677ff", fontWeight: 600, fontSize: 16 }}>
                ⚡ Thống kê nhanh
              </span>
            }
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              height: "100%",
              transition: "all 0.3s ease",
            }}
            hoverable
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
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
              <span style={{ color: "#1677ff", fontWeight: 600, fontSize: 16 }}>
                📈 Xu hướng doanh thu
              </span>
            }
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
            }}
            hoverable
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
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

export default DashboardOverview;

