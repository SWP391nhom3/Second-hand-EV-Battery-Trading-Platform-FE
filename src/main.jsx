import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "antd/dist/reset.css"; // Import Ant Design CSS
import "react-toastify/dist/ReactToastify.css"; // Import React Toastify CSS
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <ToastContainer />
  </StrictMode>
);
