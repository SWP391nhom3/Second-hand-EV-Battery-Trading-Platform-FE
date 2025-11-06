import React, { useState, useEffect } from 'react';
import { Typography, Table, Input, Select, Space, Tag, Button, DatePicker, Modal, Descriptions, Form, message, Spin, Card, Divider } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined, WarningOutlined, UserDeleteOutlined, LinkOutlined, CopyOutlined, DollarOutlined } from '@ant-design/icons';
import postService from '../../../services/postService';
import packageService from '../../../services/packageService';
import paymentService from '../../../services/paymentService';

const { Title } = Typography;
const { TextArea } = Input;

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [approveForm] = Form.useForm();
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState(null);
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);

  const fetchPosts = async (status = null) => {
    try {
      setLoading(true);
      
      // Use admin endpoint to get all posts with status filter
      // If status parameter is provided, use it; otherwise use statusFilter state
      const params = {};
      const filterStatus = status !== null ? status : statusFilter;
      if (filterStatus) {
        // Map component status to API status
        const statusMap = {
          'pending': 'PENDING',
          'approved': 'APPROVED',
          'rejected': 'REJECTED'
        };
        params.status = statusMap[filterStatus] || filterStatus.toUpperCase();
      }
      
      const response = await postService.getAdminAllPosts(params);
      
      // Handle different response structures
      let postsData = [];
      if (Array.isArray(response)) {
        postsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        postsData = response.data;
      } else if (response?.items && Array.isArray(response.items)) {
        postsData = response.items;
      } else if (typeof response === 'object' && response !== null) {
        postsData = response.posts || response.data || response.items || [];
      }

      // Transform API response to match component format
      const transformedPosts = postsData.map((post) => {
        // Map status from API format to component format
        let status = 'pending';
        if (post.status) {
          const statusLower = post.status.toLowerCase();
          if (statusLower === 'approved' || statusLower === 'active') {
            status = 'approved';
          } else if (statusLower === 'rejected' || statusLower === 'inactive') {
            status = 'rejected';
          } else {
            status = 'pending';
          }
        }

        // Determine type from postType or transactionType
        let type = 'sale';
        if (post.postType) {
          const postTypeLower = post.postType.toLowerCase();
          if (postTypeLower.includes('staff')) {
            type = 'request';
          }
        }
        if (post.transactionType) {
          const transTypeLower = post.transactionType.toLowerCase();
          if (transTypeLower.includes('request') || transTypeLower.includes('buy')) {
            type = 'request';
          } else if (transTypeLower.includes('sale') || transTypeLower.includes('sell')) {
            type = 'sale';
          }
        }

        return {
          id: post.postId || post.id,
          title: post.title || 'Không có tiêu đề',
          author: post.member?.fullName || post.member?.account?.email || post.author || 'Unknown',
          authorId: post.member?.memberId || post.memberId,
          status: status,
          type: type,
          reports: post.reportCount || 0,
          createdAt: post.createdAt || new Date().toISOString(),
          content: post.description || post.content || 'Không có nội dung',
          violations: post.violations || [],
          reportReasons: post.reportReasons || [],
          metadata: {
            views: post.views || 0,
            comments: post.comments || 0,
            price: post.price,
            postType: post.postType,
            transactionType: post.transactionType,
          },
          // Store original post data for API calls
          originalPost: post,
        };
      });

      setPosts(transformedPosts);
      setFilteredPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      message.error('Không thể tải danh sách bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts from API when component mounts or statusFilter changes
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);
  
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

    // Note: Status filter is handled server-side in fetchPosts()
    // No need to filter by status here

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

  const handleApproveClick = (postId) => {
    const post = posts.find(p => p.id === postId);
    setSelectedPost(post);
    approveForm.resetFields();
    setIsApproveModalVisible(true);
    fetchPackages();
  };

  const fetchPackages = async () => {
    try {
      setLoadingPackages(true);
      const response = await packageService.getActivePackages();
      const packagesData = Array.isArray(response) ? response : response.data || [];
      setPackages(packagesData);
    } catch (error) {
      console.error('Error fetching packages:', error);
      message.error('Không thể tải danh sách gói.');
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleApprove = async (values) => {
    try {
      const postId = selectedPost.id;
      const packageId = values.packageId || null;

      // Use admin approve endpoint with packageId
      const response = await postService.approvePost(postId, packageId);

      // Check if response contains checkoutUrl (package was selected)
      if (response.checkoutUrl) {
        setCheckoutInfo({
          checkoutUrl: response.checkoutUrl,
          orderCode: response.orderCode,
          transferContent: response.transferContent,
          package: response.package,
          post: response.post,
        });
        setIsCheckoutModalVisible(true);
        setIsApproveModalVisible(false);
        message.success('Bài viết đã được duyệt và tạo link thanh toán!');
      } else {
        message.success('Bài viết đã được duyệt.');
        setIsApproveModalVisible(false);
      }

      // Refresh data
      fetchPosts();
    } catch (error) {
      console.error('Error approving post:', error);
      
      // Check if error is related to PayOS service
      const errorMessage = error.response?.data?.message || error.message || '';
      const isPayOsError = errorMessage.includes('PayOs') || errorMessage.includes('PayOS') || 
                          errorMessage.includes('Unable to resolve service');
      
      if (isPayOsError && values.packageId) {
        // If PayOS service is not available but package was selected, offer to approve without package
        Modal.confirm({
          title: 'Không thể tạo thanh toán PayOS',
          content: 'Dịch vụ PayOS chưa được cấu hình. Bạn có muốn duyệt bài viết mà không gói đăng tin không?',
          okText: 'Duyệt không gói',
          cancelText: 'Hủy',
          onOk: async () => {
            try {
              // Approve without package
              await postService.approvePost(postId, null);
              message.success('Bài viết đã được duyệt (không gói).');
              setIsApproveModalVisible(false);
              fetchPosts();
            } catch (retryError) {
              console.error('Error approving without package:', retryError);
              message.error('Không thể duyệt bài viết. Vui lòng liên hệ admin.');
            }
          },
        });
      } else {
        message.error('Không thể duyệt bài viết. Vui lòng thử lại.');
      }
    }
  };

  const handleCopyCheckoutUrl = () => {
    if (checkoutInfo?.checkoutUrl) {
      navigator.clipboard.writeText(checkoutInfo.checkoutUrl);
      message.success('Đã sao chép link thanh toán!');
    }
  };

  const handleOpenCheckout = () => {
    if (checkoutInfo?.checkoutUrl) {
      window.open(checkoutInfo.checkoutUrl, '_blank');
    }
  };

  const handleReject = async (postId) => {
    try {
      // Use admin reject endpoint
      await postService.rejectPost(postId);

      // Update local state
      setPosts(posts.map(p => p.id === postId ? { ...p, status: 'rejected' } : p));
      message.warning('Bài viết đã bị từ chối.');
      // Refresh data
      fetchPosts();
    } catch (error) {
      console.error('Error rejecting post:', error);
      message.error('Không thể từ chối bài viết. Vui lòng thử lại.');
    }
  };

  const handleDelete = (postId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài viết này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await postService.deletePost(postId);
          setPosts(posts.filter(post => post.id !== postId));
          message.success('Bài viết đã được xóa.');
          // Refresh data
          fetchPosts();
        } catch (error) {
          console.error('Error deleting post:', error);
          message.error('Không thể xóa bài viết. Vui lòng thử lại.');
        }
      },
    });
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    editForm.setFieldsValue(post);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      const post = posts.find(p => p.id === selectedPost.id);
      if (!post || !post.originalPost) {
        message.error('Không tìm thấy bài viết.');
        return;
      }

      // Map form values back to API format
      const updateData = {
        ...post.originalPost,
        title: values.title,
        description: values.content,
        status: values.status === 'pending' ? 'Pending' : 
                values.status === 'approved' ? 'Approved' : 'Rejected',
      };

      await postService.updatePost(selectedPost.id, updateData);
      
      // Update local state
      setPosts(posts.map(p => 
        p.id === selectedPost.id 
          ? { ...p, ...values, originalPost: { ...p.originalPost, ...updateData } } 
          : p
      ));
      message.success('Bài viết đã được cập nhật.');
      setIsEditModalVisible(false);
      setSelectedPost(null);
      // Refresh data
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      message.error('Không thể cập nhật bài viết. Vui lòng thử lại.');
    }
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

  const handlePayment = (post) => {
    try {
      // Get the first package subscription that has a payment with checkout URL
      const checkoutUrl = post.originalPost?.postPackageSubs?.find(
        sub => sub.payment?.checkoutUrl
      )?.payment?.checkoutUrl;
      
      if (!checkoutUrl) {
        message.error('Không tìm thấy link thanh toán cho bài viết này.');
        return;
      }

      paymentService.processPayment(checkoutUrl);
    } catch (error) {
      console.error('Error processing payment:', error);
      message.error('Không thể mở trang thanh toán. Vui lòng thử lại.');
    }
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
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleApproveClick(record.id)}>Duyệt</Button>
              <Button danger icon={<StopOutlined />} onClick={() => handleReject(record.id)}>Từ chối</Button>
            </>
          )}
            {record.status === 'approved' && record.originalPost?.postPackageSubs?.some(sub => sub.payment?.checkoutUrl) && (
              <Button type="primary" icon={<DollarOutlined />} onClick={() => handlePayment(record)}>
                Thanh toán
            </Button>
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
      <Spin spinning={loading}>
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
      </Spin>

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

      {/* Approve Post Modal with Package Selection */}
      <Modal
        title="Duyệt bài viết"
        open={isApproveModalVisible}
        onCancel={() => {
          setIsApproveModalVisible(false);
          approveForm.resetFields();
        }}
        onOk={() => approveForm.submit()}
        okText="Duyệt"
        cancelText="Hủy"
        width={600}
      >
        <Form form={approveForm} layout="vertical" onFinish={handleApprove}>
          <Form.Item
            name="packageId"
            label="Chọn gói đăng tin (tùy chọn)"
            help="Nếu chọn gói, hệ thống sẽ tự động tạo link thanh toán PayOS cho user"
          >
            <Select
              placeholder="Chọn gói hoặc để trống (duyệt không gói)"
              allowClear
              loading={loadingPackages}
            >
              {packages.map((pkg) => (
                <Select.Option key={pkg.packageId || pkg.id} value={pkg.packageId || pkg.id}>
                  {pkg.packageName || pkg.name} - {pkg.price?.toLocaleString('vi-VN')} đ
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {selectedPost && (
            <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
              <strong>Bài viết:</strong> {selectedPost.title}
              <br />
              <strong>Người đăng:</strong> {selectedPost.author}
            </div>
          )}
        </Form>
      </Modal>

      {/* Checkout URL Modal */}
      <Modal
        title="Link thanh toán đã được tạo"
        open={isCheckoutModalVisible}
        onCancel={() => {
          setIsCheckoutModalVisible(false);
          setCheckoutInfo(null);
        }}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={handleCopyCheckoutUrl}>
            Sao chép link
          </Button>,
          <Button key="open" type="primary" icon={<LinkOutlined />} onClick={handleOpenCheckout}>
            Mở link thanh toán
          </Button>,
          <Button key="close" onClick={() => {
            setIsCheckoutModalVisible(false);
            setCheckoutInfo(null);
          }}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {checkoutInfo && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Gói đăng tin">
                  {checkoutInfo.package?.name || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Giá">
                  {checkoutInfo.package?.price?.toLocaleString('vi-VN')} đ
                </Descriptions.Item>
                <Descriptions.Item label="Mã đơn hàng">
                  {checkoutInfo.orderCode}
                </Descriptions.Item>
                <Descriptions.Item label="Nội dung chuyển khoản">
                  {checkoutInfo.transferContent}
                </Descriptions.Item>
              </Descriptions>
            </Card>
            <Divider />
            <div style={{ marginBottom: 16 }}>
              <strong>Link thanh toán:</strong>
              <Input
                value={checkoutInfo.checkoutUrl}
                readOnly
                style={{ marginTop: 8 }}
                suffix={
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={handleCopyCheckoutUrl}
                  />
                }
              />
            </div>
            <div style={{ padding: 12, background: '#e6f7ff', borderRadius: 4, marginTop: 16 }}>
              <strong>Lưu ý:</strong> Gửi link này cho user để họ thanh toán. Sau khi thanh toán thành công, bài viết sẽ tự động được kích hoạt.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PostManagement;
