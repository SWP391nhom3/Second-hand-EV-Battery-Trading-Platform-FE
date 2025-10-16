import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "./register.css";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

function RegisterForm() {
  // để dùng chuyển trang trong react router dom
  const navigate = useNavigate();

  const onFinish = async (values) => {
    // Khi form được gửi thành công, `values` sẽ chứa dữ liệu của form
    // Lưu ý: trường `confirm` sẽ không được gửi đi nếu bạn không dùng nó
    // ở đây, nó chỉ được dùng để validate.
    console.log("Success:", values);
    // Ở đây bạn sẽ gọi API để đăng ký người dùng
    //value ở đây là thông tin user nhập
    try {
      await api.post("register", values);
      toast.success("Successfully create new account");
      navigate("/login");
    } catch (e) {
      //show ra màn hình cho ng dùng biết lỗi
      toast.error(e);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="register-form">
      <h1>Register</h1>
      <Form
        name="register"
        labelCol={{ span: 24 }}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {/* Trường Full Name */}
        <Form.Item
          label="Full Name"
          name="fullname"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input />
        </Form.Item>

        {/* Trường Username */}
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        {/* Trường Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "The input is not valid E-mail!" },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Trường Password */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            // Thêm quy tắc về độ dài, phức tạp... nếu cần
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
          hasFeedback // Hiển thị icon phản hồi
        >
          <Input.Password />
        </Form.Item>

        {/* Trường Confirm Password */}
        <Form.Item
          label="Confirm Password"
          name="confirm"
          dependencies={["password"]} // Thiết lập sự phụ thuộc vào trường `password`
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            // Hàm validator để kiểm tra `confirm` có khớp với `password` không
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        {/* Checkbox "Remember me" */}
        <Form.Item name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        {/* Nút Submit */}
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RegisterForm;
