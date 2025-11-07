import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  Statistic,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Space,
  Avatar,
  Tabs,
  Empty,
  message,
  Modal,
  Descriptions,
  Badge,
  Tooltip,
  Dropdown,
} from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  ThunderboltOutlined,
  CarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import postService from "../../services/postService";
import batteryService from "../../services/batteryService";
import vehicleService from "../../services/vehicleService";
import paymentService from "../../services/paymentService";
import { getUser } from "../../utils/sessionStorage";
import CreatePostModal from "./CreatePostModal";
import styles from "./NewCustomerDashboard.module.css";

const { Content, Sider } = Layout;
const { TabPane } = Tabs;

const NewCustomerDashboard = () => {
  const navigate = useNavigate();
  const currentUser = getUser();
  const memberId = currentUser?.memberId || currentUser?.member?.memberId;

  // States
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);

  // Data states
  const [posts, setPosts] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [statistics, setStatistics] = useState({
    totalPosts: 0,
    activePosts: 0,
    totalBatteries: 0,
    totalVehicles: 0,
  });

  useEffect(() => {
    if (!memberId) {
      console.warn('⚠️ No memberId found, cannot load posts');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      console.log('🚀 Loading customer dashboard data for member:', memberId);
      
      try {
        // Load batteries and vehicles in parallel
        const [batteryRes, vehicleRes] = await Promise.all([
          batteryService
            .getBatteriesByMember(memberId)
            .catch(() => ({ data: [] })),
          vehicleService
            .getVehiclesByMember(memberId)
            .catch(() => ({ data: [] })),
        ]);

        // Load posts separately with fallback logic
        let postsData = [];
        try {
          const postRes = await postService.getPostsByMember(memberId);
          postsData = Array.isArray(postRes) ? postRes : postRes.data || [];
          console.log(`📦 Loaded ${postsData.length} posts from getPostsByMember`);
        } catch (postError) {
          console.warn('⚠️ getPostsByMember failed, using admin endpoint fallback:', postError);
          try {
            const allPosts = await postService.getAdminAllPosts();
            const allPostsData = Array.isArray(allPosts) ? allPosts : allPosts.data || [];
            postsData = allPostsData.filter(post => post.memberId === memberId);
            console.log(`📦 Filtered ${postsData.length} posts for member ${memberId} from admin endpoint`);
          } catch (adminError) {
            console.error('❌ Both endpoints failed:', adminError);
            postsData = [];
          }
        }

        setPosts(postsData);
        setBatteries(batteryRes.data || []);
        setVehicles(vehicleRes.data || []);

        const activePosts = postsData.filter((p) =>
          ["active", "approved"].includes((p.status || "").toLowerCase())
        );

        setStatistics({
          totalPosts: postsData.length,
          activePosts: activePosts.length,
          totalBatteries: batteryRes.data?.length || 0,
          totalVehicles: vehicleRes.data?.length || 0,
        });

        console.log(
          "✅ Dashboard loaded – Posts:",
          postsData.length,
          "| Active:",
          activePosts.length,
          "| Batteries:",
          batteryRes.data?.length,
          "| Vehicles:",
          vehicleRes.data?.length
        );
      } catch (err) {
        console.error("❌ Error loading dashboard:", err);
        setPosts([]);
        setBatteries([]);
        setVehicles([]);
        setStatistics({
          totalPosts: 0,
          activePosts: 0,
          totalBatteries: 0,
          totalVehicles: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [memberId]);
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchPosts(), fetchBatteries(), fetchVehicles()]);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      console.log('🔄 Fetching posts for member:', memberId);
      
      // TODO: Use getPostsByMember when backend fixes the endpoint
      // Currently using getAdminAllPosts as workaround and filtering by memberId
      let response;
      let postsData = [];
      
      try {
        // Try member-specific endpoint first
        response = await postService.getPostsByMember(memberId);
        postsData = Array.isArray(response) ? response : response.data || [];
        console.log(`📦 getPostsByMember returned ${postsData.length} posts`);
      } catch (memberError) {
        console.warn('⚠️ getPostsByMember failed, trying admin endpoint:', memberError);
        
        // Fallback to admin endpoint and filter
        const allPosts = await postService.getAdminAllPosts();
        postsData = Array.isArray(allPosts) ? allPosts : allPosts.data || [];
        
        // Filter by memberId
        postsData = postsData.filter(post => post.memberId === memberId);
        console.log(`📦 Filtered from admin endpoint: ${postsData.length} posts for member ${memberId}`);
      }
      
      console.log('📊 Posts data:', postsData);
      setPosts(postsData);

      // Map status to check for approved/active posts (case insensitive)
      const activePosts = postsData.filter((p) => {
        const status = (p.status || "").toLowerCase();
        const isActive = status === "active" || status === "approved";
        if (!isActive) {
          console.log(`⏭️ Post ${p.postId} not active - status: ${p.status}`);
        }
        return isActive;
      });
      
      console.log(`✅ Active/Approved posts: ${activePosts.length}`);
      
      setStatistics((prev) => ({
        ...prev,
        totalPosts: postsData.length,
        activePosts: activePosts.length,
      }));
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
      setPosts([]);
      setStatistics((prev) => ({
        ...prev,
        totalPosts: 0,
        activePosts: 0,
      }));
    }
  };

  // Helper: try to find checkoutUrl in multiple possible response shapes
  const findCheckoutUrl = (post) => {
    if (!post) return null;

    // Common shapes
    const subs =
      post.postPackageSubs ||
      post.postPackageSub ||
      post.post_package_subs ||
      post.postPackageSubscriptions;
    if (Array.isArray(subs)) {
      for (const s of subs) {
        if (s?.payment?.checkoutUrl) return s.payment.checkoutUrl;
        if (s?.checkoutUrl) return s.checkoutUrl;
        if (s?.paymentUrl) return s.paymentUrl;
        if (s?.package?.payment?.checkoutUrl)
          return s.package.payment.checkoutUrl;
      }
    }

    // Single object
    const single =
      post.postPackageSub || post.packageSub || post.postPackageSubs?.[0];
    if (single) {
      if (single?.payment?.checkoutUrl) return single.payment.checkoutUrl;
      if (single?.checkoutUrl) return single.checkoutUrl;
      if (single?.paymentUrl) return single.paymentUrl;
    }

    // fallback: deep search for any key containing 'checkout' or 'checkoutUrl'
    try {
      const seen = new WeakSet();
      const deepFind = (obj) => {
        if (!obj || typeof obj !== "object") return null;
        if (seen.has(obj)) return null;
        seen.add(obj);
        for (const key of Object.keys(obj)) {
          const val = obj[key];
          if (
            typeof key === "string" &&
            key.toLowerCase().includes("checkout") &&
            typeof val === "string" &&
            val.startsWith("http")
          )
            return val;
          if (
            typeof val === "string" &&
            /https?:\/\//.test(val) &&
            key.toLowerCase().includes("url")
          )
            return val;
          if (typeof val === "object") {
            const found = deepFind(val);
            if (found) return found;
          }
        }
        return null;
      };
      const found = deepFind(post);
      if (found) return found;
    } catch (e) {}

    return null;
  };

  const fetchBatteries = async () => {
    try {
      const response = await batteryService.getBatteriesByMember(memberId);
      const batteriesData = Array.isArray(response)
        ? response
        : response.data || [];
      setBatteries(batteriesData);
      setStatistics((prev) => ({
        ...prev,
        totalBatteries: batteriesData.length,
      }));
    } catch (error) {
      console.error("Error fetching batteries:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await vehicleService.getVehiclesByMember(memberId);
      const vehiclesData = Array.isArray(response)
        ? response
        : response.data || [];
      setVehicles(vehiclesData);
      setStatistics((prev) => ({
        ...prev,
        totalVehicles: vehiclesData.length,
      }));
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bài đăng này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await postService.deletePost(postId);
          message.success("Xóa bài đăng thành công!");
          fetchPosts();
        } catch (error) {
          message.error("Không thể xóa bài đăng!");
        }
      },
    });
  };

  const handleViewDetail = (item, type) => {
    setSelectedItem({ ...item, type });
    setDetailModalVisible(true);
  };

  // Menu items
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Tổng quan",
    },
    {
      key: "posts",
      icon: <FileTextOutlined />,
      label: "Bài đăng của tôi",
    },
    {
      key: "batteries",
      icon: <ThunderboltOutlined />,
      label: "Pin của tôi",
    },
    {
      key: "vehicles",
      icon: <CarOutlined />,
      label: "Xe của tôi",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin tài khoản",
    },
  ];

  // Posts table columns
  const postsColumns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Loại",
      dataIndex: "postType",
      key: "postType",
      render: (type) => (
        <Tag color={type === "Direct" ? "blue" : "green"}>
          {type === "Direct" ? "Trực tiếp" : "Qua nhân viên"}
        </Tag>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
          {price?.toLocaleString("vi-VN")} đ
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        // Normalize status to handle case variations
        const normalizedStatus = (status || "").toLowerCase();
        const statusConfig = {
          pending: {
            color: "warning",
            icon: <ClockCircleOutlined />,
            text: "Chờ duyệt",
          },
          approved: {
            color: "success",
            icon: <CheckCircleOutlined />,
            text: "Đã duyệt",
          },
          active: {
            color: "processing",
            icon: <CheckCircleOutlined />,
            text: "Đang hoạt động",
          },
          rejected: {
            color: "error",
            icon: <CloseCircleOutlined />,
            text: "Đã từ chối",
          },
          inactive: {
            color: "default",
            icon: <CloseCircleOutlined />,
            text: "Không hoạt động",
          },
        };
        const config = statusConfig[normalizedStatus] || statusConfig.pending;
        const checkoutUrl = findCheckoutUrl(record);
        return (
          <span>
            <Tag icon={config.icon} color={config.color}>
              {config.text}
            </Tag>
            {checkoutUrl && (
              <Tag color="blue" style={{ marginLeft: 8 }}>
                Có link thanh toán
              </Tag>
            )}
          </span>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record, "post")}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeletePost(record.postId)}
            />
          </Tooltip>
          {/* Thanh toán: chỉ hiện khi bài đã duyệt và có checkoutUrl */}
          {(record.status || "").toLowerCase() === "approved" &&
            findCheckoutUrl(record) && (
              <Tooltip title="Thanh toán">
                <Button
                  type="text"
                  icon={<DollarOutlined />}
                  onClick={() => {
                    const checkoutUrl = findCheckoutUrl(record);
                    if (checkoutUrl) {
                      try {
                        paymentService.processPayment(checkoutUrl);
                      } catch (err) {
                        console.error("Error opening checkout URL:", err);
                        message.error(
                          "Không thể mở trang thanh toán. Vui lòng thử lại."
                        );
                      }
                    } else {
                      message.error(
                        "Không tìm thấy link thanh toán cho bài viết này."
                      );
                    }
                  }}
                />
              </Tooltip>
            )}
        </Space>
      ),
    },
  ];

  // Batteries table columns
  const batteriesColumns = [
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Dung lượng",
      dataIndex: "capacityKWh",
      key: "capacityKWh",
      render: (capacity) => `${capacity} kWh`,
    },
    {
      title: "Số chu kỳ",
      dataIndex: "cycleCount",
      key: "cycleCount",
      render: (count) => count?.toLocaleString("vi-VN"),
    },
    {
      title: "Tình trạng",
      dataIndex: "condition",
      key: "condition",
      render: (condition) => {
        const colors = {
          New: "green",
          Excellent: "blue",
          Good: "cyan",
          Fair: "orange",
          Used: "default",
        };
        return <Tag color={colors[condition] || "default"}>{condition}</Tag>;
      },
    },
    {
      title: "Năm SX",
      dataIndex: "manufactureYear",
      key: "manufactureYear",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record, "battery")}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Vehicles table columns
  const vehiclesColumns = [
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Dung lượng pin",
      dataIndex: "batteryCapacity",
      key: "batteryCapacity",
      render: (capacity) => `${capacity} kWh`,
    },
    {
      title: "Số km đã đi",
      dataIndex: "mileageKm",
      key: "mileageKm",
      render: (mileage) => `${mileage?.toLocaleString("vi-VN")} km`,
    },
    {
      title: "Tình trạng",
      dataIndex: "condition",
      key: "condition",
      render: (condition) => <Tag color="blue">{condition}</Tag>,
    },
    {
      title: "Năm SX",
      dataIndex: "manufactureYear",
      key: "manufactureYear",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record, "vehicle")}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Render Dashboard Overview
  const renderDashboard = () => (
    <div className={styles.dashboard}>
      <div className={styles.welcomeSection}>
        <Card className={styles.welcomeCard}>
          <div className={styles.welcomeContent}>
            <Avatar
              size={80}
              icon={<UserOutlined />}
              className={styles.avatar}
            />
            <div className={styles.welcomeText}>
              <h2>
                Xin chào, {currentUser?.member?.fullName || currentUser?.email}!
              </h2>
              <p>Chào mừng bạn đến với bảng điều khiển của mình</p>
            </div>
          </div>
        </Card>
      </div>

      <Row gutter={[24, 24]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Tổng bài đăng"
              value={statistics.totalPosts}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Bài đang hoạt động"
              value={statistics.activePosts}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Tổng Pin"
              value={statistics.totalBatteries}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Tổng Xe"
              value={statistics.totalVehicles}
              prefix={<CarOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title="Bài đăng gần đây"
            extra={
              <Button type="link" onClick={() => setSelectedMenu("posts")}>
                Xem tất cả
              </Button>
            }
          >
            {posts.length > 0 ? (
              <Table
                dataSource={posts.slice(0, 5)}
                columns={postsColumns.slice(0, 4)}
                pagination={false}
                size="small"
                rowKey="postId"
              />
            ) : (
              <Empty description="Chưa có bài đăng nào" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Thống kê nhanh">
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <div className={styles.quickStat}>
                <ThunderboltOutlined
                  style={{ fontSize: 24, color: "#faad14" }}
                />
                <div>
                  <div className={styles.quickStatLabel}>Pin đang bán</div>
                  <div className={styles.quickStatValue}>
                    {batteries.length} pin
                  </div>
                </div>
              </div>
              <div className={styles.quickStat}>
                <CarOutlined style={{ fontSize: 24, color: "#722ed1" }} />
                <div>
                  <div className={styles.quickStatLabel}>Xe đang bán</div>
                  <div className={styles.quickStatValue}>
                    {vehicles.length} xe
                  </div>
                </div>
              </div>
              <div className={styles.quickStat}>
                <DollarOutlined style={{ fontSize: 24, color: "#52c41a" }} />
                <div>
                  <div className={styles.quickStatLabel}>
                    Giá trị trung bình
                  </div>
                  <div className={styles.quickStatValue}>
                    {posts.length > 0
                      ? (
                          posts.reduce((sum, p) => sum + (p.price || 0), 0) /
                          posts.length
                        ).toLocaleString("vi-VN")
                      : 0}{" "}
                    đ
                  </div>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );

  // Render Posts Management
  const renderPosts = () => (
    <Card
      title="Quản lý bài đăng"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          Tạo bài đăng mới
        </Button>
      }
    >
      <Table
        dataSource={posts}
        columns={postsColumns}
        loading={loading}
        rowKey="postId"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );

  // Render Batteries Management
  const renderBatteries = () => (
    <Card title="Quản lý Pin">
      <Table
        dataSource={batteries}
        columns={batteriesColumns}
        loading={loading}
        rowKey="batteryId"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );

  // Render Vehicles Management
  const renderVehicles = () => (
    <Card title="Quản lý Xe">
      <Table
        dataSource={vehicles}
        columns={vehiclesColumns}
        loading={loading}
        rowKey="vehicleId"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );

  // Render Profile
  const renderProfile = () => (
    <Card title="Thông tin tài khoản">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Họ tên">
          {currentUser?.member?.fullName || "Chưa cập nhật"}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {currentUser?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {currentUser?.phone || "Chưa cập nhật"}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {currentUser?.member?.address || "Chưa cập nhật"}
        </Descriptions.Item>
        <Descriptions.Item label="Vai trò">
          <Tag color="blue">{currentUser?.role}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Badge status="success" text="Đang hoạt động" />
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return renderDashboard();
      case "posts":
        return renderPosts();
      case "batteries":
        return renderBatteries();
      case "vehicles":
        return renderVehicles();
      case "profile":
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout className={styles.layout}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        className={styles.sider}
        width={250}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onClick={({ key }) => setSelectedMenu(key)}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        <Content className={styles.content}>
          <div className={styles.contentWrapper}>{renderContent()}</div>
        </Content>
      </Layout>

      {/* Create Post Modal */}
      <CreatePostModal
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          fetchAllData();
        }}
      />

      {/* Detail Modal */}
      <Modal
        title="Chi tiết"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setShowRawJson(false);
        }}
        footer={[
          <Button key="json" onClick={() => setShowRawJson((prev) => !prev)}>
            {showRawJson ? "Ẩn JSON" : "Xem JSON"}
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setDetailModalVisible(false);
              setShowRawJson(false);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedItem && (
          <>
            <Descriptions bordered column={1}>
              {selectedItem.type === "post" && (
                <>
                  <Descriptions.Item label="Tiêu đề">
                    {selectedItem.title}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giá">
                    {selectedItem.price?.toLocaleString("vi-VN")} đ
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả">
                    {selectedItem.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa điểm">
                    {selectedItem.location}
                  </Descriptions.Item>
                  <Descriptions.Item label="Loại giao dịch">
                    {selectedItem.transactionType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Tag>{selectedItem.status}</Tag>
                  </Descriptions.Item>
                </>
              )}
              {selectedItem.type === "battery" && (
                <>
                  <Descriptions.Item label="Thương hiệu">
                    {selectedItem.brand}
                  </Descriptions.Item>
                  <Descriptions.Item label="Dung lượng">
                    {selectedItem.capacityKWh} kWh
                  </Descriptions.Item>
                  <Descriptions.Item label="Số chu kỳ">
                    {selectedItem.cycleCount}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tình trạng">
                    {selectedItem.condition}
                  </Descriptions.Item>
                  <Descriptions.Item label="Năm sản xuất">
                    {selectedItem.manufactureYear}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả">
                    {selectedItem.description}
                  </Descriptions.Item>
                </>
              )}
              {selectedItem.type === "vehicle" && (
                <>
                  <Descriptions.Item label="Thương hiệu">
                    {selectedItem.brand}
                  </Descriptions.Item>
                  <Descriptions.Item label="Model">
                    {selectedItem.model}
                  </Descriptions.Item>
                  <Descriptions.Item label="Dung lượng pin">
                    {selectedItem.batteryCapacity} kWh
                  </Descriptions.Item>
                  <Descriptions.Item label="Số km đã đi">
                    {selectedItem.mileageKm?.toLocaleString("vi-VN")} km
                  </Descriptions.Item>
                  <Descriptions.Item label="Tình trạng">
                    {selectedItem.condition}
                  </Descriptions.Item>
                  <Descriptions.Item label="Năm sản xuất">
                    {selectedItem.manufactureYear}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mô tả">
                    {selectedItem.description}
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>
            {showRawJson && (
              <div style={{ marginTop: 16 }}>
                <h4>Raw JSON</h4>
                <pre
                  style={{
                    maxHeight: 300,
                    overflow: "auto",
                    background: "#f7f7f7",
                    padding: 12,
                  }}
                >
                  {JSON.stringify(selectedItem, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </Modal>
    </Layout>
  );
};

export default NewCustomerDashboard;
