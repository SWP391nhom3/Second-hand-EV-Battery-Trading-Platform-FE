import React from "react";
import "./authen-template.css";
import LoginForm from "../authen-form/LoginForm";
import RegisterForm from "../authen-form/RegisterForm";
function AuthenTemplate({ isLogin }) {
  return (
    <div className="authen-template">
      <div className="authen-template_form">
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>

      <div className="authen-template_img"></div>
    </div>
  );
}

export default AuthenTemplate;
