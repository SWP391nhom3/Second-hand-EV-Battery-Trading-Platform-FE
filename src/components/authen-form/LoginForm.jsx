import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "./login.css";
import api from "../../configs/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
//login form theo mẫu antd

function LoginForm() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      await api.post("login", values);
      //chuyển trang
      navigate("/");
    } catch (e) {
      // toast.error(e);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="login-form">
      <h1>Login</h1>
      <Form
        name="basic"
        labelCol={{ span: 24 }}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginForm;
