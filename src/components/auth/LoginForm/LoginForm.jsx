import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Typography, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../configs/axios";
import styles from "./LoginForm.module.css";

const { Title, Text } = Typography;

const LoginForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values) => {
    setErrorMessage("");
    try {
      // 🔹 Gọi API đăng nhập
      const response = await api.post("api/Auth/login", {
        email: values.email,
        password: values.password,
      });

      const data = response.data || {};
      
      // 🔹 Lấy thông tin từ response structure
      // Response: { token, account: { accountId, email, phone, role, member: {...} } }
      const account = data.account || data;
      const token = data.token;
      const role = (account.role || data.role)?.toLowerCase();

      // 🔹 Lưu token và thông tin người dùng vào localStorage
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("authToken", token); // ✅ Lưu cả authToken để tương thích với các component khác
      }
      localStorage.setItem("user", JSON.stringify(account));
      localStorage.setItem("role", role);

      // 🔹 Thông báo event để các component khác cập nhật
      try {
        window.dispatchEvent(new Event("authChanged"));
      } catch (e) {
        console.warn("Could not dispatch authChanged event:", e);
      }

      toast.success("Đăng nhập thành công! 🎉");
      console.log("✅ Successful login:", {
        token: token ? "✓ Saved" : "✗ Missing",
        user: account,
        role: role,
      });

      // 🔹 Điều hướng theo role
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

      if (error.response?.status === 401) {
        setErrorMessage("Email hoặc mật khẩu không đúng. Vui lòng thử lại!");
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "Đăng nhập thất bại. Vui lòng thử lại sau."
        );
      }

      toast.error("Đăng nhập thất bại!");
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      <div className={styles.formHeader}>
        <Title level={2} className={styles.formTitle}>
          Chào mừng trở lại 👋
        </Title>
        <Text className={styles.formSubtitle}>
          Đăng nhập vào tài khoản của bạn để tiếp tục
        </Text>
      </div>

      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          className={styles.errorAlert}
          style={{ marginBottom: "16px" }}
        />
      )}

      <Form
        form={form}
        name="loginForm"
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        size="large"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
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
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu của bạn"
            autoComplete="current-password"
          />
        </Form.Item>

        <div className={styles.formOptions}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <Link to="/forgot-password" className={styles.forgotLink}>
            Quên mật khẩu?
          </Link>
        </div>

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
          <Text>Bạn là thành viên mới? </Text>
          <Link to="/register" className={styles.registerLink}>
            Đăng ký ngay
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
