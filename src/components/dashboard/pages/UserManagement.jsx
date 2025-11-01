import React from "react";
import { Typography } from "antd";
const { Title } = Typography;

const UserManagement = () => {
  return (
    <div>
      <Title level={4}>Quản lý người dùng 👥</Title>
      <p>Hiển thị danh sách người dùng và các thao tác CRUD.</p>
    </div>
  );
};

export default UserManagement;
