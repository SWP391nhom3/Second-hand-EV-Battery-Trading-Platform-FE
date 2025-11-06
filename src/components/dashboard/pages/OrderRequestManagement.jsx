import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  Input,
  Select,
  Space,
  Tag,
  Button,
  Modal,
  Descriptions,
  Form,
  message,
  Avatar,
  Badge,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import orderRequestService from "../../../services/orderRequestService";
import orderAssignmentService from "../../../services/orderAssignmentService";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Mock data - sẽ thay bằng API
const mockOrderRequests = [
  {
    id: "ORD001",
    postRequestId: "PR001",
    buyer: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "nguyenvana@email.com",
      memberId: "M001",
    },
    seller: {
      name: "Trần Thị B",
      phone: "0907654321",
      email: "tranthib@email.com",
      memberId: "M002",
    },
    product: {
      id: "P001",
      name: "VinFast VF e34",
      type: "Ô tô điện",
      price: 690000000,
    },
    offerPrice: 680000000,
    message: "Tôi muốn mua xe này, có thể hỗ trợ vay 70% không?",
    status: "pending",
    createdAt: "2025-11-01T10:00:00Z",
    assignedStaff: null,
    assignedStaffName: null,
  },
  {
    id: "ORD002",
    postRequestId: "PR002",
    buyer: {
      name: "Lê Văn C",
      phone: "0912345678",
      email: "levanc@email.com",
      memberId: "M003",
    },
    seller: {
      name: "Phạm Thị D",
      phone: "0923456789",
      email: "phamthid@email.com",
      memberId: "M004",
    },
    product: {
      id: "P002",
      name: "Pin Lithium 60V 30Ah",
      type: "Pin",
      price: 12000000,
    },
    offerPrice: 11000000,
    message: "Pin còn mới không? Có bảo hành không?",
    status: "pending",
    createdAt: "2025-11-02T14:30:00Z",
    assignedStaff: null,
    assignedStaffName: null,
  },
  {
    id: "ORD003",
    postRequestId: "PR003",
    buyer: {
      name: "Hoàng Văn E",
      phone: "0934567890",
      email: "hoangvane@email.com",
      memberId: "M005",
    },
    seller: {
      name: "Vũ Thị F",
      phone: "0945678901",
      email: "vuthif@email.com",
      memberId: "M006",
    },
    product: {
      id: "P003",
      name: "VinFast VF 8",
      type: "Ô tô điện",
      price: 1200000000,
    },
    offerPrice: 1180000000,
    message: "Xe có bao nhiêu km? Có thể test drive không?",
    status: "assigned",
    createdAt: "2025-11-03T09:15:00Z",
    assignedStaff: "staff1",
    assignedStaffName: "Trần Thị Staff",
    assignedAt: "2025-11-03T10:00:00Z",
  },
];

const OrderRequestManagement = () => {
  const [orderRequests, setOrderRequests] = useState(mockOrderRequests);
  const [filteredRequests, setFilteredRequests] = useState(mockOrderRequests);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [assignForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Load staff list
  useEffect(() => {
    const loadStaffList = async () => {
      try {
        const staffs = await orderAssignmentService.getStaffList();
        setStaffList(staffs);
      } catch (error) {
        console.error("Error loading staff list:", error);
        message.error("Không thể tải danh sách staff");
      }
    };
    loadStaffList();
  }, []);

  // Load order requests (sẵn sàng cho API)
  useEffect(() => {
    const loadOrderRequests = async () => {
      try {
        setLoading(true);
        // TODO: Uncomment khi có API
        // const data = await orderRequestService.getAllOrderRequests();
        // setOrderRequests(data);
        
        // Load assigned info từ localStorage
        const assignments = orderAssignmentService.getAssignedOrdersSync();
        const updated = orderRequests.map((req) => {
          const assignment = assignments.find((a) => a.orderId === req.id);
          if (assignment) {
            return {
              ...req,
              assignedStaff: assignment.staffId,
              assignedStaffName: assignment.staffName,
              assignedAt: assignment.assignedAt,
              status: "assigned",
            };
          }
          return req;
        });
        setOrderRequests(updated);
        setLoading(false);
      } catch (error) {
        console.error("Error loading order requests:", error);
        message.error("Không thể tải danh sách yêu cầu đơn hàng");
        setLoading(false);
      }
    };
    loadOrderRequests();
  }, []);

  // Filter requests
  useEffect(() => {
    let filtered = orderRequests;

    if (searchText) {
      filtered = filtered.filter(
        (req) =>
          req.buyer.name.toLowerCase().includes(searchText.toLowerCase()) ||
          req.seller.name.toLowerCase().includes(searchText.toLowerCase()) ||
          req.product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          req.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [searchText, statusFilter, orderRequests]);

  const handleAssignToStaff = async (orderRequest) => {
    setSelectedRequest(orderRequest);
    assignForm.setFieldsValue({ staffId: orderRequest.assignedStaff || null });
    setIsAssignModalVisible(true);
  };

  const handleAssignSubmit = async (values) => {
    if (!selectedRequest) return;

    try {
      setLoading(true);
      // Gán đơn hàng cho staff
      await orderAssignmentService.assignOrderToStaff(
        selectedRequest.id,
        values.staffId,
        {
          orderRequestId: selectedRequest.id,
          postRequestId: selectedRequest.postRequestId,
          buyerId: selectedRequest.buyer.memberId,
          sellerId: selectedRequest.seller.memberId,
          productId: selectedRequest.product.id,
          productName: selectedRequest.product.name,
          offerPrice: selectedRequest.offerPrice,
          message: selectedRequest.message,
        }
      );

      // Cập nhật trạng thái local
      setOrderRequests((prev) =>
        prev.map((req) =>
          req.id === selectedRequest.id
            ? {
                ...req,
                assignedStaff: values.staffId,
                assignedStaffName: staffList.find((s) => s.id === values.staffId)?.name,
                assignedAt: new Date().toISOString(),
                status: "assigned",
              }
            : req
        )
      );

      message.success(
        `Đã gán đơn hàng cho ${staffList.find((s) => s.id === values.staffId)?.name}`
      );
      setIsAssignModalVisible(false);
      setSelectedRequest(null);
      setLoading(false);
    } catch (error) {
      console.error("Error assigning order:", error);
      message.error("Không thể gán đơn hàng");
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      // TODO: Uncomment khi có API
      // await orderRequestService.acceptOrderRequest(id);
      
      setOrderRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: "accepted" } : req))
      );
      message.success("Đã chấp nhận yêu cầu đơn hàng");
    } catch (error) {
      console.error("Error accepting request:", error);
      message.error("Không thể chấp nhận yêu cầu");
    }
  };

  const handleRejectRequest = async (id) => {
    Modal.confirm({
      title: "Xác nhận từ chối",
      content: "Bạn có chắc chắn muốn từ chối yêu cầu đơn hàng này?",
      onOk: async () => {
        try {
          // TODO: Uncomment khi có API
          // await orderRequestService.rejectOrderRequest(id);
          
          setOrderRequests((prev) =>
            prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req))
          );
          message.warning("Đã từ chối yêu cầu đơn hàng");
        } catch (error) {
          console.error("Error rejecting request:", error);
          message.error("Không thể từ chối yêu cầu");
        }
      },
    });
  };

  const getStatusTag = (status) => {
    const statusMap = {
      pending: { color: "orange", text: "Chờ xử lý", icon: <ClockCircleOutlined /> },
      assigned: { color: "blue", text: "Đã gán", icon: <UserAddOutlined /> },
      accepted: { color: "green", text: "Đã chấp nhận", icon: <CheckCircleOutlined /> },
      rejected: { color: "red", text: "Đã từ chối", icon: <CloseCircleOutlined /> },
      completed: { color: "green", text: "Hoàn thành", icon: <CheckCircleOutlined /> },
    };

    const config = statusMap[status] || statusMap.pending;
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Người mua",
      key: "buyer",
      render: (_, record) => (
        <div>
          <div>{record.buyer.name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.buyer.phone}
          </Text>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      key: "product",
      render: (_, record) => (
        <div>
          <div>{record.product.name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.product.type}
          </Text>
        </div>
      ),
    },
    {
      title: "Giá đề xuất",
      key: "offerPrice",
      render: (_, record) => (
        <div>
          <Text strong>{record.offerPrice.toLocaleString()}₫</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Giá gốc: {record.product.price.toLocaleString()}₫
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: getStatusTag,
      filters: [
        { text: "Chờ xử lý", value: "pending" },
        { text: "Đã gán", value: "assigned" },
        { text: "Đã chấp nhận", value: "accepted" },
        { text: "Đã từ chối", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Đã gán cho Staff",
      key: "assignedStaff",
      render: (_, record) => {
        if (record.assignedStaff) {
          return (
            <Space>
              <Avatar size="small" icon={<UserOutlined />} />
              <span>{record.assignedStaffName || "N/A"}</span>
            </Space>
          );
        }
        return <Tag color="default">Chưa gán</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small" wrap>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedRequest(record);
              setIsDetailModalVisible(true);
            }}
          >
            Xem
          </Button>
          {record.status === "pending" && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<SendOutlined />}
                onClick={() => handleAssignToStaff(record)}
              >
                Gán Staff
              </Button>
              <Button
                type="default"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleAcceptRequest(record.id)}
              >
                Chấp nhận
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleRejectRequest(record.id)}
              >
                Từ chối
              </Button>
            </>
          )}
          {record.status === "assigned" && (
            <Button
              type="default"
              size="small"
              icon={<UserAddOutlined />}
              onClick={() => handleAssignToStaff(record)}
            >
              Đổi Staff
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Quản lý yêu cầu đơn hàng
        </Title>
        <Badge
          count={orderRequests.filter((r) => r.status === "pending").length}
          showZero
        >
          <Tag color="orange" style={{ padding: "4px 12px", fontSize: 14 }}>
            Chờ xử lý: {orderRequests.filter((r) => r.status === "pending").length}
          </Tag>
        </Badge>
      </div>

      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Input
          placeholder="Tìm kiếm theo tên, sản phẩm, mã đơn..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          style={{ width: 180 }}
          onChange={(value) => setStatusFilter(value)}
        >
          <Select.Option value="pending">Chờ xử lý</Select.Option>
          <Select.Option value="assigned">Đã gán</Select.Option>
          <Select.Option value="accepted">Đã chấp nhận</Select.Option>
          <Select.Option value="rejected">Đã từ chối</Select.Option>
          <Select.Option value="completed">Hoàn thành</Select.Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredRequests}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Detail Modal */}
      <Modal
        title="Chi tiết yêu cầu đơn hàng"
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedRequest(null);
        }}
        footer={null}
        width={800}
      >
        {selectedRequest && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã đơn">
              {selectedRequest.id}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {getStatusTag(selectedRequest.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Người mua">
              <div>
                <div>
                  <strong>{selectedRequest.buyer.name}</strong>
                </div>
                <div>SĐT: {selectedRequest.buyer.phone}</div>
                <div>Email: {selectedRequest.buyer.email}</div>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Người bán">
              <div>
                <div>
                  <strong>{selectedRequest.seller.name}</strong>
                </div>
                <div>SĐT: {selectedRequest.seller.phone}</div>
                <div>Email: {selectedRequest.seller.email}</div>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Sản phẩm">
              <div>
                <div>
                  <strong>{selectedRequest.product.name}</strong>
                </div>
                <div>Loại: {selectedRequest.product.type}</div>
                <div>Giá gốc: {selectedRequest.product.price.toLocaleString()}₫</div>
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Giá đề xuất">
              <Text strong style={{ fontSize: 16, color: "#1677ff" }}>
                {selectedRequest.offerPrice.toLocaleString()}₫
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Tin nhắn">
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  padding: "8px",
                  background: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                {selectedRequest.message}
              </div>
            </Descriptions.Item>
            {selectedRequest.assignedStaff && (
              <Descriptions.Item label="Đã gán cho">
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <span>{selectedRequest.assignedStaffName}</span>
                  {selectedRequest.assignedAt && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ({new Date(selectedRequest.assignedAt).toLocaleString("vi-VN")})
                    </Text>
                  )}
                </Space>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Ngày tạo">
              {new Date(selectedRequest.createdAt).toLocaleString("vi-VN")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Assign Modal */}
      <Modal
        title="Gán đơn hàng cho Staff"
        open={isAssignModalVisible}
        onCancel={() => {
          setIsAssignModalVisible(false);
          setSelectedRequest(null);
        }}
        onOk={() => assignForm.submit()}
        okText="Gán đơn hàng"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={assignForm} layout="vertical" onFinish={handleAssignSubmit}>
          <Form.Item
            name="staffId"
            label="Chọn Staff"
            rules={[{ required: true, message: "Vui lòng chọn staff" }]}
          >
            <Select
              placeholder="Chọn staff để gán đơn hàng"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {staffList.map((staff) => (
                <Select.Option key={staff.id} value={staff.id}>
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span>{staff.name}</span>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ({staff.email})
                    </Text>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {selectedRequest && (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: "#f5f5f5",
                borderRadius: 4,
              }}
            >
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Thông tin đơn hàng:
              </Text>
              <div style={{ fontSize: 13 }}>
                <div>
                  <strong>Mã đơn:</strong> {selectedRequest.id}
                </div>
                <div>
                  <strong>Sản phẩm:</strong> {selectedRequest.product.name}
                </div>
                <div>
                  <strong>Người mua:</strong> {selectedRequest.buyer.name}
                </div>
                <div>
                  <strong>Giá đề xuất:</strong> {selectedRequest.offerPrice.toLocaleString()}₫
                </div>
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default OrderRequestManagement;

