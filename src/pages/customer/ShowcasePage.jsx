import React from "react";
import { Header, Footer } from "../../components/layout";
import CustomerShowcase from "../../components/customer/CustomerShowcase";

const ShowcasePage = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1 }}>
        <CustomerShowcase />
      </div>
      <Footer />
    </div>
  );
};

export default ShowcasePage;
