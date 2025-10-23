import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomePage, LoginPage, RegisterPage, ProductsPage } from "./pages";
import Dashboard from "./components/dashboard/Dashboard";
import ProductDetailPage from "./pages/product-detail/ProductDetailPage";
import PackagesPage from "./pages/packages/PackagesPage";
import PaymentPage from "./pages/payment/PaymentPage";
import CustomerPage from "./pages/customer/CustomerPage";
import HomeStaff from "./pages/Staff/HomeStaff";

function App() {
  const router = createBrowserRouter([
    //đường dẫn của react router dom
    {
      path: "/",
      element: <HomePage />,
      errorElement: <div>Something went wrong!</div>, // Thêm error handling
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
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/customer",
      element: <CustomerPage />,
    },
    {
      path: "/staff",
      element: <HomeStaff />,
    },
    {
      path: "*",
      element: <div>404 - Page Not Found</div>,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
