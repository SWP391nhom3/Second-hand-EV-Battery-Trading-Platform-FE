import React, { useState } from "react";
import {
  Typography,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  SendOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { TextArea } = Input;

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

const ProductManagement = () => {
  const [products, setProducts] = useState(fakeProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();

  const handleSendToStaff = () => {
    form.validateFields().then((values) => {
      message.success(
        `Đã gửi yêu cầu hỗ trợ cho Staff: ${values.customerName}`
      );
      setIsModalOpen(false);
      form.resetFields();
    });
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
        if (record.paymentFlow === "staff") {
          return (
            <Tag color="orange" icon={<ClockCircleOutlined />}>
              Đang chờ Staff
            </Tag>
          );
        }

        const status = record.transactionStatus || "Chưa xác định";
        let color = "default";
        let icon = null;

        if (status === "Đã thanh toán") {
          color = "green";
          icon = <CheckCircleOutlined />;
        } else if (status === "Chờ thanh toán") {
          color = "orange";
          icon = <ClockCircleOutlined />;
        } else if (status === "Hủy") {
          color = "red";
          icon = <StopOutlined />;
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
      render: (_, record) => (
        <Space>
          {record.paymentFlow === "staff" ? (
            <Button
              size="small"
              type="primary"
              icon={<SendOutlined />}
              onClick={() => {
                setSelectedProduct(record);
                setIsModalOpen(true);
              }}
              disabled={record.stock === 0}
            >
              Gửi Staff
            </Button>
          ) : (
            <Button
              size="small"
              type="primary"
              icon={<CheckCircleOutlined />}
              disabled={
                record.stock === 0 ||
                record.transactionStatus === "Đã thanh toán"
              }
              onClick={() => {
                if (record.transactionStatus !== "Đã thanh toán") {
                  Modal.confirm({
                    title: "Xác nhận thanh toán",
                    content: `Xác nhận khách hàng đã thanh toán cho ${record.name}?`,
                    onOk: () => {
                      setProducts((prev) =>
                        prev.map((p) =>
                          p.key === record.key
                            ? { ...p, transactionStatus: "Đã thanh toán" }
                            : p
                        )
                      );
                      message.success("Đã cập nhật trạng thái: Đã thanh toán");
                    },
                  });
                }
              }}
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
        title="Gửi yêu cầu hỗ trợ đến Staff"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={handleSendToStaff}
        okText="Gửi yêu cầu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Sản phẩm">
            <Input value={selectedProduct?.name} disabled />
          </Form.Item>
          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[
              { required: true, message: "Vui lòng nhập tên khách hàng" },
            ]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
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

export default ProductManagement;
