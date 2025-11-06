import React from "react";
import { Typography, Table, Badge } from "antd";

const { Title } = Typography;

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

export default StaffRequestManagement;

