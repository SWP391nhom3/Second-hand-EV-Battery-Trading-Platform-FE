import React from "react";

import StaffDashboard from "../../components/staff/StaffDashboard";

const StaffPage = () => {
  return (
    <div className="staff-page-container">
      
      <main className="flex-1">
        <StaffDashboard />
      </main>
      
    </div>
  );
};

export default StaffPage;
