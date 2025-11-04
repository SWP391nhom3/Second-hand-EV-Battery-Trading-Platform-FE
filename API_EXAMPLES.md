# Ví dụ tích hợp API vào Components

## 1. LoginForm với authService

```jsx
// src/components/auth/LoginForm/LoginForm.jsx
import React, { useState } from "react";
import { Button, Form, Input, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../../services"; // ✨ Use authService
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values) => {
    setErrorMessage("");
    setLoading(true);

    try {
      // ✨ Sử dụng authService thay vì gọi api trực tiếp
      const response = await authService.login({
        email: values.email,
        password: values.password,
      });

      toast.success("Đăng nhập thành công! 🎉");

      // Token và user đã được authService tự động lưu vào localStorage
      const user = authService.getCurrentUser();

      // Điều hướng theo role
      const role = user?.role?.toLowerCase() || "customer";
      switch (role) {
        case "admin":
          navigate("/admin");
          break;
        case "staff":
          navigate("/staff");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          closable
          onClose={() => setErrorMessage("")}
        />
      )}

      <Form form={form} onFinish={handleSubmit} layout="vertical" size="large">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="your@email.com" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className={styles.submitButton}
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <div className={styles.formFooter}>
          <span>Bạn là thành viên mới? </span>
          <Link to="/register">Đăng ký ngay</Link>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
```

## 2. ProductsPage với postService

```jsx
// src/pages/products/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import { Spin, Alert, Pagination, Select } from "antd";
import { postService } from "../../services";
import { POST_STATUS, POST_TYPE } from "../../constants/apiConstants";
import ProductCard from "../../components/products/ProductCard/ProductCard";
import styles from "./Products.module.css";

const ProductsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });
  const [filters, setFilters] = useState({
    postType: null,
    status: POST_STATUS.ACTIVE,
  });

  // Fetch posts from API
  const fetchPosts = async (page = 1, pageSize = 12) => {
    setLoading(true);
    setError(null);

    try {
      const response = await postService.getPosts({
        page,
        pageSize,
        status: filters.status,
        postType: filters.postType,
      });

      setPosts(response.data || response.items || []);
      setPagination({
        current: page,
        pageSize,
        total: response.total || response.totalCount || 0,
      });
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.response?.data?.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Load posts on mount and when filters change
  useEffect(() => {
    fetchPosts(pagination.current, pagination.pageSize);
  }, [filters]);

  const handlePageChange = (page, pageSize) => {
    fetchPosts(page, pageSize);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset to page 1
  };

  if (loading && posts.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className={styles.productsPage}>
      <div className={styles.filtersBar}>
        <Select
          placeholder="Loại sản phẩm"
          allowClear
          style={{ width: 200 }}
          onChange={(value) => handleFilterChange("postType", value)}
          options={[
            { label: "Pin", value: POST_TYPE.BATTERY },
            { label: "Xe", value: POST_TYPE.VEHICLE },
            { label: "Cả hai", value: POST_TYPE.BOTH },
          ]}
        />
      </div>

      <div className={styles.productsGrid}>
        {posts.map((post) => (
          <ProductCard key={post.postId} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className={styles.emptyState}>
          <p>Không có sản phẩm nào</p>
        </div>
      )}

      <Pagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={handlePageChange}
        showSizeChanger
        showTotal={(total) => `Tổng ${total} sản phẩm`}
        className={styles.pagination}
      />
    </div>
  );
};

export default ProductsPage;
```

## 3. CustomerDashboard với postService & memberService

```jsx
// src/components/customer/CustomerDashboard.jsx
import React, { useState, useEffect } from "react";
import { Tabs, Spin, Empty, Button } from "antd";
import { postService, memberService, authService } from "../../services";
import { POST_STATUS } from "../../constants/apiConstants";
import styles from "./CustomerDashboard.module.css";

const CustomerDashboard = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const currentUser = authService.getCurrentUser();
  const memberId = currentUser?.memberId;

  // Fetch user's posts
  const fetchMyPosts = async () => {
    if (!memberId) {
      console.error("Member ID not found");
      return;
    }

    setLoading(true);
    try {
      const posts = await postService.getPostsByMember(memberId);
      setMyPosts(posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [memberId]);

  // Filter posts by status
  const filterPostsByStatus = (status) => {
    if (status === "all") return myPosts;
    return myPosts.filter((post) => post.status === status);
  };

  const handleDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      toast.success("Xóa tin đăng thành công!");
      fetchMyPosts(); // Reload
    } catch (error) {
      toast.error("Không thể xóa tin đăng");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  const tabs = [
    {
      key: "all",
      label: `Tất cả (${myPosts.length})`,
      children: <PostList posts={myPosts} onDelete={handleDeletePost} />,
    },
    {
      key: POST_STATUS.ACTIVE,
      label: `Đang bán (${filterPostsByStatus(POST_STATUS.ACTIVE).length})`,
      children: (
        <PostList
          posts={filterPostsByStatus(POST_STATUS.ACTIVE)}
          onDelete={handleDeletePost}
        />
      ),
    },
    {
      key: POST_STATUS.PENDING,
      label: `Chờ duyệt (${filterPostsByStatus(POST_STATUS.PENDING).length})`,
      children: (
        <PostList
          posts={filterPostsByStatus(POST_STATUS.PENDING)}
          onDelete={handleDeletePost}
        />
      ),
    },
    {
      key: POST_STATUS.SOLD,
      label: `Đã bán (${filterPostsByStatus(POST_STATUS.SOLD).length})`,
      children: (
        <PostList
          posts={filterPostsByStatus(POST_STATUS.SOLD)}
          onDelete={handleDeletePost}
        />
      ),
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h2>Quản lý tin đăng</h2>
        <Button type="primary" onClick={() => navigate("/create-post")}>
          Đăng tin mới
        </Button>
      </div>

      <Tabs items={tabs} activeKey={activeTab} onChange={setActiveTab} />
    </div>
  );
};

// PostList component
const PostList = ({ posts, onDelete }) => {
  if (posts.length === 0) {
    return <Empty description="Không có tin đăng nào" />;
  }

  return (
    <div className={styles.postsList}>
      {posts.map((post) => (
        <PostCard key={post.postId} post={post} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default CustomerDashboard;
```

## 4. CreatePostModal với postService & batteryService

```jsx
// src/components/customer/CreatePostModal/CreatePostModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, Button } from "antd";
import { postService, batteryService, authService } from "../../../services";
import { POST_TYPE, TRANSACTION_TYPE } from "../../../constants/apiConstants";
import { toast } from "react-toastify";

const CreatePostModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [batteries, setBatteries] = useState([]);
  const currentUser = authService.getCurrentUser();
  const memberId = currentUser?.memberId;

  // Fetch user's batteries
  useEffect(() => {
    const fetchBatteries = async () => {
      if (!memberId) return;
      try {
        const data = await batteryService.getBatteriesByMember(memberId);
        setBatteries(data || []);
      } catch (error) {
        console.error("Error fetching batteries:", error);
      }
    };
    fetchBatteries();
  }, [memberId]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const postData = {
        memberId,
        title: values.title,
        description: values.description,
        price: values.price,
        postType: values.postType,
        transactionType: values.transactionType,
        batteryId: values.batteryId,
        vehicleId: values.vehicleId,
      };

      await postService.createPost(postData);
      toast.success("Tạo tin đăng thành công!");
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.message || "Không thể tạo tin đăng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo tin đăng mới"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder="VD: Pin xe máy điện 48V 20Ah" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={4} placeholder="Mô tả chi tiết sản phẩm..." />
        </Form.Item>

        <Form.Item
          label="Giá (VNĐ)"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item
          label="Loại tin đăng"
          name="postType"
          rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
        >
          <Select
            options={[
              { label: "Pin", value: POST_TYPE.BATTERY },
              { label: "Xe điện", value: POST_TYPE.VEHICLE },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Hình thức giao dịch"
          name="transactionType"
          initialValue={TRANSACTION_TYPE.DIRECT}
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Trực tiếp", value: TRANSACTION_TYPE.DIRECT },
              {
                label: "Hỗ trợ bởi nhân viên",
                value: TRANSACTION_TYPE.STAFF_ASSISTED,
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.postType !== currentValues.postType
          }
        >
          {({ getFieldValue }) =>
            getFieldValue("postType") === POST_TYPE.BATTERY ? (
              <Form.Item label="Chọn pin" name="batteryId">
                <Select
                  placeholder="Chọn pin từ kho của bạn"
                  options={batteries.map((b) => ({
                    label: `${b.brand} - ${b.capacityKWh}kWh`,
                    value: b.batteryId,
                  }))}
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo tin đăng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePostModal;
```

## 5. PackagesPage với packageService

```jsx
// src/pages/packages/PackagesPage.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Spin, Badge } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { packageService, authService } from "../../services";
import { toast } from "react-toastify";
import styles from "./PackagesPage.module.css";

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await packageService.getActivePackages();
      setPackages(data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Không thể tải gói dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (packageId) => {
    if (!authService.isAuthenticated()) {
      toast.warning("Vui lòng đăng nhập để mua gói!");
      return;
    }

    try {
      await packageService.subscribeToPackage(packageId, {
        memberId: currentUser.memberId,
        postId: null, // Will select post later
      });
      toast.success("Đăng ký gói thành công!");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Không thể đăng ký gói");
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className={styles.packagesPage}>
      <h1>Gói đăng tin</h1>
      <p>Chọn gói phù hợp để tin đăng của bạn được nhiều người xem hơn</p>

      <Row gutter={[24, 24]}>
        {packages.map((pkg) => (
          <Col xs={24} sm={12} lg={8} key={pkg.packageId}>
            <Card className={styles.packageCard} hoverable>
              {pkg.priorityLevel > 5 && (
                <Badge.Ribbon text="Phổ biến" color="red" />
              )}

              <div className={styles.packageHeader}>
                <h2>{pkg.name}</h2>
                <div className={styles.price}>
                  <span className={styles.amount}>
                    {pkg.price.toLocaleString()}đ
                  </span>
                  <span className={styles.duration}>
                    /{pkg.durationDay} ngày
                  </span>
                </div>
              </div>

              <div className={styles.packageBody}>
                <p>{pkg.description}</p>
                <ul className={styles.features}>
                  <li>
                    <CheckOutlined /> Hiển thị {pkg.durationDay} ngày
                  </li>
                  <li>
                    <CheckOutlined /> Độ ưu tiên: {pkg.priorityLevel}/10
                  </li>
                </ul>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={() => handleSubscribe(pkg.packageId)}
              >
                Chọn gói
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PackagesPage;
```

## 6. ProtectedRoute Component

```jsx
// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services";

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

// Usage in App.jsx:
// <Route
//   path="/customer"
//   element={
//     <ProtectedRoute>
//       <CustomerPage />
//     </ProtectedRoute>
//   }
// />
//
// <Route
//   path="/admin"
//   element={
//     <ProtectedRoute requiredRole="Admin">
//       <AdminPage />
//     </ProtectedRoute>
//   }
// />
```

## 7. StaffDashboard với postRequestService

```jsx
// src/components/staff/StaffDashboard.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Space, Modal } from "antd";
import { postRequestService, paymentService } from "../../services";
import {
  POST_REQUEST_STATUS,
  PAYMENT_STATUS,
} from "../../constants/apiConstants";
import { toast } from "react-toastify";

const StaffDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const data = await postRequestService.getRequestsByStatus(
        POST_REQUEST_STATUS.PENDING
      );
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await postRequestService.acceptRequest(requestId);
      toast.success("Đã chấp nhận yêu cầu!");
      fetchPendingRequests();
    } catch (error) {
      toast.error("Không thể chấp nhận yêu cầu");
    }
  };

  const handleReject = async (requestId) => {
    Modal.confirm({
      title: "Xác nhận từ chối",
      content: "Bạn có chắc muốn từ chối yêu cầu này?",
      onOk: async () => {
        try {
          await postRequestService.rejectRequest(requestId);
          toast.success("Đã từ chối yêu cầu!");
          fetchPendingRequests();
        } catch (error) {
          toast.error("Không thể từ chối yêu cầu");
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Buyer",
      dataIndex: ["buyer", "fullName"],
      key: "buyer",
    },
    {
      title: "Post",
      dataIndex: ["post", "title"],
      key: "post",
    },
    {
      title: "Offer Price",
      dataIndex: "offerPrice",
      key: "offerPrice",
      render: (price) => `${price.toLocaleString()}đ`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === POST_REQUEST_STATUS.PENDING ? "orange" : "green"}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleAccept(record.id)}
          >
            Accept
          </Button>
          <Button danger size="small" onClick={() => handleReject(record.id)}>
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Yêu cầu chờ xử lý</h2>
      <Table
        columns={columns}
        dataSource={requests}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default StaffDashboard;
```

---

## Tóm tắt

### Services đã tạo:

- ✅ `authService` - Authentication
- ✅ `postService` - Posts management
- ✅ `batteryService` - Battery operations
- ✅ `packageService` - Packages subscription
- ✅ `postRequestService` - Request management
- ✅ `paymentService` - Payment processing

### Patterns sử dụng:

1. **Import services**: `import { authService } from '@/services'`
2. **Try-catch**: Bọc tất cả API calls
3. **Loading states**: `useState` cho loading
4. **Error handling**: Toast hoặc Alert
5. **Auto token**: Axios interceptor tự động thêm token

### Next Steps:

1. Copy code ví dụ vào components
2. Test với backend API
3. Adjust theo response structure thực tế
4. Add more error handling nếu cần
