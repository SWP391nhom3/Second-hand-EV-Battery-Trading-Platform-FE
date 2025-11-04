import React, { useState } from "react";
import {
  Check,
  X,
  Car,
  User,
  FileText,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Package,
  Shield,
  Truck,
  Clipboard,
  Edit,
  Send,
  Search,
  Filter,
  Download,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Home,
} from "lucide-react";
import ContractDetailModal from "./ContractDetailModal";
import SendLinkModal from "./SendLinkModal";
import FeeSelectionModal from "./FeeSelection";
import ConfirmPaymentModal from "./ConfirmPaymentModal";
import styles from "./StaffDashboard.module.css";

// Mock data với dữ liệu đầy đủ
const mockContracts = [
  {
    construct_id: "CF001",
    vehicle: {
      vehicle_id: "V001",
      name: "VinFast VF8",
      year: 2023,
      price: 850000000,
      licensePlate: "30A-12345",
      brand: "VinFast",
      model: "VF8",
      mileage: 5000,
    },
    buyer: {
      member_id: "B001",
      full_name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "nguyenvana@email.com",
      address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
      avatar_url: "https://i.pravatar.cc/150?img=12",
    },
    seller: {
      member_id: "S001",
      full_name: "Trần Thị B",
      phone: "0907654321",
      email: "tranthib@email.com",
      address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      avatar_url: "https://i.pravatar.cc/150?img=5",
    },
    payment_id: "P001",
    status: "pending_fee_selection",
    created_at: "2024-10-25",
    buyer_token: "buyer_token_abc123",
    seller_token: "seller_token_xyz789",
  },
  {
    construct_id: "CF002",
    vehicle: {
      vehicle_id: "V002",
      name: "Tesla Model 3",
      year: 2022,
      price: 1200000000,
      licensePlate: "29B-67890",
      brand: "Tesla",
      model: "Model 3",
      mileage: 15000,
    },
    buyer: {
      member_id: "B002",
      full_name: "Lê Văn C",
      phone: "0912345678",
      email: "levanc@email.com",
      address: "789 Đường Pasteur, Quận 3, TP.HCM",
      avatar_url: "https://i.pravatar.cc/150?img=33",
    },
    seller: {
      member_id: "S002",
      full_name: "Phạm Thị D",
      phone: "0923456789",
      email: "phamthid@email.com",
      address: "321 Đường Cách Mạng, Quận 10, TP.HCM",
      avatar_url: "https://i.pravatar.cc/150?img=9",
    },
    payment_id: "P002",
    status: "completed",
    created_at: "2024-10-20",
    buyer_token: "buyer_token_def456",
    seller_token: "seller_token_uvw123",
  },
  {
    construct_id: "CF003",
    vehicle: {
      vehicle_id: "V003",
      name: "VinFast VF9",
      year: 2024,
      price: 1500000000,
      licensePlate: "51C-11111",
      brand: "VinFast",
      model: "VF9",
      mileage: 2000,
    },
    buyer: {
      member_id: "B003",
      full_name: "Hoàng Văn E",
      phone: "0934567890",
      email: "hoangvane@email.com",
      address: "555 Đường Võ Văn Tần, Quận 3, TP.HCM",
      avatar_url: "https://i.pravatar.cc/150?img=68",
    },
    seller: {
      member_id: "S003",
      full_name: "Vũ Thị F",
      phone: "0945678901",
      email: "vuthif@email.com",
      address: "888 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
      avatar_url: "https://i.pravatar.cc/150?img=20",
    },
    payment_id: "P003",
    status: "pending_fee_selection",
    created_at: "2024-10-28",
    buyer_token: "buyer_token_ghi789",
    seller_token: "seller_token_rst456",
  },
];

// Danh sách service_fee
const serviceFees = [
  {
    service_fee_id: "SF001",
    name: "Phí giao dịch xe",
    percentage: 5,
    icon: Car,
    description: "Phí dịch vụ môi giới giao dịch xe điện",
  },
  {
    service_fee_id: "SF002",
    name: "Phí vận chuyển",
    fixed_amount: 5000000,
    icon: Truck,
    description: "Chi phí vận chuyển xe đến địa điểm người mua",
  },
  {
    service_fee_id: "SF003",
    name: "Phí nền tảng",
    percentage: 2,
    icon: Package,
    description: "Phí sử dụng nền tảng giao dịch",
  },
  {
    service_fee_id: "SF004",
    name: "Phí đăng kiểm",
    fixed_amount: 3000000,
    icon: Clipboard,
    description: "Chi phí đăng kiểm và kiểm định kỹ thuật",
  },
  {
    service_fee_id: "SF005",
    name: "Phí bảo hiểm chuyển nhượng",
    fixed_amount: 2500000,
    icon: Shield,
    description: "Phí bảo hiểm trong quá trình chuyển nhượng",
  },
];

// Tính giá trị phí
const calculateFeeAmount = (fee, vehiclePrice) => {
  if (fee.percentage) {
    return (vehiclePrice * fee.percentage) / 100;
  }
  return fee.fixed_amount || 0;
};

// Staff Dashboard
const StaffDashboard = () => {
  const [contracts, setContracts] = useState(mockContracts);
  const [selectedContract, setSelectedContract] = useState(mockContracts[0]);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showSendBuyerLink, setShowSendBuyerLink] = useState(false);
  const [showSendSellerLink, setShowSendSellerLink] = useState(false);
  const [showContractDetail, setShowContractDetail] = useState(false);
  const [showConfirmPayment, setShowConfirmPayment] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [constructFees, setConstructFees] = useState({
    CF001: {
      buyer: ["SF001", "SF003"],
      seller: ["SF002", "SF004", "SF005"],
    },
    CF002: {
      buyer: ["SF001", "SF002"],
      seller: ["SF003", "SF004", "SF005"],
    },
    CF003: {
      buyer: ["SF001", "SF003", "SF005"],
      seller: ["SF002", "SF004"],
    },
  });

  const currentConstructFees = constructFees[selectedContract.construct_id] || {
    buyer: [],
    seller: [],
  };

  const handleSaveBuyerFees = (feeData) => {
    console.log("Lưu phí cho Buyer:", feeData);
    setConstructFees((prev) => ({
      ...prev,
      [selectedContract.construct_id]: {
        ...prev[selectedContract.construct_id],
        buyer: feeData.map((f) => f.service_fee_id),
      },
    }));
  };

  const handleSaveSellerFees = (feeData) => {
    console.log("Lưu phí cho Seller:", feeData);
    setConstructFees((prev) => ({
      ...prev,
      [selectedContract.construct_id]: {
        ...prev[selectedContract.construct_id],
        seller: feeData.map((f) => f.service_fee_id),
      },
    }));
  };

  const buyerTotal = serviceFees
    .filter((f) => currentConstructFees.buyer.includes(f.service_fee_id))
    .reduce(
      (sum, f) => sum + calculateFeeAmount(f, selectedContract.vehicle.price),
      0
    );

  const sellerTotal = serviceFees
    .filter((f) => currentConstructFees.seller.includes(f.service_fee_id))
    .reduce(
      (sum, f) => sum + calculateFeeAmount(f, selectedContract.vehicle.price),
      0
    );

  const totalFees = serviceFees.reduce(
    (sum, f) => sum + calculateFeeAmount(f, selectedContract.vehicle.price),
    0
  );

  const pendingContracts = contracts.filter(
    (c) => c.status === "pending_fee_selection"
  ).length;
  const completedContracts = contracts.filter(
    (c) => c.status === "completed"
  ).length;

  const handleConfirmPayment = () => {
    console.log("Xác nhận thanh toán:", {
      payment_id: selectedContract.payment_id,
      construct_id: selectedContract.construct_id,
      buyer_total: buyerTotal,
      seller_total: sellerTotal,
    });

    // Update status
    setContracts((prev) =>
      prev.map((c) =>
        c.construct_id === selectedContract.construct_id
          ? { ...c, status: "completed" }
          : c
      )
    );

    setSelectedContract((prev) => ({ ...prev, status: "completed" }));
    setShowConfirmPayment(false);
  };

  // Filter contracts
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.buyer.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.seller.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.vehicle.licensePlate
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.construct_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || contract.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.staffDashboardContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerFlex}>
            <div>
              <h1 className={styles.headerTitle}>Quản Lý Thanh Toán</h1>
              <p className={styles.headerSubtitle}>Dashboard nhân viên</p>
            </div>
            <div className={styles.staffDashboardBadge}>
              <User className="w-5 h-5" />
              <span className="font-medium">Staff Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Statistics */}
        <div className={styles.statisticsGrid}>
          <div className={styles.statisticCard}>
            <div className={styles.statisticCardContent}>
              <div>
                <p className={styles.statisticLabel}>Tổng hợp đồng</p>
                <p className={styles.statisticValue}>{contracts.length}</p>
              </div>
              <div
                className={`${styles.statisticIconContainer} ${styles.iconBlue}`}
              >
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className={styles.statisticCard}>
            <div className={styles.statisticCardContent}>
              <div>
                <p className={styles.statisticLabel}>Chờ xử lý</p>
                <p
                  className={`${styles.statisticValue} ${styles.statisticValueOrange}`}
                >
                  {pendingContracts}
                </p>
              </div>
              <div
                className={`${styles.statisticIconContainer} ${styles.iconOrange}`}
              >
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className={styles.statisticCard}>
            <div className={styles.statisticCardContent}>
              <div>
                <p className={styles.statisticLabel}>Hoàn thành</p>
                <p
                  className={`${styles.statisticValue} ${styles.statisticValueGreen}`}
                >
                  {completedContracts}
                </p>
              </div>
              <div
                className={`${styles.statisticIconContainer} ${styles.iconGreen}`}
              >
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className={styles.statisticCard}>
            <div className={styles.statisticCardContent}>
              <div>
                <p className={styles.statisticLabel}>Tổng giá trị</p>
                <p
                  className={`${styles.statisticValue} ${styles.statisticValuePurple}`}
                >
                  {(
                    contracts.reduce((sum, c) => sum + c.vehicle.price, 0) /
                    1000000000
                  ).toFixed(1)}
                  B
                </p>
              </div>
              <div
                className={`${styles.statisticIconContainer} ${styles.iconPurple}`}
              >
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contractListAndDetailsGrid}>
          {/* Contract List */}
          <div className={styles.contractListColumn}>
            <div className={styles.contractListBox}>
              <div className={styles.contractListHeader}>
                <h2 className={styles.contractListTitle}>Danh Sách Hợp Đồng</h2>

                {/* Search */}
                <div className={styles.searchContainer}>
                  <Search className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, biển số..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>

                {/* Status Filter */}
                <div className={styles.statusFilterContainer}>
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`${styles.statusButton} ${
                      statusFilter === "all"
                        ? styles.statusButtonAllActive
                        : styles.statusButtonInactive
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setStatusFilter("pending_fee_selection")}
                    className={`${styles.statusButton} ${
                      statusFilter === "pending_fee_selection"
                        ? styles.statusButtonPendingActive
                        : styles.statusButtonInactive
                    }`}
                  >
                    Chờ xử lý
                  </button>
                  <button
                    onClick={() => setStatusFilter("completed")}
                    className={`${styles.statusButton} ${
                      statusFilter === "completed"
                        ? styles.statusButtonCompletedActive
                        : styles.statusButtonInactive
                    }`}
                  >
                    Hoàn thành
                  </button>
                </div>
              </div>

              <div className={styles.contractListItems}>
                {filteredContracts.map((contract) => (
                  <div
                    key={contract.construct_id}
                    onClick={() => setSelectedContract(contract)}
                    className={`${styles.contractListItem} ${
                      selectedContract.construct_id === contract.construct_id
                        ? styles.contractListItemActive
                        : ""
                    }`}
                  >
                    <div className={styles.contractListItemHeader}>
                      <div>
                        <p className={styles.contractId}>
                          {contract.construct_id}
                        </p>
                        <p className={styles.vehicleName}>
                          {contract.vehicle.name}
                        </p>
                        <p className={styles.licensePlate}>
                          {contract.vehicle.licensePlate}
                        </p>
                      </div>
                      <ChevronRight className={styles.chevronIcon} />
                    </div>
                    <div className={styles.contractListItemFooter}>
                      {contract.status === "pending_fee_selection" ? (
                        <span
                          className={`${styles.statusBadge} ${styles.statusBadgePending}`}
                        >
                          Chờ chọn phí
                        </span>
                      ) : (
                        <span
                          className={`${styles.statusBadge} ${styles.statusBadgeCompleted}`}
                        >
                          Hoàn thành
                        </span>
                      )}
                      <span className={styles.createdAt}>
                        {contract.created_at}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className={styles.contractDetailsColumn}>
            {/* Contract Info */}
            <div className={styles.contractInfoBox}>
              <div className={styles.contractInfoHeader}>
                <h2 className={styles.contractInfoTitle}>Thông Tin Hợp Đồng</h2>
                <button
                  onClick={() => setShowContractDetail(true)}
                  className={styles.viewDetailsButton}
                >
                  <FileText className="w-4 h-4" />
                  Xem chi tiết đầy đủ
                </button>
              </div>

              <div className={styles.vehicleInfoGrid}>
                <div className={styles.infoCard}>
                  <div className={styles.infoCardHeader}>
                    <Car className={`${styles.infoCardIconBlue} w-5 h-5`} />
                    <span className={styles.infoCardTitle}>Thông Tin Xe</span>
                  </div>
                  <p className={styles.infoCardTextBold}>
                    {selectedContract.vehicle.name}
                  </p>
                  <p className={styles.infoCardTextSmall}>
                    Năm: {selectedContract.vehicle.year}
                  </p>
                  <p className={styles.infoCardTextSmall}>
                    Biển số: {selectedContract.vehicle.licensePlate}
                  </p>
                  <p className={styles.infoCardPrice}>
                    {selectedContract.vehicle.price.toLocaleString("vi-VN")} ₫
                  </p>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.buyerSellerCardHeader}>
                    <div className={styles.buyerSellerCardTitleContainer}>
                      <User className={`${styles.buyerIcon} w-5 h-5`} />
                      <span className={styles.buyerSellerCardTitle}>
                        Người Mua
                      </span>
                    </div>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => setShowBuyerModal(true)}
                        className={`${styles.actionButton} ${styles.actionButtonEditBuyer}`}
                        title="Chỉnh sửa phí"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowSendBuyerLink(true)}
                        className={`${styles.actionButton} ${styles.actionButtonSend}`}
                        title="Gửi link"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className={styles.infoCardTextBold}>
                    {selectedContract.buyer.full_name}
                  </p>
                  <p className={styles.infoCardTextSmall}>
                    {selectedContract.buyer.phone}
                  </p>
                  <p className={`${styles.infoCardTextSmall} truncate`}>
                    {selectedContract.buyer.email}
                  </p>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.buyerSellerCardHeader}>
                    <div className={styles.buyerSellerCardTitleContainer}>
                      <User className={`${styles.sellerIcon} w-5 h-5`} />
                      <span className={styles.buyerSellerCardTitle}>
                        Người Bán
                      </span>
                    </div>
                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => setShowSellerModal(true)}
                        className={`${styles.actionButton} ${styles.actionButtonEditSeller}`}
                        title="Chỉnh sửa phí"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowSendSellerLink(true)}
                        className={`${styles.actionButton} ${styles.actionButtonSend}`}
                        title="Gửi link"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className={styles.infoCardTextBold}>
                    {selectedContract.seller.full_name}
                  </p>
                  <p className={styles.infoCardTextSmall}>
                    {selectedContract.seller.phone}
                  </p>
                  <p className={`${styles.infoCardTextSmall} truncate`}>
                    {selectedContract.seller.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Fee Distribution Table */}
            <div className={styles.feeDistributionTableContainer}>
              <div className={styles.feeDistributionTableHeader}>
                <h2 className={styles.feeDistributionTableTitle}>
                  Bảng Phân Bổ Chi Phí
                </h2>
              </div>
              <div className={styles.overflowXAuto}>
                <table className={styles.feeTable}>
                  <thead className={styles.feeTableHeader}>
                    <tr>
                      <th className={styles.feeTableHeaderTh}>Loại Phí</th>
                      <th
                        className={`${styles.feeTableHeaderTh} ${styles.feeTableHeaderThRight}`}
                      >
                        Số Tiền
                      </th>
                      <th
                        className={`${styles.feeTableHeaderTh} ${styles.feeTableHeaderThCenter}`}
                      >
                        Người Mua
                      </th>
                      <th
                        className={`${styles.feeTableHeaderTh} ${styles.feeTableHeaderThCenter}`}
                      >
                        Người Bán
                      </th>
                    </tr>
                  </thead>
                  <tbody className={styles.feeTableBody}>
                    {serviceFees.map((fee) => {
                      const feeAmount = calculateFeeAmount(
                        fee,
                        selectedContract.vehicle.price
                      );
                      const Icon = fee.icon;
                      return (
                        <tr
                          key={fee.service_fee_id}
                          className={styles.feeTableRow}
                        >
                          <td className={styles.feeTableCell}>
                            <div className={styles.feeNameContainer}>
                              <div className={styles.feeIconWrapper}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className={styles.feeName}>{fee.name}</p>
                                <p className={styles.feeDescription}>
                                  {fee.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td
                            className={`${styles.feeTableCell} ${styles.feeAmount}`}
                          >
                            {feeAmount.toLocaleString("vi-VN")} ₫
                          </td>
                          <td className={styles.feeTableCell}>
                            {currentConstructFees.buyer.includes(
                              fee.service_fee_id
                            ) ? (
                              <div className={styles.checkIconContainer}>
                                <Check className={styles.checkIcon} />
                              </div>
                            ) : (
                              <div className={styles.xIconContainer}>
                                <X className={styles.xIcon} />
                              </div>
                            )}
                          </td>
                          <td className={styles.feeTableCell}>
                            {currentConstructFees.seller.includes(
                              fee.service_fee_id
                            ) ? (
                              <div className={styles.checkIconContainer}>
                                <Check className={styles.checkIcon} />
                              </div>
                            ) : (
                              <div className={styles.xIconContainer}>
                                <X className={styles.xIcon} />
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className={styles.feeTableFooter}>
                    <tr>
                      <td className={styles.feeTableFooterCell}>TỔNG CỘNG</td>
                      <td
                        className={`${styles.feeTableFooterCell} ${styles.feeTableFooterCellRight}`}
                      >
                        {totalFees.toLocaleString("vi-VN")} ₫
                      </td>
                      <td
                        className={`${styles.feeTableFooterCell} ${styles.feeTableFooterCellCenterGreen}`}
                      >
                        {buyerTotal.toLocaleString("vi-VN")} ₫
                      </td>
                      <td
                        className={`${styles.feeTableFooterCell} ${styles.feeTableFooterCellCenterPurple}`}
                      >
                        {sellerTotal.toLocaleString("vi-VN")} ₫
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Summary */}
            <div className={styles.paymentSummaryGrid}>
              <div className={styles.paymentSummaryCardGreen}>
                <div className={styles.paymentSummaryHeader}>
                  <h3 className={styles.paymentSummaryTitle}>
                    Người Mua Thanh Toán
                  </h3>
                  <DollarSign className={styles.paymentSummaryIcon} />
                </div>
                <p className={styles.paymentSummaryAmount}>
                  {buyerTotal.toLocaleString("vi-VN")} ₫
                </p>
                <p className={styles.paymentSummaryFeeCountGreen}>
                  {currentConstructFees.buyer.length} khoản phí đã chọn
                </p>
              </div>

              <div className={styles.paymentSummaryCardPurple}>
                <div className={styles.paymentSummaryHeader}>
                  <h3 className={styles.paymentSummaryTitle}>
                    Người Bán Thanh Toán
                  </h3>
                  <DollarSign className={styles.paymentSummaryIcon} />
                </div>
                <p className={styles.paymentSummaryAmount}>
                  {sellerTotal.toLocaleString("vi-VN")} ₫
                </p>
                <p className={styles.paymentSummaryFeeCountPurple}>
                  {currentConstructFees.seller.length} khoản phí đã chọn
                </p>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={() => setShowConfirmPayment(true)}
              disabled={selectedContract.status === "completed"}
              className={`${styles.confirmButton} ${
                selectedContract.status === "completed"
                  ? styles.confirmButtonCompleted
                  : styles.confirmButtonActive
              }`}
            >
              {selectedContract.status === "completed" ? (
                <>
                  <CheckCircle className={styles.confirmButtonIcon} />
                  Đã Hoàn Thành
                </>
              ) : (
                <>
                  <CheckCircle className={styles.confirmButtonIcon} />
                  Xác Nhận Thanh Toán
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <FeeSelectionModal
        isOpen={showBuyerModal}
        onClose={() => setShowBuyerModal(false)}
        contract={selectedContract}
        memberType="buyer"
        currentSelections={currentConstructFees.buyer}
        onSave={handleSaveBuyerFees}
        serviceFees={serviceFees}
        calculateFeeAmount={calculateFeeAmount}
      />

      <FeeSelectionModal
        isOpen={showSellerModal}
        onClose={() => setShowSellerModal(false)}
        contract={selectedContract}
        memberType="seller"
        currentSelections={currentConstructFees.seller}
        onSave={handleSaveSellerFees}
        serviceFees={serviceFees}
        calculateFeeAmount={calculateFeeAmount}
      />

      <SendLinkModal
        isOpen={showSendBuyerLink}
        onClose={() => setShowSendBuyerLink(false)}
        contract={selectedContract}
        memberType="buyer"
      />

      <SendLinkModal
        isOpen={showSendSellerLink}
        onClose={() => setShowSendSellerLink(false)}
        contract={selectedContract}
        memberType="seller"
      />

      <ContractDetailModal
        isOpen={showContractDetail}
        onClose={() => setShowContractDetail(false)}
        contract={selectedContract}
        constructFees={constructFees}
        serviceFees={serviceFees}
        calculateFeeAmount={calculateFeeAmount}
      />

      <ConfirmPaymentModal
        isOpen={showConfirmPayment}
        onClose={() => setShowConfirmPayment(false)}
        onConfirm={handleConfirmPayment}
        contract={selectedContract}
        buyerTotal={buyerTotal}
        sellerTotal={sellerTotal}
      />
    </div>
  );
};

export default StaffDashboard;
