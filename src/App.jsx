import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomePage, LoginPage, RegisterPage, ProductsPage } from "./pages";
import Dashboard from "./components/dashboard/Dashboard";
import ProductDetailPage from "./pages/product-detail/ProductDetailPage";

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
      path: "/dashboard",
      element: <Dashboard />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
