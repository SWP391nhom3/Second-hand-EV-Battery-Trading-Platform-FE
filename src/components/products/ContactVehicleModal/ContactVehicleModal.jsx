import React, { useState } from 'react';
import { Modal, Form, Input, Select, message, Row, Col } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const ContactVehicleModal = ({ visible, onClose, product }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Tạo dữ liệu gửi đi
      const contactData = {
        ...values,
        productId: product?.id,
        productName: product?.name,
        productPrice: product?.price,
        productCategory: product?.category,
        submittedAt: new Date().toISOString(),
      };

      console.log('Thông tin liên hệ:', contactData);

      // TODO: Gọi API gửi thông tin
      // await axios.post('/api/contact-vehicle', contactData);

      // Giả lập delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('Đã gửi thông tin thành công! Nhân viên sẽ liên hệ với bạn trong vòng 24 giờ.');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Lỗi khi gửi thông tin:', error);
      if (error.errorFields) {
        message.error('Vui lòng điền đầy đủ thông tin!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: 18, fontWeight: 600 }}>
          <UserOutlined style={{ marginRight: 8 }} />
          Để lại thông tin liên hệ
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Gửi thông tin"
      cancelText="Hủy"
      confirmLoading={loading}
      width={600}
    >
      {product && (
        <div style={{ 
          padding: '12px 16px', 
          background: '#f5f5f5', 
          borderRadius: 8, 
          marginBottom: 24 
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {product.name}
          </div>
          <div style={{ color: '#ff4d4f', fontSize: 16, fontWeight: 600 }}>
            {product.price?.toLocaleString('vi-VN')} VNĐ
          </div>
        </div>
      )}

      <div style={{ marginBottom: 16, color: '#666' }}>
        Vui lòng để lại thông tin của bạn. Nhân viên của chúng tôi sẽ liên hệ trong vòng 24 giờ để sắp xếp lịch hẹn gặp mặt và tư vấn chi tiết.
      </div>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên!' },
                { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="VD: Nguyễn Văn A"
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="VD: 0912345678"
                size="large"
                maxLength={10}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="VD: example@email.com"
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="city"
              label="Tỉnh/Thành phố"
              rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
            >
              <Select
                placeholder="Chọn tỉnh/thành phố"
                size="large"
                showSearch
                suffixIcon={<EnvironmentOutlined />}
              >
                <Option value="Hà Nội">Hà Nội</Option>
                <Option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</Option>
                <Option value="Đà Nẵng">Đà Nẵng</Option>
                <Option value="Hải Phòng">Hải Phòng</Option>
                <Option value="Cần Thơ">Cần Thơ</Option>
                <Option value="An Giang">An Giang</Option>
                <Option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</Option>
                <Option value="Bắc Giang">Bắc Giang</Option>
                <Option value="Bắc Kạn">Bắc Kạn</Option>
                <Option value="Bạc Liêu">Bạc Liêu</Option>
                <Option value="Bắc Ninh">Bắc Ninh</Option>
                <Option value="Bến Tre">Bến Tre</Option>
                <Option value="Bình Định">Bình Định</Option>
                <Option value="Bình Dương">Bình Dương</Option>
                <Option value="Bình Phước">Bình Phước</Option>
                <Option value="Bình Thuận">Bình Thuận</Option>
                <Option value="Cà Mau">Cà Mau</Option>
                <Option value="Cao Bằng">Cao Bằng</Option>
                <Option value="Đắk Lắk">Đắk Lắk</Option>
                <Option value="Đắk Nông">Đắk Nông</Option>
                <Option value="Điện Biên">Điện Biên</Option>
                <Option value="Đồng Nai">Đồng Nai</Option>
                <Option value="Đồng Tháp">Đồng Tháp</Option>
                <Option value="Gia Lai">Gia Lai</Option>
                <Option value="Hà Giang">Hà Giang</Option>
                <Option value="Hà Nam">Hà Nam</Option>
                <Option value="Hà Tĩnh">Hà Tĩnh</Option>
                <Option value="Hải Dương">Hải Dương</Option>
                <Option value="Hậu Giang">Hậu Giang</Option>
                <Option value="Hòa Bình">Hòa Bình</Option>
                <Option value="Hưng Yên">Hưng Yên</Option>
                <Option value="Khánh Hòa">Khánh Hòa</Option>
                <Option value="Kiên Giang">Kiên Giang</Option>
                <Option value="Kon Tum">Kon Tum</Option>
                <Option value="Lai Châu">Lai Châu</Option>
                <Option value="Lâm Đồng">Lâm Đồng</Option>
                <Option value="Lạng Sơn">Lạng Sơn</Option>
                <Option value="Lào Cai">Lào Cai</Option>
                <Option value="Long An">Long An</Option>
                <Option value="Nam Định">Nam Định</Option>
                <Option value="Nghệ An">Nghệ An</Option>
                <Option value="Ninh Bình">Ninh Bình</Option>
                <Option value="Ninh Thuận">Ninh Thuận</Option>
                <Option value="Phú Thọ">Phú Thọ</Option>
                <Option value="Phú Yên">Phú Yên</Option>
                <Option value="Quảng Bình">Quảng Bình</Option>
                <Option value="Quảng Nam">Quảng Nam</Option>
                <Option value="Quảng Ngãi">Quảng Ngãi</Option>
                <Option value="Quảng Ninh">Quảng Ninh</Option>
                <Option value="Quảng Trị">Quảng Trị</Option>
                <Option value="Sóc Trăng">Sóc Trăng</Option>
                <Option value="Sơn La">Sơn La</Option>
                <Option value="Tây Ninh">Tây Ninh</Option>
                <Option value="Thái Bình">Thái Bình</Option>
                <Option value="Thái Nguyên">Thái Nguyên</Option>
                <Option value="Thanh Hóa">Thanh Hóa</Option>
                <Option value="Thừa Thiên Huế">Thừa Thiên Huế</Option>
                <Option value="Tiền Giang">Tiền Giang</Option>
                <Option value="Trà Vinh">Trà Vinh</Option>
                <Option value="Tuyên Quang">Tuyên Quang</Option>
                <Option value="Vĩnh Long">Vĩnh Long</Option>
                <Option value="Vĩnh Phúc">Vĩnh Phúc</Option>
                <Option value="Yên Bái">Yên Bái</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="preferredTime"
              label="Thời gian thuận tiện"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
            >
              <Select
                placeholder="Chọn thời gian"
                size="large"
                suffixIcon={<ClockCircleOutlined />}
              >
                <Option value="morning">Sáng (8h-12h)</Option>
                <Option value="afternoon">Chiều (13h-17h)</Option>
                <Option value="evening">Tối (18h-20h)</Option>
                <Option value="weekend">Cuối tuần</Option>
                <Option value="flexible">Linh hoạt</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="message"
              label="Ghi chú (không bắt buộc)"
            >
              <TextArea
                rows={3}
                placeholder="VD: Tôi muốn xem xe vào chiều thứ 7 tuần sau..."
                maxLength={500}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ContactVehicleModal;
