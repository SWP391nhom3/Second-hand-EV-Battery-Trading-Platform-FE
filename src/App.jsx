import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomePage, LoginPage, RegisterPage, ProductsPage } from "./pages";
import Dashboard from "./components/dashboard/Dashboard";
import ProductDetailPage from "./pages/product-detail/ProductDetailPage";
import PaymentPage from "./pages/payment/PaymentPage";
import CustomerPage from "./pages/customer/CustomerPage";

function App() {
  const router = createBrowserRouter([
    //đường dẫn của react router dom
    {
      path: "/",
      element: <HomePage />,
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
      path: "/payment",
      element: <PaymentPage />,
    },
    {
      path: "/customer",
      element: <CustomerPage />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
