// Example integration on the Admin side for "Gán Staff".
// Replace 'staff1' with the chosen staff's ID, and map your order fields accordingly.

import orderAssignmentService from "../services/orderAssignmentService";

function handleAssignStaff(order, staffId = "staff1") {
  // Map from your admin order row to the format StaffDashboard expects
  const mapped = {
    orderId: order.id,                 // e.g. "ORD001"
    productName: order.productName,    // e.g. "VinFast VF e34"
    offerPrice: order.offerPrice,      // number
    customerName: order.customerName,  // optional
    customerPhone: order.customerPhone // optional
  };

  orderAssignmentService.assignOrderToStaff(mapped.orderId, staffId, mapped);

  // Optional: toast/notify admin
  // e.g., message.success(`Đã gán đơn ${mapped.orderId} cho Staff ${staffId}`);
}

export { handleAssignStaff };