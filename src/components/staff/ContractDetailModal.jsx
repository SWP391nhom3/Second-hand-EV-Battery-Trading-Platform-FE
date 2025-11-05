import React from 'react';
import { Check, X, Car, User, FileText, DollarSign, CheckCircle, Clock, AlertCircle, ChevronRight, Package, Shield, Truck, Clipboard, Edit, Send, Search, Filter, Download, Calendar, Phone, Mail, MapPin, Home } from 'lucide-react';
import styles from './ContractDetailModal.module.css';

const ContractDetailModal = ({ isOpen, onClose, contract, constructFees, serviceFees, calculateFeeAmount }) => {
  if (!isOpen || !contract) return null;

  const currentFees = constructFees[contract.construct_id] || { buyer: [], seller: [] };
  
  const buyerTotal = serviceFees
    .filter(f => currentFees.buyer.includes(f.service_fee_id))
    .reduce((sum, f) => sum + calculateFeeAmount(f, contract.vehicle.price), 0);
  
  const sellerTotal = serviceFees
    .filter(f => currentFees.seller.includes(f.service_fee_id))
    .reduce((sum, f) => sum + calculateFeeAmount(f, contract.vehicle.price), 0);

  const totalFees = buyerTotal + sellerTotal;
  const finalBuyerAmount = contract.vehicle.price + buyerTotal;
  const finalSellerAmount = contract.vehicle.price - sellerTotal;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerFlex}>
            <div>
              <h2 className={styles.headerTitle}>HỢP ĐỒNG THANH TOÁN</h2>
              <p className={styles.headerSubtitle}>Mã hợp đồng: {contract.construct_id}</p>
            </div>
            <button onClick={onClose} className={styles.closeButton}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className={styles.mainContent}>
          {/* Thông tin xe */}
          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>
              <Car className="w-5 h-5" />
              THÔNG TIN XE
            </h3>
            <div className={styles.vehicleInfoGrid}>
              <div>
                <p className={styles.vehicleInfoItemLabel}>Tên xe</p>
                <p className={styles.vehicleInfoItemValue}>{contract.vehicle.name}</p>
              </div>
              <div>
                <p className={styles.vehicleInfoItemLabel}>Biển số</p>
                <p className={styles.vehicleInfoItemValue}>{contract.vehicle.licensePlate}</p>
              </div>
              <div>
                <p className={styles.vehicleInfoItemLabel}>Năm sản xuất</p>
                <p className={styles.vehicleInfoItemValue}>{contract.vehicle.year}</p>
              </div>
              <div>
                <p className={styles.vehicleInfoItemLabel}>Hãng xe</p>
                <p className={styles.vehicleInfoItemValue}>{contract.vehicle.brand}</p>
              </div>
              <div>
                <p className={styles.vehicleInfoItemLabel}>Model</p>
                <p className={styles.vehicleInfoItemValue}>{contract.vehicle.model}</p>
              </div>
              <div>
                <p className={styles.vehicleInfoItemLabel}>Số km đã đi</p>
                <p className={styles.vehicleInfoItemValue}>
                  {contract.vehicle.mileage
                    ? contract.vehicle.mileage.toLocaleString("vi-VN")
                    : "0"}{" "}
                  km
                </p>
              </div>
            </div>
            <div className={styles.priceSection}>
              <div className={styles.priceFlex}>
                <span className={styles.priceLabel}>Giá trị xe:</span>
                <span className={styles.priceValue}>
                  {contract.vehicle.price
                    ? contract.vehicle.price.toLocaleString("vi-VN")
                    : "0"}{" "}
                  ₫
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin người mua và người bán */}
          <div className={styles.memberInfoGrid}>
            {/* Người mua */}
            <div className={styles.buyerCard}>
              <h3 className={`${styles.memberCardTitle} ${styles.buyerCardTitle}`}>
                <User className="w-5 h-5" />
                BÊN MUA
              </h3>
              <div className={styles.memberDetails}>
                <div className={styles.memberAvatarContainer}>
                  <img src={contract.buyer.avatar_url} alt="" className={`${styles.memberAvatar} border-green-300`} />
                  <div>
                    <p className={styles.memberName}>{contract.buyer.full_name}</p>
                    <p className={styles.memberId}>ID: {contract.buyer.member_id}</p>
                  </div>
                </div>
                <div className={styles.memberContactItem}>
                  <Phone className={styles.memberContactIcon} />
                  <span className={styles.memberContactText}>{contract.buyer.phone}</span>
                </div>
                <div className={styles.memberContactItem}>
                  <Mail className={styles.memberContactIcon} />
                  <span className={styles.memberContactText}>{contract.buyer.email}</span>
                </div>
                <div className={`${styles.memberContactItem} ${styles.memberAddressIcon}`}>
                  <MapPin className={`${styles.memberContactIcon} ${styles.memberAddressIcon}`} />
                  <span className={styles.memberContactText}>{contract.buyer.address}</span>
                </div>
              </div>
            </div>

            {/* Người bán */}
            <div className={styles.sellerCard}>
              <h3 className={`${styles.memberCardTitle} ${styles.sellerCardTitle}`}>
                <User className="w-5 h-5" />
                BÊN BÁN
              </h3>
              <div className={styles.memberDetails}>
                <div className={styles.memberAvatarContainer}>
                  <img src={contract.seller.avatar_url} alt="" className={`${styles.memberAvatar} ${styles.sellerAvatar}`} />
                  <div>
                    <p className={styles.memberName}>{contract.seller.full_name}</p>
                    <p className={styles.memberId}>ID: {contract.seller.member_id}</p>
                  </div>
                </div>
                <div className={styles.memberContactItem}>
                  <Phone className={styles.memberContactIcon} />
                  <span className={styles.memberContactText}>{contract.seller.phone}</span>
                </div>
                <div className={styles.memberContactItem}>
                  <Mail className={styles.memberContactIcon} />
                  <span className={styles.memberContactText}>{contract.seller.email}</span>
                </div>
                <div className={`${styles.memberContactItem} ${styles.memberAddressIcon}`}>
                  <MapPin className={`${styles.memberContactIcon} ${styles.memberAddressIcon}`} />
                  <span className={styles.memberContactText}>{contract.seller.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng phí */}
          <div className={styles.feeTableContainer}>
            <div className={styles.feeTableHeaderWrapper}>
              <h3 className={styles.feeTableTitle}>CHI TIẾT CÁC KHOẢN PHÍ</h3>
            </div>
            <table className={styles.feeTableActual}>
              <thead className={styles.feeTableHead}>
                <tr>
                  <th className={styles.feeTableTh}>Loại phí</th>
                  <th className={`${styles.feeTableTh} ${styles.feeTableThRight}`}>Số tiền</th>
                  <th className={`${styles.feeTableTh} ${styles.feeTableThCenter} ${styles.feeTableThGreen}`}>Người mua</th>
                  <th className={`${styles.feeTableTh} ${styles.feeTableThCenter} ${styles.feeTableThPurple}`}>Người bán</th>
                </tr>
              </thead>
              <tbody className={styles.feeTableBody}>
                {serviceFees.map(fee => {
                  const amount = calculateFeeAmount(fee, contract.vehicle.price);
                  const Icon = fee.icon;
                  const buyerPays = currentFees.buyer.includes(fee.service_fee_id);
                  const sellerPays = currentFees.seller.includes(fee.service_fee_id);
                  
                  return (
                    <tr key={fee.service_fee_id} className={styles.feeTableRow}>
                      <td className={styles.feeTableCell}>
                        <div className={styles.feeItemContainer}>
                          <Icon className={styles.feeItemIcon} />
                          <span className={styles.feeItemName}>{fee.name}</span>
                        </div>
                      </td>
                      <td className={`${styles.feeTableCell} ${styles.feeItemAmount}`}>
                        {(amount || 0).toLocaleString('vi-VN')} ₫
                      </td>
                      <td className={styles.feeTableCell}>
                        {buyerPays && <Check className={styles.checkIconAuto} />}
                      </td>
                      <td className={styles.feeTableCell}>
                        {sellerPays && <Check className={styles.checkIconAuto} />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tổng kết thanh toán */}
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>TỔNG KẾT THANH TOÁN</h3>
            <div className={styles.mainContent}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Giá trị xe:</span>
                <span className={styles.summaryValue}>
                  {(contract.vehicle.price || 0).toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Tổng phí:</span>
                <span className={styles.summaryValue}>
                  {(totalFees || 0).toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <div className={styles.summarySeparator}>
                <div className={styles.finalAmountBuyer}>
                  <span className={styles.finalAmountLabelBuyer}>Người mua phải trả:</span>
                  <span className={styles.finalAmountValueBuyer}>
                    {(finalBuyerAmount || 0).toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <p className={styles.subTextRight}>
                  (Giá xe {(contract.vehicle.price || 0).toLocaleString('vi-VN')} ₫ + Phí{" "}
                  {(buyerTotal || 0).toLocaleString('vi-VN')} ₫)
                </p>
              </div>
              <div className={styles.finalAmountSeller}>
                <div className={styles.finalAmountBuyer}>
                  <span className={styles.finalAmountLabelSeller}>Người bán nhận được:</span>
                  <span className={styles.finalAmountValueSeller}>
                    {(finalSellerAmount || 0).toLocaleString('vi-VN')} ₫
                  </span>
                </div>
                <p className={styles.subTextRight}>
                  (Giá xe {(contract.vehicle.price || 0).toLocaleString('vi-VN')} ₫ - Phí{" "}
                  {(sellerTotal || 0).toLocaleString('vi-VN')} ₫)
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footerButtons}>
            <button
              onClick={onClose}
              className={styles.closeModalButton}
            >
              Đóng
            </button>
            <button className={styles.downloadButton}>
              <Download className={styles.downloadButtonSvg} />
              Tải hợp đồng PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailModal;
