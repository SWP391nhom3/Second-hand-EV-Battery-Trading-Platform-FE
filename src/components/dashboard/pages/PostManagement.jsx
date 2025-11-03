import React, { useState, useEffect } from 'react';
import { Typography, Table, Input, Select, Space, Tag, Button, DatePicker, Modal, Descriptions, Form, message } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined, WarningOutlined, UserDeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TextArea } = Input;

const fakePosts = [
  {
    id: 'p1',
    title: 'Đánh giá xe điện VinFast VF e34 sau 1 năm sử dụng',
    author: 'user1',
    status: 'pending',
    type: 'review',
    reports: 5,
    createdAt: '2025-10-25T10:00:00Z',
    content: 'Nội dung chi tiết đánh giá về xe VinFast VF e34...',
    violations: ['spam', 'misleading_info'],
    reportReasons: ['Thông tin sai lệch', 'Quảng cáo'],
    metadata: { views: 1200, comments: 45 },
  },
  {
    id: 'p2',
    title: 'Cần mua pin xe điện cũ cho xe máy Yadea',
    author: 'user2',
    status: 'approved',
    type: 'request',
    reports: 0,
    createdAt: '2025-10-20T14:30:00Z',
    content: 'Tìm mua pin xe điện cũ còn dùng tốt cho xe Yadea, liên hệ 09x-xxx-xxxx',
    violations: [],
    reportReasons: [],
    metadata: { views: 800, comments: 12 },
  },
  {
    id: 'p3',
    title: 'Bán bộ sạc nhanh xe VinFast VF8',
    author: 'user3',
    status: 'rejected',
    type: 'sale',
    reports: 1,
    createdAt: '2025-10-18T09:15:00Z',
    content: 'Bán bộ sạc nhanh chính hãng cho VinFast VF8, giá thương lượng. Hình ảnh đính kèm.',
    violations: ['duplicate_post'],
    reportReasons: ['Trùng lặp bài viết'],
    metadata: { views: 500, comments: 5 },
  },
  {
    id: 'p4',
    title: 'Hỏi đáp về trạm sạc công cộng tại TP.HCM',
    author: 'user4',
    status: 'pending',
    type: 'qa',
    reports: 2,
    createdAt: '2025-10-28T11:00:00Z',
    content: 'Có ai biết các trạm sạc công cộng nào uy tín ở TP.HCM không? Chia sẻ kinh nghiệm nhé!',
    violations: [],
    reportReasons: ['Nội dung không phù hợp'],
    metadata: { views: 1500, comments: 60 },
  },
  {
    id: 'p5',
    title: 'Chia sẻ kinh nghiệm tự thay pin xe đạp điện',
    author: 'user5',
    status: 'approved',
    type: 'guide',
    reports: 0,
    createdAt: '2025-10-15T16:00:00Z',
    content: 'Hướng dẫn chi tiết cách tự thay pin cho xe đạp điện tại nhà, có hình ảnh minh họa.',
    violations: [],
    reportReasons: [],
    metadata: { views: 2500, comments: 90 },
  },
];

const PostManagement = () => {
  const [posts, setPosts] = useState(fakePosts);
  const [filteredPosts, setFilteredPosts] = useState(fakePosts);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [authorFilter, setAuthorFilter] = useState(null);
  const [reportCountFilter, setReportCountFilter] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [isWarningModalVisible, setIsWarningModalVisible] = useState(false);
  const [warningForm] = Form.useForm();

  useEffect(() => {
    let tempPosts = posts;

    // Filter by search text
    if (searchText) {
      tempPosts = tempPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchText.toLowerCase()) ||
          post.author.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      tempPosts = tempPosts.filter((post) => post.status === statusFilter);
    }

    // Filter by type
    if (typeFilter) {
      tempPosts = tempPosts.filter((post) => post.type === typeFilter);
    }

    // Filter by author
    if (authorFilter) {
      tempPosts = tempPosts.filter((post) => post.author === authorFilter);
    }

    // Filter by report count
    if (reportCountFilter) {
      tempPosts = tempPosts.filter((post) => post.reports >= reportCountFilter);
    }

    // Filter by date range
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      tempPosts = tempPosts.filter((post) => {
        const postDate = new Date(post.createdAt);
        return (!start || postDate >= start) && (!end || postDate <= end);
      });
    }

    setFilteredPosts(tempPosts);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset pagination on filter change
  }, [searchText, statusFilter, typeFilter, authorFilter, reportCountFilter, dateRange, posts]);

  const handleApprove = (postId) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, status: 'approved' } : post));
    message.success('Bài viết đã được duyệt.');
  };

  const handleReject = (postId) => {
    setPosts(posts.map(post => post.id === postId ? { ...post, status: 'rejected' } : post));
    message.warning('Bài viết đã bị từ chối.');
  };

  const handleDelete = (postId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài viết này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => {
        setPosts(posts.filter(post => post.id !== postId));
        message.success('Bài viết đã được xóa.');
      },
    });
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    editForm.setFieldsValue(post);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = (values) => {
    setPosts(posts.map(post => post.id === selectedPost.id ? { ...post, ...values } : post));
    message.success('Bài viết đã được cập nhật.');
    setIsEditModalVisible(false);
    setSelectedPost(null);
  };

  const handleSendWarning = (post) => {
    setSelectedPost(post);
    warningForm.resetFields();
    setIsWarningModalVisible(true);
  };

  const handleWarningSubmit = (values) => {
    // Logic để gửi cảnh báo, có thể gọi API ở đây
    console.log(`Gửi cảnh báo cho ${selectedPost.author}: ${values.warningContent}`);
    message.info(`Đã gửi cảnh báo đến ${selectedPost.author}.`);
    setIsWarningModalVisible(false);
    setSelectedPost(null);
  };

  const handleBanUser = (userId) => {
    Modal.confirm({
      title: 'Xác nhận cấm người dùng',
      content: `Bạn có chắc chắn muốn cấm người dùng ${userId} này? Tất cả bài viết của họ sẽ bị từ chối.`,
      okText: 'Cấm',
      cancelText: 'Hủy',
      onOk: () => {
        setPosts(posts.map(post => post.author === userId ? { ...post, status: 'rejected' } : post));
        message.error(`Người dùng ${userId} đã bị cấm và tất cả bài viết của họ đã bị từ chối.`);
      },
    });
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Người đăng',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color;
        if (status === 'pending') {
          color = 'orange';
        } else if (status === 'approved') {
          color = 'green';
        } else {
          color = 'red';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Chờ duyệt', value: 'pending' },
        { text: 'Đã duyệt', value: 'approved' },
        { text: 'Từ chối', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: 'Loại nội dung',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Đánh giá', value: 'review' },
        { text: 'Yêu cầu', value: 'request' },
        { text: 'Mua bán', value: 'sale' },
        { text: 'Hỏi đáp', value: 'qa' },
        { text: 'Hướng dẫn', value: 'guide' },
      ],
      onFilter: (value, record) => record.type.indexOf(value) === 0,
    },
    {
      title: 'Số báo cáo',
      dataIndex: 'reports',
      key: 'reports',
      sorter: (a, b) => a.reports - b.reports,
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" onClick={() => {
            setSelectedPost(record);
            setIsDetailModalVisible(true);
          }}>Xem</Button>
          {record.status === 'pending' && (
            <>
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>Duyệt</Button>
              <Button danger icon={<StopOutlined />} onClick={() => handleReject(record.id)}>Từ chối</Button>
            </>
          )}
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Chỉnh sửa</Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Xóa</Button>
          <Button icon={<WarningOutlined />} onClick={() => handleSendWarning(record)}>Cảnh báo</Button>
          <Button danger icon={<UserDeleteOutlined />} onClick={() => handleBanUser(record.author)}>Cấm User</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Quản lý kiểm duyệt bài viết</Title>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Tìm kiếm theo tiêu đề hoặc người đăng"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 280 }}
        />
        <Select
          placeholder="Lọc theo trạng thái"
          allowClear
          style={{ width: 180 }}
          onChange={(value) => setStatusFilter(value)}
        >
          <Select.Option value="pending">Chờ duyệt</Select.Option>
          <Select.Option value="approved">Đã duyệt</Select.Option>
          <Select.Option value="rejected">Từ chối</Select.Option>
        </Select>
        <Select
          placeholder="Lọc theo loại nội dung"
          allowClear
          style={{ width: 180 }}
          onChange={(value) => setTypeFilter(value)}
        >
          <Select.Option value="review">Đánh giá</Select.Option>
          <Select.Option value="request">Yêu cầu</Select.Option>
          <Select.Option value="sale">Mua bán</Select.Option>
          <Select.Option value="qa">Hỏi đáp</Select.Option>
          <Select.Option value="guide">Hướng dẫn</Select.Option>
        </Select>
        <Input
          placeholder="Lọc theo người đăng"
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          style={{ width: 180 }}
        />
        <Input
          placeholder="Số báo cáo tối thiểu"
          type="number"
          value={reportCountFilter}
          onChange={(e) => setReportCountFilter(e.target.value ? parseInt(e.target.value) : null)}
          style={{ width: 180 }}
        />
        <DatePicker.RangePicker onChange={(dates) => setDateRange(dates)}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredPosts}
        rowKey="id"
        pagination={{ ...pagination, onChange: (page, pageSize) => setPagination({ page, pageSize }) }}
      />

      <Modal
        title="Chi tiết bài viết"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedPost && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{selectedPost.id}</Descriptions.Item>
            <Descriptions.Item label="Tiêu đề">{selectedPost.title}</Descriptions.Item>
            <Descriptions.Item label="Người đăng">{selectedPost.author}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedPost.status === 'pending' ? 'orange' : selectedPost.status === 'approved' ? 'green' : 'red'}>
                {selectedPost.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Loại nội dung">{selectedPost.type}</Descriptions.Item>
            <Descriptions.Item label="Số báo cáo">{selectedPost.reports}</Descriptions.Item>
            <Descriptions.Item label="Thời gian tạo">{new Date(selectedPost.createdAt).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Nội dung">
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #f0f0f0', padding: '8px', borderRadius: '4px' }}>
                {selectedPost.content}
              </div>
            </Descriptions.Item>
            {selectedPost.violations && selectedPost.violations.length > 0 && (
              <Descriptions.Item label="Lịch sử vi phạm">
                <Space>
                  {selectedPost.violations.map((v, i) => (
                    <Tag color="volcano" key={i}>{v}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
            )}
            {selectedPost.reportReasons && selectedPost.reportReasons.length > 0 && (
              <Descriptions.Item label="Lý do báo cáo">
                <Space>
                  {selectedPost.reportReasons.map((r, i) => (
                    <Tag color="red" key={i}>{r}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
            )}
            {selectedPost.metadata && Object.keys(selectedPost.metadata).length > 0 && (
              <Descriptions.Item label="Metadata">
                {Object.entries(selectedPost.metadata).map(([key, value]) => (
                  <div key={key}><strong>{key}:</strong> {value}</div>
                ))}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Edit Post Modal */}
      <Modal
        title="Chỉnh sửa bài viết"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => editForm.submit()}
        width={800}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Người đăng" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="pending">Chờ duyệt</Select.Option>
              <Select.Option value="approved">Đã duyệt</Select.Option>
              <Select.Option value="rejected">Từ chối</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Loại nội dung" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="review">Đánh giá</Select.Option>
              <Select.Option value="request">Yêu cầu</Select.Option>
              <Select.Option value="sale">Mua bán</Select.Option>
              <Select.Option value="qa">Hỏi đáp</Select.Option>
              <Select.Option value="guide">Hướng dẫn</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
            <TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Send Warning Modal */}
      <Modal
        title="Gửi cảnh báo"
        open={isWarningModalVisible}
        onCancel={() => setIsWarningModalVisible(false)}
        onOk={() => warningForm.submit()}
      >
        <Form form={warningForm} layout="vertical" onFinish={handleWarningSubmit}>
          <Form.Item name="warningContent" label="Nội dung cảnh báo" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Nhập nội dung cảnh báo" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostManagement;
