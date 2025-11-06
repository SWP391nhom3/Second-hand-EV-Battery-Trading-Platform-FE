import React from "react";
import { Typography, Table, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

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

export default UserManagement;

