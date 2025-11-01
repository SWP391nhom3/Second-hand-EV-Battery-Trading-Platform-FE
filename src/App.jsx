import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomePage, LoginPage, RegisterPage, ProductsPage } from "./pages";
import Dashboard from "./components/dashboard/Dashboard";
import ProductDetailPage from "./pages/product-detail/ProductDetailPage";
import PackagesPage from "./pages/packages/PackagesPage";
import PaymentPage from "./pages/payment/PaymentPage";
import CustomerPage from "./pages/customer/CustomerPage";
import StaffPage from "./pages/staff/StaffPage";
import AdminPage from "./pages/admin/AdminPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Đảm bảo import CSS

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      errorElement: <div>Something went wrong!</div>,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/products",
      element: <ProductsPage />,
    },
    {
      path: "/product/:id",
      element: <ProductDetailPage />,
    },
    {
      path: "/packages",
      element: <PackagesPage />,
    },
    {
      path: "/payment",
      element: <PaymentPage />,
    },
    {
      path: "/admin",
      element: <AdminPage />,
    },
    {
      path: "/customer",
      element: <CustomerPage />,
    },
    {
      path: "/staff",
      element: <StaffPage />,
    },
    {
      path: "*",
      element: <div>404 - Page Not Found</div>,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      {/* ĐƯA TOASTCONTAINER VÀO ĐÂY */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
