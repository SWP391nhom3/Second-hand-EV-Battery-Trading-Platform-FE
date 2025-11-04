import React from "react";
import { Header, Footer } from "../../components/layout";
import { CustomerDashboard } from "../../components/customer";

const CustomerPage = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1 }}>
        <CustomerDashboard />
      </div>
      <Footer />
    </div>
  );
};

export default CustomerPage;
