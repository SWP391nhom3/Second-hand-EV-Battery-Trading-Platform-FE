import React from "react";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../configs/axios";
import styles from "./LoginForm.module.css";

const { Title, Text } = Typography;

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const response = await api.post("api/Auth/login", values);
      const data = response.data || {};
      // lưu token và user (tùy cấu trúc response của backend)
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      toast.success("Đăng nhập thành công!");
      console.log("Successful Login:", values);
      // notify other components (same-tab) that auth changed
      try {
        window.dispatchEvent(new Event("authChanged"));
      } catch (e) {
        /* ignore */
      }
      // Nếu có redirect trong query, quay về đó, ngược lại về trang chủ
      const params = new URLSearchParams(location.search);
      const redirect = params.get("redirect") || "/";
      navigate(redirect);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
      console.error("Login error:", error);
    }
  };

  const handleSubmitFailed = (errorInfo) => {
    console.error("Form validation failed:", errorInfo);
    toast.error("Vui lòng kiểm tra thông tin và thử lại.");
  };

  return (
    <div className={styles.loginFormContainer}>
      <div className={styles.formHeader}>
        <Title level={2} className={styles.formTitle}>
          Chào mừng trở lại
        </Title>
        <Text className={styles.formSubtitle}>
          Đăng nhập vào tài khoản của bạn để tiếp tục
        </Text>
      </div>

      <Form
        form={form}
        name="loginForm"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        onFinishFailed={handleSubmitFailed}
        autoComplete="off"
        size="large"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Vui lòng nhập email hợp lệ!" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Nhập email của bạn"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu của bạn"
          />
        </Form.Item>

        <Form.Item>
          <div className={styles.formOptions}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Quên mật khẩu?
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            className={styles.submitButton}
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <div className={styles.formFooter}>
          <Text>Chưa có tài khoản? </Text>
          <Link to="/register" className={styles.registerLink}>
            Đăng ký ngay
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
