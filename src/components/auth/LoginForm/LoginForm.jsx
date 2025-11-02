// import React, { useState } from "react";
// import { Button, Checkbox, Form, Input, Typography, Alert } from "antd";
// import { MailOutlined, LockOutlined } from "@ant-design/icons";
// import { useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import api from "../../../configs/axios";
// import styles from "./LoginForm.module.css";

// const { Title, Text } = Typography;

// const LoginForm = () => {
//   const navigate = useNavigate();
//   const [form] = Form.useForm();
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleSubmit = async (values) => {
//     setErrorMessage("");
//     try {
//       // 🔹 Gọi API đăng nhập
//       const response = await api.post("api/Auth/login", {
//         email: values.email,
//         password: values.password,
//       });

//       const data = response.data || {};

//       // 🔹 Lưu thông tin người dùng
//       localStorage.setItem("user", JSON.stringify(data));
//       localStorage.setItem("role", data.role);

//       toast.success("Đăng nhập thành công! 🎉");
//       console.log("Successful login:", data);

//       // Không phải: data.role
//       // 🔹 Điều hướng theo role
//       const role = data.account?.role?.toLowerCase();
//       switch (role) {
//         case "admin":
//           navigate("/admin");
//           break;
//         case "staff":
//           navigate("/staff");
//           break;
//         default:
//           navigate("/");
//           break;
//       }
//     } catch (error) {
//       console.error("Login error:", error);

//       if (error.response?.status === 401) {
//         setErrorMessage("Email hoặc mật khẩu không đúng. Vui lòng thử lại!");
//       } else {
//         setErrorMessage(
//           error.response?.data?.message ||
//             "Đăng nhập thất bại. Vui lòng thử lại sau."
//         );
//       }

//       toast.error("Đăng nhập thất bại!");
//     }
//   };

//   return (
//     <div className={styles.loginFormContainer}>
//       <div className={styles.formHeader}>
//         <Title level={2} className={styles.formTitle}>
//           Chào mừng trở lại 👋
//         </Title>
//         <Text className={styles.formSubtitle}>
//           Đăng nhập vào tài khoản của bạn để tiếp tục
//         </Text>
//       </div>

//       {errorMessage && (
//         <Alert
//           message={errorMessage}
//           type="error"
//           showIcon
//           className={styles.errorAlert}
//           style={{ marginBottom: "16px" }}
//         />
//       )}

//       <Form
//         form={form}
//         name="loginForm"
//         layout="vertical"
//         onFinish={handleSubmit}
//         autoComplete="off"
//         size="large"
//       >
//         <Form.Item
//           label="Email"
//           name="email"
//           rules={[
//             { required: true, message: "Vui lòng nhập email!" },
//             { type: "email", message: "Email không hợp lệ!" },
//           ]}
//         >
//           <Input
//             prefix={<MailOutlined />}
//             placeholder="Nhập email của bạn"
//             autoComplete="email"
//           />
//         </Form.Item>

//         <Form.Item
//           label="Mật khẩu"
//           name="password"
//           rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
//         >
//           <Input.Password
//             prefix={<LockOutlined />}
//             placeholder="Nhập mật khẩu của bạn"
//             autoComplete="current-password"
//           />
//         </Form.Item>

//         <div className={styles.formOptions}>
//           <Form.Item name="remember" valuePropName="checked" noStyle>
//             <Checkbox>Ghi nhớ đăng nhập</Checkbox>
//           </Form.Item>
//           <Link to="/forgot-password" className={styles.forgotLink}>
//             Quên mật khẩu?
//           </Link>
//         </div>

//         <Form.Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             block
//             className={styles.submitButton}
//           >
//             Đăng nhập
//           </Button>
//         </Form.Item>

//         <div className={styles.formFooter}>
//           <Text>Bạn là thành viên mới? </Text>
//           <Link to="/register" className={styles.registerLink}>
//             Đăng ký ngay
//           </Link>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default LoginForm;
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
      const response = await api.post("api/Auth/login", {
        email: values.email,
        password: values.password,
      });

      const data = response.data;

      if (!data.token || !data.account) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      // Lưu đúng thông tin
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.account));
      localStorage.setItem("role", data.account.role || "customer");

      // Cập nhật Header ngay lập tức
      window.dispatchEvent(new Event("authChanged"));

      toast.success("Đăng nhập thành công!");

      // Chuyển hướng theo role
      const role = (data.account.role || "customer").toLowerCase();
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "staff") {
        navigate("/staff");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      setErrorMessage(msg);
      toast.error(msg);
    }
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
