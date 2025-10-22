import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Space,
  Statistic,
  Badge,
  Avatar,
  Progress,
  List,
  Typography,
  Divider,
  Empty,
  Tooltip,
  Timeline,
  Rate,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  HeartOutlined,
  EyeOutlined,
  TrophyOutlined,
  RocketOutlined,
  BellOutlined,
  StarOutlined,
  FireOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  LineChartOutlined,
  TeamOutlined,
  GiftOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  MessageOutlined,
  LikeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import CreatePostModal from "./CreatePostModal";
import styles from "./CustomerDashboard.module.css";

const { Title, Text, Paragraph } = Typography;

const CustomerDashboard = () => {
  const [_activeCard, setActiveCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock data - có thể lấy từ API
  const customerData = {
    profile: {
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      avatar: null,
      memberSince: "2024-01-15",
      tier: "gold",
      points: 2450,
    },
    stats: {
      totalPosts: 24,
      activePosts: 12,
      totalViews: 15420,
      totalLikes: 892,
      completedDeals: 8,
      rating: 4.8,
      responseRate: 95,
      responseTime: "2 giờ",
    },
    currentPackage: {
      name: "Gói Vàng",
      postsRemaining: 18,
      totalPosts: 30,
      expiryDate: "2025-02-15",
      daysLeft: 23,
    },
    recentActivities: [
      {
        id: 1,
        type: "post",
        title: "Pin Tesla Model 3 - 75kWh",
        action: "Đăng tin mới",
        time: "2 giờ trước",
        status: "success",
      },
      {
        id: 2,
        type: "view",
        title: "Pin LG Chem 60kWh",
        action: "Có 45 lượt xem mới",
        time: "5 giờ trước",
        status: "info",
      },
      {
        id: 3,
        type: "message",
        title: "Khách hàng quan tâm",
        action: "3 tin nhắn mới",
        time: "1 ngày trước",
        status: "warning",
      },
      {
        id: 4,
        type: "deal",
        title: "Pin BYD Blade 80kWh",
        action: "Giao dịch thành công",
        time: "3 ngày trước",
        status: "success",
      },
    ],
    topPosts: [
      {
        id: 1,
        title: "Pin Tesla Model 3 - 75kWh",
        views: 1234,
        likes: 89,
        status: "active",
        price: "125.000.000",
      },
      {
        id: 2,
        title: "Pin LG Chem - 60kWh",
        views: 890,
        likes: 67,
        status: "active",
        price: "95.000.000",
      },
      {
        id: 3,
        title: "Pin BYD Blade - 80kWh",
        views: 756,
        likes: 54,
        status: "sold",
        price: "110.000.000",
      },
    ],
    achievements: [
      {
        id: 1,
        title: "Người bán uy tín",
        description: "Hoàn thành 10+ giao dịch",
        icon: <TrophyOutlined />,
        color: "#FFD700",
        earned: true,
      },
      {
        id: 2,
        title: "Phản hồi nhanh",
        description: "Tỷ lệ phản hồi >90%",
        icon: <ThunderboltOutlined />,
        color: "#1890ff",
        earned: true,
      },
      {
        id: 3,
        title: "Sao vàng",
        description: "Đánh giá 4.5+ sao",
        icon: <StarOutlined />,
        color: "#FF6B6B",
        earned: true,
      },
      {
        id: 4,
        title: "VIP Member",
        description: "Sử dụng gói cao cấp",
        icon: <CrownOutlined />,
        color: "#9B59B6",
        earned: false,
      },
    ],
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: "#CD7F32",
      silver: "#C0C0C0",
      gold: "#FFD700",
      diamond: "#B9F2FF",
    };
    return colors[tier] || "#1890ff";
  };

  const getTierLabel = (tier) => {
    const labels = {
      bronze: "Đồng",
      silver: "Bạc",
      gold: "Vàng",
      diamond: "Kim Cương",
    };
    return labels[tier] || "Thành viên";
  };

  return (
    <div className={styles.customerDashboard}>
      {/* Welcome Banner */}
      <Card className={styles.welcomeBanner}>
        <Row align="middle" gutter={24}>
          <Col xs={24} md={4}>
            <Avatar size={80} icon={<UserOutlined />} className={styles.avatar} />
          </Col>
          <Col xs={24} md={14}>
            <Space direction="vertical" size={4}>
              <Title level={3} style={{ margin: 0 }}>
                Xin chào, {customerData.profile.name}! 👋
              </Title>
              <Text type="secondary">
                Thành viên từ {new Date(customerData.profile.memberSince).toLocaleDateString('vi-VN')}
              </Text>
              <Space>
                <Tag color={getTierColor(customerData.profile.tier)} icon={<CrownOutlined />}>
                  Hạng {getTierLabel(customerData.profile.tier)}
                </Tag>
                <Tag icon={<StarOutlined />}>{customerData.stats.rating} ⭐</Tag>
                <Tag icon={<GiftOutlined />}>{customerData.profile.points} điểm</Tag>
              </Space>
            </Space>
          </Col>
          <Col xs={24} md={6} style={{ textAlign: 'right' }}>
            <Button type="primary" size="large" icon={<RocketOutlined />}>
              Nâng cấp hạng
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className={styles.statCard}
            onMouseEnter={() => setActiveCard('posts')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <Statistic
              title="Tổng tin đăng"
              value={customerData.stats.totalPosts}
              prefix={<ShoppingOutlined className={styles.iconPrimary} />}
              suffix={<Tag color="green">{customerData.stats.activePosts} đang hoạt động</Tag>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className={styles.statCard}
            onMouseEnter={() => setActiveCard('views')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <Statistic
              title="Lượt xem"
              value={customerData.stats.totalViews}
              prefix={<EyeOutlined className={styles.iconSuccess} />}
              suffix={<Text type="secondary">+234 hôm nay</Text>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className={styles.statCard}
            onMouseEnter={() => setActiveCard('likes')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <Statistic
              title="Lượt thích"
              value={customerData.stats.totalLikes}
              prefix={<HeartOutlined className={styles.iconDanger} />}
              suffix={<Text type="secondary">+45 tuần này</Text>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className={styles.statCard}
            onMouseEnter={() => setActiveCard('deals')}
            onMouseLeave={() => setActiveCard(null)}
          >
            <Statistic
              title="Giao dịch"
              value={customerData.stats.completedDeals}
              prefix={<CheckCircleOutlined className={styles.iconWarning} />}
              suffix={<Text type="secondary">thành công</Text>}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Left Column */}
        <Col xs={24} lg={16}>
          {/* Current Package Status */}
          <Card
            title={
              <Space>
                <RocketOutlined />
                <span>Gói hiện tại</span>
              </Space>
            }
            extra={<Tag color="gold">Đang hoạt động</Tag>}
            className={styles.packageCard}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Bài đăng còn lại"
                  value={customerData.currentPackage.postsRemaining}
                  suffix={`/ ${customerData.currentPackage.totalPosts}`}
                />
                <Progress
                  percent={(customerData.currentPackage.postsRemaining / customerData.currentPackage.totalPosts) * 100}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  status="active"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Thời gian còn lại"
                  value={customerData.currentPackage.daysLeft}
                  suffix="ngày"
                  prefix={<ClockCircleOutlined />}
                />
                <Text type="secondary">
                  Hết hạn: {new Date(customerData.currentPackage.expiryDate).toLocaleDateString('vi-VN')}
                </Text>
              </Col>
            </Row>
            <Divider />
            <Space>
              <Button type="primary" icon={<ThunderboltOutlined />}>
                Gia hạn gói
              </Button>
              <Button icon={<CrownOutlined />}>
                Nâng cấp gói
              </Button>
            </Space>
          </Card>

          {/* Top Posts */}
          <Card
            title={
              <Space>
                <FireOutlined />
                <span>Tin đăng nổi bật</span>
              </Space>
            }
            extra={<Button type="link">Xem tất cả →</Button>}
            className={styles.topPostsCard}
          >
            <List
              itemLayout="horizontal"
              dataSource={customerData.topPosts}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Space key="views">
                      <EyeOutlined />
                      {item.views}
                    </Space>,
                    <Space key="likes">
                      <HeartOutlined />
                      {item.likes}
                    </Space>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {item.title}
                        {item.status === 'sold' && <Tag color="red">Đã bán</Tag>}
                        {item.status === 'active' && <Tag color="green">Đang bán</Tag>}
                      </Space>
                    }
                    description={
                      <Text strong style={{ color: '#1890ff' }}>
                        {item.price}₫
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Recent Activities */}
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Hoạt động gần đây</span>
              </Space>
            }
            className={styles.activityCard}
          >
            <Timeline
              items={customerData.recentActivities.map((activity) => ({
                color: activity.status === 'success' ? 'green' : activity.status === 'warning' ? 'orange' : 'blue',
                children: (
                  <div>
                    <Text strong>{activity.title}</Text>
                    <br />
                    <Text type="secondary">{activity.action}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      <ClockCircleOutlined /> {activity.time}
                    </Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          {/* Performance Metrics */}
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <span>Hiệu suất</span>
              </Space>
            }
            className={styles.performanceCard}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Tỷ lệ phản hồi</Text>
                  <Text strong>{customerData.stats.responseRate}%</Text>
                </div>
                <Progress
                  percent={customerData.stats.responseRate}
                  strokeColor="#52c41a"
                  status="active"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Đánh giá</Text>
                  <Rate disabled defaultValue={customerData.stats.rating} allowHalf />
                </div>
                <Text type="secondary">
                  {customerData.stats.rating}/5.0 từ {customerData.stats.completedDeals * 3} đánh giá
                </Text>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>Thời gian phản hồi TB</Text>
                  <Text strong>{customerData.stats.responseTime}</Text>
                </div>
                <Tag color="green">Rất tốt</Tag>
              </div>

              <Divider />

              <div>
                <Text type="secondary">Để nâng cao hiệu suất:</Text>
                <List
                  size="small"
                  dataSource={[
                    'Trả lời tin nhắn trong 1 giờ',
                    'Cập nhật tin đăng thường xuyên',
                    'Hoàn thành giao dịch đúng hạn',
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>• {item}</Text>
                    </List.Item>
                  )}
                />
              </div>
            </Space>
          </Card>

          {/* Achievements */}
          <Card
            title={
              <Space>
                <TrophyOutlined />
                <span>Thành tích</span>
              </Space>
            }
            className={styles.achievementsCard}
          >
            <Row gutter={[12, 12]}>
              {customerData.achievements.map((achievement) => (
                <Col span={12} key={achievement.id}>
                  <Tooltip title={achievement.description}>
                    <Card
                      hoverable
                      className={`${styles.achievementBadge} ${
                        achievement.earned ? styles.earned : styles.locked
                      }`}
                      bodyStyle={{ padding: '16px', textAlign: 'center' }}
                    >
                      <div
                        style={{
                          fontSize: '32px',
                          color: achievement.earned ? achievement.color : '#d9d9d9',
                          marginBottom: 8,
                        }}
                      >
                        {achievement.icon}
                      </div>
                      <Text
                        strong
                        style={{
                          fontSize: '12px',
                          color: achievement.earned ? '#000' : '#999',
                        }}
                      >
                        {achievement.title}
                      </Text>
                    </Card>
                  </Tooltip>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Quick Actions */}
          <Card
            title={
              <Space>
                <ThunderboltOutlined />
                <span>Hành động nhanh</span>
              </Space>
            }
            className={styles.quickActionsCard}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                block 
                icon={<PlusOutlined />} 
                size="large"
                onClick={() => setModalVisible(true)}
              >
                Đăng tin mới
              </Button>
              <Button block icon={<MessageOutlined />} size="large">
                Tin nhắn (3 mới)
              </Button>
              <Button block icon={<BellOutlined />} size="large">
                Thông báo (5 mới)
              </Button>
              <Button block icon={<SafetyOutlined />} size="large">
                Cài đặt tài khoản
              </Button>
            </Space>
          </Card>

          {/* Tips Card */}
          <Card
            className={styles.tipsCard}
            bodyStyle={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <Space direction="vertical">
              <Text strong style={{ color: 'white', fontSize: '16px' }}>
                💡 Mẹo bán hàng
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                Tin đăng có ảnh chất lượng cao được xem nhiều hơn 3 lần!
              </Text>
              <Button type="default" size="small">
                Tìm hiểu thêm
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Create Post Modal */}
      <CreatePostModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false);
          // Có thể reload data hoặc show notification
        }}
      />
    </div>
  );
};

export default CustomerDashboard;
