import React, { useState } from "react";
import { Typography, Table, Tag, Space, Button, Modal, Form, Input, Select, message, Popconfirm, Badge, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, EyeOutlined, BanOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// === DỮ LIỆU GIẢ CHO BÀI VIẾT ===
const fakePosts = [
  {
    id: "1",
    title: "Bán xe VinFast VF e34, đã đi 15.000km",
    author: "user123",
    authorId: "user123",
    type: "vehicle",
    status: "pending",
    reportCount: 3,
    reportedReasons: ["Thông tin sai lệch", "Giá không hợp lý"],
    createdAt: "2025-10-20T10:00:00Z",
    content: "Cần bán gấp xe VinFast VF e34, màu trắng, đăng ký cuối năm 2023, đã đi 15.000km. Xe còn mới, bảo dưỡng định kỳ tại hãng. Giá có thương lượng. Liên hệ: 0912345678. Địa điểm xem xe: TP.HCM.",
    metadata: {
      brand: "VinFast",
      model: "VF e34",
      mileage: "15,000km",
      year: 2023,
      color: "Trắng"
    },
    violationHistory: [
      { date: "2025-09-01", reason: "Đăng trùng bài", action: "Cảnh báo" },
    ],
  },
  {
    id: "2",
    title: "Thanh lý pin Lithium cho xe điện, dung lượng 60V 30Ah",
    author: "seller456",
    authorId: "seller456",
    type: "battery",
    status: "approved",
    reportCount: 0,
    reportedReasons: [],
    createdAt: "2025-10-18T14:30:00Z",
    content: "Pin Lithium chất lượng cao, còn mới 90%, phù hợp cho các dòng xe điện 60V. Dung lượng 30Ah, đi được khoảng 80km sau mỗi lần sạc đầy. Bảo hành 6 tháng. Giá 12.000.000 VNĐ. Liên hệ: 0987654321.",
    metadata: {
      capacity: "60V 30Ah",
      condition: "90% new",
      warranty: "6 tháng"
    },
    violationHistory: [],
  },
  {
    id: "3",
    title: "Tìm mua xe máy điện cũ giá rẻ",
    author: "buyer789",
    authorId: "buyer789",
    type: "request",
    status: "rejected",
    reportCount: 1,
    reportedReasons: ["Nội dung không phù hợp"],
    createdAt: "2025-10-15T09:15:00Z",
    content: "Mình đang tìm mua một chiếc xe máy điện cũ, ưu tiên các dòng xe của VinFast hoặc DatBike. Yêu cầu xe còn hoạt động tốt, giá dưới 15 triệu. Ai có inbox mình nhé.",
    metadata: {
      budget: "Dưới 15 triệu",
      preferredBrands: ["VinFast", "DatBike"]
    },
    violationHistory: [
      { date: "2025-10-10", reason: "Vi phạm quy định đăng bài", action: "Từ chối" },
    ],
  },
  {
    id: "4",
    title: "Cần pin xe điện Tesla Model 3",
    author: "user123",
    authorId: "user123",
    type: "battery",
    status: "pending",
    reportCount: 0,
    reportedReasons: [],
    createdAt: "2025-10-25T11:00:00Z",
    content: "Tôi đang cần tìm mua pin cho xe Tesla Model 3. Ưu tiên pin còn bảo hành, tình trạng tốt. Ai có vui lòng liên hệ 0900111222.",
    metadata: {
      model: "Tesla Model 3",
      condition: "Tốt, có bảo hành"
    },
    violationHistory: [],
  },
  {
    id: "5",
    title: "Bán xe đạp điện Asama còn mới",
    author: "member_test",
    authorId: "member_test",
    type: "bike",
    status: "pending",
    reportCount: 5,
    reportedReasons: ["Hình ảnh không rõ ràng", "Giá quá cao", "Đăng lại"],
    createdAt: "2025-10-22T16:45:00Z",
    content: "Bán xe đạp điện Asama, mới mua được 3 tháng nhưng ít sử dụng. Xe còn rất mới, đầy đủ phụ kiện. Giá 7 triệu. Liên hệ 0900333444.",
    metadata: {
      brand: "Asama",
      age: "3 tháng",
      price: "7 triệu"
    },
    violationHistory: [],
  },
];

const PostManagementPage = () => {
  const [posts, setPosts] = useState(fakePosts);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // New state for detail modal
  const [form] = Form.useForm();

  const handleDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id));
    message.success("Xóa bài viết thành công!");
  };

  const handleApprove = (id) => {
    setPosts(posts.map(post => post.id === id ? { ...post, status: "approved" } : post));
    message.success("Duyệt bài viết thành công!");
  };

  const handleReject = (id) => {
    setPosts(posts.map(post => post.id === id ? { ...post, status: "rejected" } : post));
    message.success("Từ chối bài viết thành công!");
  };

  const handleReport = (id) => {
    setPosts(posts.map(post => post.id === id ? { ...post, reportCount: post.reportCount + 1 } : post));
    message.warning("Báo cáo bài viết thành công!");
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    form.setFieldsValue(post);
    setIsModalVisible(true);
  };

  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setIsDetailModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
    form.resetFields();
  };

  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
    setSelectedPost(null);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      setPosts(posts.map(post => post.id === selectedPost.id ? { ...post, ...values } : post));
      setIsModalVisible(false);
      message.success("Cập nhật bài viết thành công!");
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Space>
          <Text strong>{text}</Text>
          <Badge
            count={record.reportCount}
            style={{ backgroundColor: record.reportCount > 0 ? "#ff4d4f" : "#52c41a" }}
          />
        </Space>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "vehicle" ? "blue" : type === "battery" ? "green" : "purple"}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status === "approved" ? "success" : status === "rejected" ? "error" : "processing"}
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
          {record.status === "pending" && (
            <>
              <Popconfirm
                title="Bạn có chắc chắn muốn duyệt bài viết này?"
                onConfirm={() => handleApprove(record.id)}
                okText="Duyệt"
                cancelText="Hủy"
              >
                <Button type="link" icon={<CheckCircleOutlined />} />
              </Popconfirm>
              <Popconfirm
                title="Bạn có chắc chắn muốn từ chối bài viết này?"
                onConfirm={() => handleReject(record.id)}
                okText="Từ chối"
                cancelText="Hủy"
              >
                <Button type="link" icon={<CloseCircleOutlined />} />
              </Popconfirm>
            </>
          )}
          <Popconfirm
            title="Bạn có chắc chắn muốn báo cáo bài viết này?"
            onConfirm={() => handleReport(record.id)}
            okText="Báo cáo"
            cancelText="Hủy"
          >
            <Button type="link" icon={<WarningOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Quản lý kiểm duyệt bài viết</Title>
      <p>Nội dung quản lý kiểm duyệt bài viết sẽ ở đây.</p>

      <Table
        columns={columns}
        dataSource={posts}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={selectedPost ? "Sửa bài viết" : "Thêm bài viết"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
            {selectedPost ? "Cập nhật" : "Thêm"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="author"
            label="Tác giả"
            rules={[{ required: true, message: "Vui lòng nhập tác giả!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="authorId"
            label="ID Tác giả"
            rules={[{ required: true, message: "Vui lòng nhập ID tác giả!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Loại"
            rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
          >
            <Select>
              <Option value="vehicle">Xe cộ</Option>
              <Option value="battery">Pin xe điện</Option>
              <Option value="request">Yêu cầu mua</Option>
              <Option value="bike">Xe đạp điện</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value="pending">Chờ duyệt</Option>
              <Option value="approved">Đã duyệt</Option>
              <Option value="rejected">Đã từ chối</Option>
            </Select>
          </Form.Item>
          {selectedPost && (
            <>
              <Form.Item
                name="metadata"
                label="Thông tin phụ"
              >
                <Input.Group compact>
                  <Input style={{ width: 'calc(100% - 100px)' }} placeholder="Ví dụ: brand: VinFast, model: VF e34" />
                  <Button type="dashed">Thêm</Button>
                </Input.Group>
              </Form.Item>
              <Form.Item
                name="violationHistory"
                label="Lịch sử vi phạm"
              >
                <Input.Group compact>
                  <Input style={{ width: 'calc(100% - 100px)' }} placeholder="Ví dụ: date: 2025-10-10, reason: Vi phạm quy định đăng bài, action: Từ chối" />
                  <Button type="dashed">Thêm</Button>
                </Input.Group>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      <Modal
        title="Chi tiết bài viết"
        visible={isDetailModalVisible}
        onCancel={handleDetailCancel}
        footer={null}
        width={700}
      >
        {selectedPost && (
          <div>
            <Text strong>ID:</Text> <Text>{selectedPost.id}</Text><br />
            <Text strong>Tiêu đề:</Text> <Text>{selectedPost.title}</Text><br />
            <Text strong>Nội dung:</Text> <Text>{selectedPost.content}</Text><br />
            <Text strong>Tác giả:</Text> <Text>{selectedPost.author} ({selectedPost.authorId})</Text><br />
            <Text strong>Loại:</Text> <Tag color={selectedPost.type === "vehicle" ? "blue" : selectedPost.type === "battery" ? "green" : "purple"}>
              {selectedPost.type.charAt(0).toUpperCase() + selectedPost.type.slice(1)}
            </Tag><br />
            <Text strong>Trạng thái:</Text> <Badge
              status={selectedPost.status === "approved" ? "success" : selectedPost.status === "rejected" ? "error" : "processing"}
              text={selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
            /><br />
            <Text strong>Số báo cáo:</Text> <Text>{selectedPost.reportCount}</Text><br />
            {selectedPost.reportedReasons.length > 0 && (
              <>
                <Text strong>Lý do báo cáo:</Text> <Text>{selectedPost.reportedReasons.join(", ")}</Text><br />
              </>
            )}
            <Text strong>Ngày tạo:</Text> <Text>{new Date(selectedPost.createdAt).toLocaleString()}</Text><br />
            {selectedPost.metadata && Object.keys(selectedPost.metadata).length > 0 && (
              <>
                <Text strong>Metadata:</Text>
                <ul>
                  {Object.entries(selectedPost.metadata).map(([key, value]) => (
                    <li key={key}><Text strong>{key}:</Text> <Text>{value}</Text></li>
                  ))}
                </ul>
              </>
            )}
            {selectedPost.violationHistory.length > 0 && (
              <>
                <Text strong>Lịch sử vi phạm:</Text>
                <ul>
                  {selectedPost.violationHistory.map((history, index) => (
                    <li key={index}><Text>{history.date}: {history.reason} - {history.action}</Text></li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PostManagementPage;
