import React from "react";
import { Typography } from "antd";
const { Title } = Typography;

const DashboardOverview = () => {
  return (
    <div>
      <Title level={4}>Tổng quan hệ thống ⚡</Title>
      <p>Đây là trang tổng quan hiển thị các chỉ số hoạt động của hệ thống.</p>
    </div>
  );
};

export default DashboardOverview;
