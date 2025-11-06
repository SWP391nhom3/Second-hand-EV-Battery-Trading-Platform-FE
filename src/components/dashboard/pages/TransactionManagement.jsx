import React, { useState } from "react";
import { Typography, Table, Tag, Button, Modal, message, Space } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  SendOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

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

const fakeProducts = [
  {
    key: "1",
    name: "VinFast VF e34",
    paymentFlow: "staff",
  },
  {
    key: "2",
    name: "VinFast VF 8",
    paymentFlow: "staff",
  },
];

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState(fakeTransactions);

  const updateTransactionStatus = (key, newStatus) => {
    setTransactions((prev) =>
      prev.map((t) => (t.key === key ? { ...t, status: newStatus } : t))
    );
    message.success(`Cập nhật trạng thái: ${newStatus}`);
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
      render: (status) => {
        let color = "default";
        let icon = null;

        switch (status) {
          case "Đã thanh toán":
            color = "green";
            icon = <CheckCircleOutlined />;
            break;
          case "Chờ thanh toán":
            color = "orange";
            icon = <ClockCircleOutlined />;
            break;
          case "Đang chờ Staff":
            color = "processing";
            icon = <ClockCircleOutlined />;
            break;
          case "Hủy":
            color = "red";
            icon = <StopOutlined />;
            break;
          default:
            color = "default";
        }

        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        const isStaffFlow =
          fakeProducts.find((p) => p.name === record.product)?.paymentFlow ===
          "staff";

        return (
          <Space>
            {isStaffFlow ? (
              <Button
                size="small"
                type="primary"
                icon={<SendOutlined />}
                disabled={record.status !== "Đang chờ Staff"}
                onClick={() => {
                  message.info("Đã gửi nhắc nhở đến Staff!");
                }}
              >
                Nhắc Staff
              </Button>
            ) : (
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                disabled={
                  record.status === "Đã thanh toán" || record.status === "Hủy"
                }
                onClick={() => {
                  Modal.confirm({
                    title: "Xác nhận thanh toán",
                    content: `Xác nhận thanh toán cho đơn ${record.orderId}?`,
                    onOk: () => {
                      updateTransactionStatus(record.key, "Đã thanh toán");
                    },
                  });
                }}
              >
                Thanh toán
              </Button>
            )}
          </Space>
        );
      },
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

export default TransactionManagement;
