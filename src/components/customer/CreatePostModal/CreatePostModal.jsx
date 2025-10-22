import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  Row,
  Col,
  Space,
  message,
  Steps,
  Radio,
  Divider,
  Tag,
  Progress,
} from "antd";
import {
  PlusOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  FileTextOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import styles from "./CreatePostModal.module.css";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;
const { Step } = Steps;

const CreatePostModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState("sell");

  // Danh sách thương hiệu pin phổ biến
  const batteryBrands = [
    "Tesla",
    "BYD",
    "CATL",
    "LG Chem",
    "Panasonic",
    "Samsung SDI",
    "SK Innovation",
    "AESC",
    "Northvolt",
    "Khác",
  ];

  // Tình trạng pin
  const batteryConditions = [
    { value: "new", label: "Mới 100%" },
    { value: "like-new", label: "Như mới (>95%)" },
    { value: "excellent", label: "Xuất sắc (90-95%)" },
    { value: "good", label: "Tốt (80-90%)" },
    { value: "fair", label: "Khá (70-80%)" },
    { value: "used", label: "Đã qua sử dụng (<70%)" },
  ];

  // Thành phố
  const cities = [
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "Biên Hòa",
    "Nha Trang",
    "Huế",
    "Vũng Tàu",
    "Khác",
  ];

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    listType: "picture-card",
    fileList: fileList,
    onChange: handleUploadChange,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ được upload file ảnh!");
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Ảnh phải nhỏ hơn 5MB!");
        return Upload.LIST_IGNORE;
      }
      return false; // Prevent auto upload
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };

  const steps = [
    {
      title: "Loại tin",
      icon: <FileTextOutlined />,
    },
    {
      title: "Thông tin",
      icon: <DollarOutlined />,
    },
    {
      title: "Hình ảnh",
      icon: <CameraOutlined />,
    },
    {
      title: "Xác nhận",
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleNext = async () => {
    try {
      // Validate current step fields
      if (currentStep === 0) {
        await form.validateFields(["postType", "title"]);
      } else if (currentStep === 1) {
        await form.validateFields([
          "brand",
          "capacity",
          "condition",
          "price",
          "city",
          "description",
        ]);
      } else if (currentStep === 2) {
        if (fileList.length === 0) {
          message.warning("Vui lòng upload ít nhất 1 ảnh!");
          return;
        }
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      message.success("Đăng tin thành công!");
      form.resetFields();
      setFileList([]);
      setCurrentStep(0);
      onSuccess && onSuccess();
      onCancel();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form và đóng modal trực tiếp
    form.resetFields();
    setFileList([]);
    setCurrentStep(0);
    setPostType("sell");
    
    // Gọi callback để đóng modal
    if (onCancel) {
      onCancel();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Bạn muốn đăng tin gì?</h3>
            <Form.Item
              name="postType"
              rules={[{ required: true, message: "Vui lòng chọn loại tin!" }]}
            >
              <Radio.Group
                value={postType}
                onChange={(e) => setPostType(e.target.value)}
                className={styles.radioGroup}
              >
                <Radio.Button value="sell" className={styles.radioButton}>
                  <Space direction="vertical" align="center">
                    <DollarOutlined style={{ fontSize: 32 }} />
                    <span>Bán pin EV</span>
                    <small>Đăng tin bán pin xe điện</small>
                  </Space>
                </Radio.Button>
                <Radio.Button value="motorcycle" className={styles.radioButton}>
                  <Space direction="vertical" align="center">
                    <InboxOutlined style={{ fontSize: 32 }} />
                    <span>Bán xe máy điện</span>
                    <small>Đăng tin bán xe máy điện</small>
                  </Space>
                </Radio.Button>
                <Radio.Button value="car" className={styles.radioButton}>
                  <Space direction="vertical" align="center">
                    <InboxOutlined style={{ fontSize: 32 }} />
                    <span>Bán xe ô tô điện</span>
                    <small>Đăng tin bán xe ô tô điện</small>
                  </Space>
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Divider />

            <Form.Item
              name="title"
              label="Tiêu đề tin đăng"
              rules={[
                { required: true, message: "Vui lòng nhập tiêu đề!" },
                { min: 10, message: "Tiêu đề phải có ít nhất 10 ký tự!" },
                { max: 100, message: "Tiêu đề không được quá 100 ký tự!" },
              ]}
            >
              <Input
                placeholder={
                  postType === "sell"
                    ? "VD: Bán pin Tesla 75kWh, tình trạng tốt, giá hợp lý"
                    : postType === "motorcycle"
                    ? "VD: Bán xe máy điện VinFast Klara S, mới 95%, đi 3000km"
                    : "VD: Bán xe ô tô điện VinFast VF8, năm 2024, full options"
                }
                size="large"
                showCount
                maxLength={100}
              />
            </Form.Item>

            <div className={styles.tips}>
              <h4>💡 Mẹo viết tiêu đề tốt:</h4>
              <ul>
                {postType === "sell" ? (
                  <>
                    <li>Nêu rõ thương hiệu và dung lượng pin</li>
                    <li>Ghi rõ tình trạng và mức giá</li>
                  </>
                ) : (
                  <>
                    <li>Nêu rõ hãng xe và model</li>
                    <li>Ghi rõ năm sản xuất và số km đã đi</li>
                    <li>Nêu rõ tình trạng xe và giá bán</li>
                  </>
                )}
                <li>Tránh viết HOA toàn bộ hoặc dùng ký tự đặc biệt</li>
              </ul>
            </div>
          </div>
        );

      case 1:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Thông tin chi tiết</h3>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="brand"
                  label="Thương hiệu"
                  rules={[
                    { required: true, message: "Vui lòng chọn thương hiệu!" },
                  ]}
                >
                  <Select placeholder="Chọn thương hiệu" size="large">
                    {batteryBrands.map((brand) => (
                      <Option key={brand} value={brand}>
                        {brand}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="capacity"
                  label="Dung lượng (kWh)"
                  rules={[
                    { required: true, message: "Vui lòng nhập dung lượng!" },
                  ]}
                >
                  <InputNumber
                    placeholder="VD: 75"
                    size="large"
                    min={10}
                    max={200}
                    style={{ width: "100%" }}
                    addonAfter="kWh"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="condition"
                  label="Tình trạng"
                  rules={[
                    { required: true, message: "Vui lòng chọn tình trạng!" },
                  ]}
                >
                  <Select placeholder="Chọn tình trạng" size="large">
                    {batteryConditions.map((condition) => (
                      <Option key={condition.value} value={condition.value}>
                        {condition.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="price"
                  label="Giá (VNĐ)"
                  rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                >
                  <InputNumber
                    placeholder="VD: 50000000"
                    size="large"
                    min={0}
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    addonAfter="VNĐ"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="warranty"
                  label="Bảo hành (tháng)"
                  rules={[
                    { required: true, message: "Vui lòng nhập thời gian bảo hành!" },
                  ]}
                >
                  <InputNumber
                    placeholder="VD: 12"
                    size="large"
                    min={0}
                    max={120}
                    style={{ width: "100%" }}
                    addonAfter="tháng"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="city"
                  label="Thành phố"
                  rules={[
                    { required: true, message: "Vui lòng chọn thành phố!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn thành phố"
                    size="large"
                    suffixIcon={<EnvironmentOutlined />}
                  >
                    {cities.map((city) => (
                      <Option key={city} value={city}>
                        {city}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="description"
                  label="Mô tả chi tiết"
                  rules={[
                    { required: true, message: "Vui lòng nhập mô tả!" },
                    { min: 50, message: "Mô tả phải có ít nhất 50 ký tự!" },
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Mô tả chi tiết về pin: lịch sử sử dụng, tình trạng, lý do bán..."
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="advantages"
                  label="Ưu điểm"
                  rules={[
                    { required: true, message: "Vui lòng nhập ưu điểm!" },
                    { min: 20, message: "Ưu điểm phải có ít nhất 20 ký tự!" },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="VD: Pin còn mới 90%, dung lượng tốt, sạc nhanh, đã bảo dưỡng định kỳ..."
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="detailedInfo"
                  label="Thông tin chi tiết"
                  rules={[
                    { required: true, message: "Vui lòng nhập thông tin chi tiết!" },
                    { min: 30, message: "Thông tin chi tiết phải có ít nhất 30 ký tự!" },
                  ]}
                >
                  <TextArea
                    rows={5}
                    placeholder="VD: Năm sản xuất, số lần sạc, lịch sử bảo dưỡng, các linh kiện đi kèm..."
                    showCount
                    maxLength={800}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="policy"
                  label="Chính sách"
                  rules={[
                    { required: true, message: "Vui lòng nhập chính sách!" },
                    { min: 20, message: "Chính sách phải có ít nhất 20 ký tự!" },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="VD: Hỗ trợ đổi trả trong 7 ngày, bảo hành 12 tháng, giao hàng tận nơi..."
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Upload hình ảnh</h3>
            <p className={styles.stepDescription}>
              Thêm ít nhất 1 ảnh để tin đăng của bạn thu hút hơn (tối đa 6 ảnh)
            </p>

            <Dragger {...uploadProps} className={styles.uploader}>
              {fileList.length < 6 && (
                <div className={styles.uploadArea}>
                  <p className="ant-upload-drag-icon">
                    <CameraOutlined style={{ fontSize: 48, color: "#1890ff" }} />
                  </p>
                  <p className="ant-upload-text">
                    Kéo thả ảnh vào đây hoặc click để chọn
                  </p>
                  <p className="ant-upload-hint">
                    Hỗ trợ: JPG, PNG, GIF (tối đa 5MB/ảnh)
                  </p>
                </div>
              )}
            </Dragger>

            <div className={styles.uploadProgress}>
              <Progress
                percent={Math.round((fileList.length / 6) * 100)}
                status={fileList.length >= 6 ? "success" : "active"}
                format={() => `${fileList.length}/6 ảnh`}
              />
            </div>

            <div className={styles.tips}>
              <h4>📸 Mẹo chụp ảnh tốt:</h4>
              <ul>
                <li>Chụp rõ nhãn mác, số serial của pin</li>
                <li>Chụp toàn cảnh và các góc chi tiết</li>
                <li>Ánh sáng tốt, không bị mờ hoặc nhòe</li>
                <li>Tránh chụp ảnh có chứa thông tin cá nhân</li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Xác nhận thông tin</h3>
            <div className={styles.confirmContent}>
              <div className={styles.confirmSection}>
                <h4>
                  <FileTextOutlined /> Loại tin
                </h4>
                <Tag 
                  color={postType === "sell" ? "green" : postType === "motorcycle" ? "blue" : "purple"} 
                  style={{ fontSize: 14 }}
                >
                  {postType === "sell" ? "Bán pin EV" : postType === "motorcycle" ? "Bán xe máy điện" : "Bán xe ô tô điện"}
                </Tag>
              </div>

              <div className={styles.confirmSection}>
                <h4>
                  <DollarOutlined /> Tiêu đề
                </h4>
                <p>{form.getFieldValue("title")}</p>
              </div>

              <div className={styles.confirmSection}>
                <h4>Thông tin sản phẩm</h4>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <strong>Thương hiệu:</strong> {form.getFieldValue("brand")}
                  </Col>
                  <Col span={12}>
                    <strong>Dung lượng:</strong> {form.getFieldValue("capacity")} kWh
                  </Col>
                  <Col span={12}>
                    <strong>Tình trạng:</strong>{" "}
                    {
                      batteryConditions.find(
                        (c) => c.value === form.getFieldValue("condition")
                      )?.label
                    }
                  </Col>
                  <Col span={12}>
                    <strong>Giá:</strong>{" "}
                    {form.getFieldValue("price")?.toLocaleString("vi-VN")} VNĐ
                  </Col>
                  <Col span={12}>
                    <strong>Bảo hành:</strong> {form.getFieldValue("warranty")} tháng
                  </Col>
                  <Col span={12}>
                    <strong>Địa điểm:</strong> {form.getFieldValue("city")}
                  </Col>
                </Row>
              </div>

              <div className={styles.confirmSection}>
                <h4>📝 Mô tả chi tiết</h4>
                <p style={{ whiteSpace: "pre-wrap" }}>{form.getFieldValue("description")}</p>
              </div>

              <div className={styles.confirmSection}>
                <h4>⭐ Ưu điểm</h4>
                <p style={{ whiteSpace: "pre-wrap" }}>{form.getFieldValue("advantages")}</p>
              </div>

              <div className={styles.confirmSection}>
                <h4>ℹ️ Thông tin chi tiết</h4>
                <p style={{ whiteSpace: "pre-wrap" }}>{form.getFieldValue("detailedInfo")}</p>
              </div>

              <div className={styles.confirmSection}>
                <h4>📋 Chính sách</h4>
                <p style={{ whiteSpace: "pre-wrap" }}>{form.getFieldValue("policy")}</p>
              </div>

              <div className={styles.confirmSection}>
                <h4>
                  <CameraOutlined /> Hình ảnh
                </h4>
                <p>{fileList.length} ảnh đã upload</p>
              </div>

              <div className={styles.confirmNote}>
                <CheckCircleOutlined /> Sau khi đăng tin, bài viết sẽ được kiểm duyệt
                trong vòng 24 giờ
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <div className={styles.modalHeader}>
          <h2>
            <PlusOutlined /> Đăng tin mới
          </h2>
          <p>Chia sẻ thông tin pin EV của bạn với cộng đồng</p>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      className={styles.createPostModal}
      destroyOnClose
    >
      <div className={styles.modalContent}>
        <Steps current={currentStep} className={styles.steps}>
          {steps.map((item, index) => (
            <Step key={index} title={item.title} icon={item.icon} />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          initialValues={{ postType: "sell" }}
          className={styles.form}
        >
          {renderStepContent()}
        </Form>

        <div className={styles.modalFooter}>
          {currentStep > 0 && (
            <Button size="large" onClick={handlePrevious}>
              Quay lại
            </Button>
          )}
          <Space>
            <Button size="large" onClick={handleCancel}>
              Hủy
            </Button>
            {currentStep < steps.length - 1 && (
              <Button type="primary" size="large" onClick={handleNext}>
                Tiếp tục
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                loading={loading}
                icon={<CheckCircleOutlined />}
              >
                Đăng tin ngay
              </Button>
            )}
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default CreatePostModal;
