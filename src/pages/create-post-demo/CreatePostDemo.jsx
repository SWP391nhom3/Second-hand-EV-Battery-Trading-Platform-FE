import React, { useState } from "react";
import { Button, Space, Card } from "antd";
import { PlusOutlined, FileTextOutlined } from "@ant-design/icons";
import { Header, Footer } from "../../components/layout";
import CreatePostModal from "../../components/customer/CreatePostModal";
import styles from "./CreatePostDemo.module.css";

const CreatePostDemo = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSuccess = () => {
    console.log("Đăng tin thành công!");
  };

  return (
    <div className={styles.demoPage}>
      <Header />
      
      <div className={styles.content}>
        <div className={styles.hero}>
          <h1>Demo Modal Đăng Tin</h1>
          <p>Click nút bên dưới để mở modal đăng tin chuyên nghiệp</p>
        </div>

        <div className={styles.buttonContainer}>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleOpenModal}
            className={styles.primaryButton}
          >
            Đăng tin mới
          </Button>
        </div>

        <div className={styles.features}>
          <h2>Tính năng Modal</h2>
          <div className={styles.featureGrid}>
            <Card className={styles.featureCard}>
              <FileTextOutlined className={styles.featureIcon} />
              <h3>4 bước đơn giản</h3>
              <p>Chọn loại tin → Nhập thông tin → Upload ảnh → Xác nhận</p>
            </Card>

            <Card className={styles.featureCard}>
              <FileTextOutlined className={styles.featureIcon} />
              <h3>Validation thông minh</h3>
              <p>Kiểm tra dữ liệu từng bước, đảm bảo thông tin chính xác</p>
            </Card>

            <Card className={styles.featureCard}>
              <FileTextOutlined className={styles.featureIcon} />
              <h3>Upload nhiều ảnh</h3>
              <p>Hỗ trợ kéo thả, upload tối đa 6 ảnh, preview trực quan</p>
            </Card>

            <Card className={styles.featureCard}>
              <FileTextOutlined className={styles.featureIcon} />
              <h3>Giao diện đẹp</h3>
              <p>Thiết kế hiện đại, responsive, animation mượt mà</p>
            </Card>
          </div>
        </div>

        <div className={styles.instructions}>
          <h2>Hướng dẫn sử dụng</h2>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Card>
              <h4>🎯 Bước 1: Chọn loại tin</h4>
              <p>Chọn "Bán pin" hoặc "Mua pin" và nhập tiêu đề hấp dẫn (10-100 ký tự)</p>
            </Card>
            <Card>
              <h4>📝 Bước 2: Điền thông tin</h4>
              <p>Nhập đầy đủ: thương hiệu, dung lượng, tình trạng, giá, bảo hành, địa điểm và mô tả chi tiết</p>
            </Card>
            <Card>
              <h4>📸 Bước 3: Upload hình ảnh</h4>
              <p>Kéo thả hoặc chọn ảnh (JPG, PNG, GIF tối đa 5MB/ảnh, tối đa 6 ảnh)</p>
            </Card>
            <Card>
              <h4>✅ Bước 4: Xác nhận và đăng</h4>
              <p>Kiểm tra lại thông tin, click "Đăng tin ngay" để hoàn tất</p>
            </Card>
          </Space>
        </div>
      </div>

      <CreatePostModal
        visible={modalVisible}
        onCancel={handleCloseModal}
        onSuccess={handleSuccess}
      />

      <Footer />
    </div>
  );
};

export default CreatePostDemo;
