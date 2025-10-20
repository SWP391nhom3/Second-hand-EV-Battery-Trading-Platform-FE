import React from "react";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../configs/axios";
import styles from "./RegisterForm.module.css";

const { Title, Text } = Typography;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      // Remove confirm password before sending to API
      const { confirm, ...registerData } = values;
      // await api.post("register", registerData);
      toast.success("Tạo tài khoản thành công!");
      console.log("Successful register:", values);
      // navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
      console.error("Registration error:", error);
    }
  };

  const handleSubmitFailed = (errorInfo) => {
    console.error("Form validation failed:", errorInfo);
    toast.error("Vui lòng kiểm tra thông tin và thử lại.");
  };

  return (
    <div className={styles.registerFormContainer}>
      <div className={styles.formHeader}>
        <Title level={2} className={styles.formTitle}>
          Tạo tài khoản
        </Title>
        <Text className={styles.formSubtitle}>
          Tham gia để bắt đầu mua pin xe điện chất lượng
        </Text>
      </div>

      <Form
        form={form}
        name="registerForm"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        onFinishFailed={handleSubmitFailed}
        autoComplete="off"
        size="large"
        scrollToFirstError
      >
        <Form.Item
          label="Họ và tên"
          name="fullname"
          rules={[
            { required: true, message: "Vui lòng nhập họ và tên!" },
            { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
          ]}
        >
          <Input
            prefix={<IdcardOutlined />}
            placeholder="Nhập họ và tên của bạn"
          />
        </Form.Item>

        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[
            { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            { min: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự!" },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message:
                "Tên đăng nhập chỉ có thể chứa chữ cái, số và dấu gạch dưới!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Chọn một tên đăng nhập"
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Vui lòng nhập địa chỉ email hợp lệ!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Nhập email của bạn" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: "Mật khẩu phải chứa chữ hoa, chữ thường và số!",
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Tạo mật khẩu mạnh"
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Xác nhận mật khẩu của bạn"
          />
        </Form.Item>

        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Bạn phải chấp nhận điều khoản và điều kiện")
                    ),
            },
          ]}
        >
          <Checkbox>
            Tôi đồng ý với{" "}
            <Link to="/terms" target="_blank">
              Điều khoản và Điều kiện
            </Link>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            className={styles.submitButton}
          >
            Tạo tài khoản
          </Button>
        </Form.Item>

        <div className={styles.formFooter}>
          <Text>Đã có tài khoản? </Text>
          <Link to="/login" className={styles.loginLink}>
            Đăng nhập tại đây
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
