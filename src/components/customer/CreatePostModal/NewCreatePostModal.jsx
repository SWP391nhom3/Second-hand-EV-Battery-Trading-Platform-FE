import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  Steps,
  Row,
  Col,
  Card,
  message,
  Space,
  Divider,
  Typography,
  Tag,
  Radio,
  Progress,
  Tooltip,
  Alert,
} from "antd";
import {
  PlusOutlined,
  ThunderboltOutlined,
  CarOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import postService from "../../../services/postService";
import batteryService from "../../../services/batteryService";
import vehicleService from "../../../services/vehicleService";
import packageService from "../../../services/packageService";
import { getUser } from "../../../utils/sessionStorage";
import styles from "./NewCreatePostModal.module.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const NewCreatePostModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const currentUser = getUser();
  const memberId = currentUser?.memberId || currentUser?.member?.memberId;

  // States
  const [currentStep, setCurrentStep] = useState(0);
  const [postType, setPostType] = useState("battery");
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState({}); // Store form data across steps
  const [previewImages, setPreviewImages] = useState([]); // Store image previews

  // Load packages when modal opens
  useEffect(() => {
    if (visible) {
      fetchPackages();
      // Reset form when modal opens
      form.resetFields();
      setCurrentStep(0);
      setPostType("battery");
      setSelectedPackage(null);
      setFileList([]);
      setFormData({});
      setPreviewImages([]);
    }
  }, [visible]);

  const fetchPackages = async () => {
    try {
      setLoadingPackages(true);
      const response = await packageService.getActivePackages();
      
      if (Array.isArray(response) && response.length > 0) {
        setPackages(response);
        // Auto select first package
        setSelectedPackage(response[0].packageId);
      } else {
        message.warning("Không có gói đăng tin khả dụng");
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      message.error("Không thể tải danh sách gói");
    } finally {
      setLoadingPackages(false);
    }
  };

  const steps = [
    { title: "Loại tin", icon: <FileTextOutlined /> },
    { title: "Thông tin", icon: <InfoCircleOutlined /> },
    { title: "Hình ảnh", icon: <CameraOutlined /> },
    { title: "Chọn gói", icon: <DollarOutlined /> },
  ];

  // Suggestions for autocomplete (optional)
  const brandSuggestions = ["Tesla", "BYD", "CATL", "LG Chem", "Panasonic", "Samsung SDI", "VinFast"];
  const conditionSuggestions = ["New", "Like-New", "Excellent", "Good", "Fair", "Used"];
  const citySuggestions = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Biên Hòa", "Nha Trang", "Huế", "Vũng Tàu"];

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        const values = await form.validateFields(["title"]);
        setFormData(prev => ({ ...prev, ...values, postType }));
        console.log("✅ Step 0 saved:", { ...values, postType });
      } else if (currentStep === 1) {
        const fields = postType === "battery"
          ? ["brand", "capacityKWh", "condition", "manufactureYear", "price", "location", "description"]
          : ["brand", "model", "condition", "manufactureYear", "mileageKm", "batteryCapacity", "price", "location", "description"];
        const values = await form.validateFields(fields);
        setFormData(prev => ({ ...prev, ...values }));
        console.log("✅ Step 1 saved:", values);
      } else if (currentStep === 2) {
        if (fileList.length === 0) {
          message.warning("Vui lòng upload ít nhất 1 ảnh!");
          return;
        }
        setFormData(prev => ({ ...prev, images: fileList }));
        console.log("✅ Step 2 saved: images");
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    console.log("🚀 Starting handleSubmit...");
    console.log("Selected package:", selectedPackage);
    console.log("Post type:", postType);
    console.log("📦 Saved formData:", formData);
    
    if (!selectedPackage) {
      message.error("Vui lòng chọn gói đăng tin!");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create Battery or Vehicle
      let productId = null;
      
      if (postType === "battery") {
        // Batteries table schema: MemberId, CapacityKWh, CycleCount, ManufactureYear, Condition, Description, BatteryModelId
        // Brand và Location sẽ lưu trong Description vì không có trường riêng
        const batteryDescription = `Thương hiệu: ${formData.brand || "N/A"}
Vị trí: ${formData.location || "N/A"}

${formData.description || ""}`.trim();

        const batteryData = {
          MemberId: parseInt(memberId),
          CapacityKWh: parseFloat(formData.capacityKWh || 0),
          CycleCount: parseInt(formData.cycleCount || 0),
          ManufactureYear: parseInt(formData.manufactureYear || new Date().getFullYear()),
          Condition: String(formData.condition || "Good"),
          Description: batteryDescription,
          BatteryModelId: null
        };

        console.log("🔋 Creating battery with data:", JSON.stringify(batteryData, null, 2));
        message.loading({ content: "Đang tạo thông tin pin...", key: "create" });
        
        const batteryResponse = await batteryService.createBattery(batteryData);
        console.log("✅ Battery created:", batteryResponse);
        productId = batteryResponse.batteryId || batteryResponse.BatteryId;
        
        message.success({ content: "Tạo pin thành công!", key: "create", duration: 2 });
      } else {
        // Vehicles table schema: MemberId, VIN, ManufactureYear, MileageKm, BatteryCapacity, Condition, Description, VehicleModelId
        const vehicleDescription = `Thương hiệu: ${formData.brand || "N/A"}
Model: ${formData.model || "N/A"}
Vị trí: ${formData.location || "N/A"}

${formData.description || ""}`.trim();

        const vehicleData = {
          MemberId: parseInt(memberId),
          VIN: String(formData.vin || `AUTO-VIN-${Date.now()}`), // VIN is required
          ManufactureYear: parseInt(formData.manufactureYear || new Date().getFullYear()),
          MileageKm: parseInt(formData.mileageKm || 0),
          BatteryCapacity: parseFloat(formData.batteryCapacity || 0),
          Condition: String(formData.condition || "Good"),
          Description: vehicleDescription,
          VehicleModelId: null
        };

        console.log("🚗 Creating vehicle with data:", JSON.stringify(vehicleData, null, 2));
        message.loading({ content: "Đang tạo thông tin xe...", key: "create" });
        
        const vehicleResponse = await vehicleService.createVehicle(vehicleData);
        console.log("✅ Vehicle created:", vehicleResponse);
        productId = vehicleResponse.id || vehicleResponse.Id;
        
        message.success({ content: "Tạo xe thành công!", key: "create", duration: 2 });
      }

      // Step 2: Create Post
      // Posts table schema: MemberId, VehicleId, BatteryId, Title, Description, Price, PostType, Status, 
      // CreatedAt, UpdatedAt, ExpiryDate, Featured, TransactionType, StaffId, ContactInfo
      // Note: Không có trường Location trong Posts - đã lưu trong Battery/Vehicle Description
      
      // BUSINESS RULE: Xe điện phải là Staff-Assisted, Pin có thể Direct
      const postTypeValue = postType === "vehicle" ? "Staff-Assisted" : "Direct";
      
      const postData = {
        MemberId: parseInt(memberId),
        BatteryId: postType === "battery" ? productId : null,
        VehicleId: postType === "vehicle" ? productId : null,
        Title: String(formData.title || ""),
        Description: String(formData.description || ""),
        Price: parseFloat(formData.price || 0),
        PostType: postTypeValue, // "Direct" for battery, "Staff-Assisted" for vehicle
        TransactionType: "Sale",
        ContactInfo: currentUser.email || currentUser.phone || "",
        Status: "Pending",
        Featured: false,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      };

      // Add package expiry date if package selected
      if (selectedPackage) {
        const packageInfo = packages.find(p => p.packageId === selectedPackage);
        if (packageInfo) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + packageInfo.durationDay);
          postData.ExpiryDate = expiryDate.toISOString();
          postData.Featured = packageInfo.featured || false;
        }
      }

      console.log("📮 Creating post with data:", JSON.stringify(postData, null, 2));
      console.log("🖼️ Preview images count:", previewImages.length);
      message.loading({ content: "Đang đăng tin...", key: "create" });
      
      const postResponse = await postService.createPost(postData);
      console.log("✅ Post created:", postResponse);
      
      // Different success messages based on post type
      const successMessage = postType === "vehicle" 
        ? "Đăng tin thành công! Nhân viên sẽ liên hệ hỗ trợ bạn trong thời gian sớm nhất."
        : "Đăng tin thành công! Bài viết đang chờ duyệt.";
      
      message.success({ content: successMessage, key: "create", duration: 3 });
      
      // Reset and close
      form.resetFields();
      setFileList([]);
      setCurrentStep(0);
      setSelectedPackage(null);
      setFormData({});
      setPreviewImages([]);
      
      if (onSuccess) onSuccess();
      if (onCancel) onCancel();
      
      // Redirect
      setTimeout(() => {
        navigate('/customer');
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error("❌ Error creating post:", error);
      console.error("📋 Error response:", error.response?.data);
      
      message.destroy();
      
      // Extract detailed error message
      let errorMsg = "Không thể tạo bài đăng. Vui lòng thử lại!";
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
        
        console.error("🔍 Validation errors:", errors);
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.title) {
        errorMsg = error.response.data.title;
      }
      
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Handle image preview
  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload ảnh!");
      return Upload.LIST_IGNORE;
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return Upload.LIST_IGNORE;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImages(prev => [...prev, reader.result]);
    };
    reader.readAsDataURL(file);

    return false; // Prevent default upload
  };

  const uploadProps = {
    listType: "picture-card",
    fileList,
    onChange: handleUploadChange,
    beforeUpload: handleBeforeUpload,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      
      // Also remove from preview images
      const newPreview = previewImages.slice();
      newPreview.splice(index, 1);
      setPreviewImages(newPreview);
    },
    maxCount: 6,
  };

  // Render Step 0: Post Type
  const renderStepType = () => (
    <div className={styles.stepContent}>
      <Title level={4} className={styles.stepTitle}>
        <FileTextOutlined /> Bạn muốn đăng tin gì?
      </Title>

      <Row gutter={[16, 16]} className={styles.typeSelection}>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            className={`${styles.typeCard} ${postType === "battery" ? styles.typeCardActive : ""}`}
            onClick={() => setPostType("battery")}
          >
            <div className={styles.typeCardContent}>
              <ThunderboltOutlined className={styles.typeIcon} style={{ color: "#faad14" }} />
              <Title level={5}>Bán Pin EV</Title>
              <Text type="secondary">Đăng tin bán pin xe điện</Text>
              {postType === "battery" && (
                <CheckCircleOutlined className={styles.selectedIcon} />
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            className={`${styles.typeCard} ${postType === "vehicle" ? styles.typeCardActive : ""}`}
            onClick={() => setPostType("vehicle")}
          >
            <div className={styles.typeCardContent}>
              <CarOutlined className={styles.typeIcon} style={{ color: "#722ed1" }} />
              <Title level={5}>Bán Xe Điện</Title>
              <Text type="secondary">Đăng tin bán xe ô tô điện</Text>
              <Tag color="orange" style={{ marginTop: 8 }}>Cần hỗ trợ nhân viên</Tag>
              {postType === "vehicle" && (
                <CheckCircleOutlined className={styles.selectedIcon} />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Form.Item
        name="title"
        label={<Text strong>Tiêu đề tin đăng</Text>}
        rules={[
          { required: true, message: "Vui lòng nhập tiêu đề!" },
          { min: 10, message: "Tiêu đề phải có ít nhất 10 ký tự!" },
          { max: 100, message: "Tiêu đề không quá 100 ký tự!" },
        ]}
      >
        <Input
          size="large"
          placeholder={
            postType === "battery"
              ? "VD: Bán pin Tesla 75kWh, tình trạng tốt, giá hợp lý"
              : "VD: Bán xe VinFast VF8, năm 2024, full options"
          }
          showCount
          maxLength={100}
        />
      </Form.Item>

      <Alert
        message="Mẹo viết tiêu đề"
        description="Nêu rõ thương hiệu, model, tình trạng và giá để thu hút người mua"
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
      />

      {postType === "vehicle" && (
        <Alert
          message="Lưu ý về bán xe điện"
          description="Giao dịch xe điện yêu cầu hỗ trợ từ nhân viên để đảm bảo an toàn. Bạn sẽ được liên hệ sau khi đăng tin."
          type="warning"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );

  // Render Step 1: Details
  const renderStepDetails = () => (
    <div className={styles.stepContent}>
      <Title level={4} className={styles.stepTitle}>
        <InfoCircleOutlined /> Thông tin chi tiết
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            name="brand"
            label={<Text strong>Thương hiệu</Text>}
            rules={[{ required: true, message: "Vui lòng nhập thương hiệu!" }]}
          >
            <Input
              size="large"
              placeholder="VD: Tesla, BYD, VinFast..."
              showCount
              maxLength={50}
            />
          </Form.Item>
        </Col>

        {postType === "battery" ? (
          <>
            <Col xs={24} md={12}>
              <Form.Item
                name="capacityKWh"
                label={<Text strong>Dung lượng (kWh)</Text>}
                rules={[
                  { required: true, message: "Vui lòng nhập dung lượng!" },
                  { type: "number", min: 10, max: 200, message: "Dung lượng từ 10-200 kWh!" }
                ]}
              >
                <InputNumber
                  size="large"
                  placeholder="VD: 75"
                  min={10}
                  max={200}
                  style={{ width: "100%" }}
                  addonAfter="kWh"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="cycleCount"
                label={<Text strong>Số chu kỳ sạc</Text>}
                rules={[{ type: "number", min: 0, message: "Số chu kỳ không âm!" }]}
              >
                <InputNumber
                  size="large"
                  placeholder="VD: 500"
                  min={0}
                  style={{ width: "100%" }}
                  addonAfter="chu kỳ"
                />
              </Form.Item>
            </Col>
          </>
        ) : (
          <>
            <Col xs={24} md={12}>
              <Form.Item
                name="model"
                label={<Text strong>Model xe</Text>}
                rules={[{ required: true, message: "Vui lòng nhập model!" }]}
              >
                <Input
                  size="large"
                  placeholder="VD: VF8, Model 3, ID.4..."
                  showCount
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="mileageKm"
                label={<Text strong>Số km đã đi</Text>}
                rules={[
                  { required: true, message: "Vui lòng nhập số km!" },
                  { type: "number", min: 0, message: "Số km không âm!" }
                ]}
              >
                <InputNumber
                  size="large"
                  placeholder="VD: 15000"
                  min={0}
                  style={{ width: "100%" }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={value => value.replace(/\$\s?|(,*)/g, "")}
                  addonAfter="km"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="batteryCapacity"
                label={<Text strong>Dung lượng pin (kWh)</Text>}
                rules={[
                  { required: true, message: "Vui lòng nhập dung lượng!" },
                  { type: "number", min: 10, max: 200, message: "Dung lượng từ 10-200 kWh!" }
                ]}
              >
                <InputNumber
                  size="large"
                  placeholder="VD: 75"
                  min={10}
                  max={200}
                  style={{ width: "100%" }}
                  addonAfter="kWh"
                />
              </Form.Item>
            </Col>
          </>
        )}

        <Col xs={24} md={12}>
          <Form.Item
            name="manufactureYear"
            label={<Text strong>Năm sản xuất</Text>}
            rules={[
              { required: true, message: "Vui lòng nhập năm!" },
              { 
                type: "number", 
                min: 2010, 
                max: new Date().getFullYear(), 
                message: `Năm từ 2010 đến ${new Date().getFullYear()}!` 
              }
            ]}
          >
            <InputNumber
              size="large"
              placeholder="VD: 2023"
              min={2010}
              max={new Date().getFullYear()}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="condition"
            label={<Text strong>Tình trạng</Text>}
            rules={[{ required: true, message: "Vui lòng nhập tình trạng!" }]}
          >
            <Input
              size="large"
              placeholder="VD: New, Good, Used..."
              showCount
              maxLength={50}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="price"
            label={<Text strong>Giá (VNĐ)</Text>}
            rules={[
              { required: true, message: "Vui lòng nhập giá!" },
              { type: "number", min: 0, message: "Giá không âm!" }
            ]}
          >
            <InputNumber
              size="large"
              placeholder="VD: 50,000,000"
              min={0}
              style={{ width: "100%" }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={value => value.replace(/\$\s?|(,*)/g, "")}
              addonAfter="VNĐ"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="location"
            label={<Text strong>Địa điểm</Text>}
            rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
          >
            <Input
              size="large"
              placeholder="VD: Hà Nội, TP. Hồ Chí Minh..."
              showCount
              maxLength={100}
              prefix={<EnvironmentOutlined />}
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            name="description"
            label={<Text strong>Mô tả chi tiết</Text>}
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
              { min: 20, message: "Mô tả phải có ít nhất 20 ký tự!" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Mô tả chi tiết về sản phẩm: lịch sử sử dụng, tình trạng, lý do bán..."
              showCount
              maxLength={1000}
            />
          </Form.Item>
        </Col>
      </Row>

      <Alert
        message="💡 Lưu ý"
        description="Vui lòng nhập thông tin chính xác để bài đăng được duyệt nhanh hơn. Bạn có thể nhập bất kỳ giá trị nào phù hợp với sản phẩm của mình."
        type="info"
        showIcon
      />
    </div>
  );

  // Render Step 2: Images
  const renderStepImages = () => (
    <div className={styles.stepContent}>
      <Title level={4} className={styles.stepTitle}>
        <CameraOutlined /> Upload hình ảnh
      </Title>

      <Paragraph type="secondary">
        Thêm ít nhất 1 ảnh để tin đăng của bạn thu hút hơn (tối đa 6 ảnh)
      </Paragraph>

      <Upload {...uploadProps} maxCount={6}>
        {fileList.length < 6 && (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>

      <Progress
        percent={Math.round((fileList.length / 6) * 100)}
        status={fileList.length >= 1 ? "success" : "normal"}
        format={() => `${fileList.length}/6 ảnh`}
        style={{ marginTop: 16 }}
      />

      <Alert
        message="Mẹo chụp ảnh"
        description="Chụp rõ nhãn mác, số serial. Ánh sáng tốt, không mờ nhòe."
        type="info"
        showIcon
        style={{ marginTop: 16 }}
      />
    </div>
  );

  // Render Step 3: Package Selection
  const renderStepPackage = () => (
    <div className={styles.stepContent}>
      <Title level={4} className={styles.stepTitle}>
        <DollarOutlined /> Chọn gói đăng tin
      </Title>

      {loadingPackages ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Progress type="circle" percent={66} status="active" />
          <Paragraph style={{ marginTop: 16 }}>Đang tải gói...</Paragraph>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {packages.map(pkg => (
            <Col xs={24} sm={12} lg={8} key={pkg.packageId}>
              <Card
                hoverable
                className={`${styles.packageCard} ${
                  selectedPackage === pkg.packageId ? styles.packageCardActive : ""
                }`}
                onClick={() => setSelectedPackage(pkg.packageId)}
              >
                <div className={styles.packageHeader}>
                  <Title level={5}>{pkg.name}</Title>
                  {selectedPackage === pkg.packageId && (
                    <CheckCircleOutlined className={styles.packageSelected} />
                  )}
                </div>
                <div className={styles.packagePrice}>
                  <span className={styles.priceAmount}>
                    {pkg.price.toLocaleString("vi-VN")}
                  </span>
                  <span className={styles.priceCurrency}> đ</span>
                </div>
                <Divider />
                <Space direction="vertical" size="small">
                  <Text>
                    <CheckCircleOutlined style={{ color: "#52c41a" }} /> Đăng {pkg.durationDay} ngày
                  </Text>
                  <Text>
                    <CheckCircleOutlined style={{ color: "#52c41a" }} /> Ưu tiên mức {pkg.priorityLevel}
                  </Text>
                  {pkg.featured && (
                    <Text>
                      <CheckCircleOutlined style={{ color: "#52c41a" }} /> Hiển thị nổi bật ⭐
                    </Text>
                  )}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStepType();
      case 1:
        return renderStepDetails();
      case 2:
        return renderStepImages();
      case 3:
        return renderStepPackage();
      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <div className={styles.modalHeader}>
          <PlusOutlined />
          <span style={{ marginLeft: 8 }}>Đăng tin mới</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      className={styles.newCreatePostModal}
      destroyOnClose
    >
      <Steps current={currentStep} className={styles.steps}>
        {steps.map((item, index) => (
          <Steps.Step key={index} title={item.title} icon={item.icon} />
        ))}
      </Steps>

      <div className={styles.modalBody}>
        <Form form={form} layout="vertical" className={styles.form}>
          {renderCurrentStep()}
        </Form>
      </div>

      <div className={styles.modalFooter}>
        <Space>
          {currentStep > 0 && (
            <Button size="large" onClick={handlePrevious} icon={<ArrowLeftOutlined />}>
              Quay lại
            </Button>
          )}
          <Button size="large" onClick={onCancel}>
            Hủy
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button
              type="primary"
              size="large"
              onClick={handleNext}
              icon={<ArrowRightOutlined />}
            >
              Tiếp tục
            </Button>
          ) : (
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
    </Modal>
  );
};

export default NewCreatePostModal;
