import React, { useState } from 'react';
import { Check, X, Car, User } from 'lucide-react';
import styles from './FeeSelection.module.css';

const FeeSelectionModal = ({ isOpen, onClose, contract, memberType, onSave, currentSelections, serviceFees, calculateFeeAmount }) => {
  const [selectedFees, setSelectedFees] = useState(currentSelections || []);

  if (!isOpen) return null;

  const member = memberType === 'buyer' ? contract.buyer : contract.seller;
  const isBuyer = memberType === 'buyer';

  const toggleFee = (serviceFeeId) => {
    setSelectedFees(prev => 
      prev.includes(serviceFeeId) 
        ? prev.filter(id => id !== serviceFeeId)
        : [...prev, serviceFeeId]
    );
  };

  const handleSave = () => {
    const constructFeeData = selectedFees.map(serviceFeeId => {
      const fee = serviceFees.find(f => f.service_fee_id === serviceFeeId);
      return {
        construct_id: contract.construct_id,
        member_id: member.member_id,
        service_fee_id: serviceFeeId,
        fee: calculateFeeAmount(fee, contract.vehicle.price)
      };
    });
    
    onSave(constructFeeData);
    onClose();
  };

  const totalAmount = serviceFees
    .filter(f => selectedFees.includes(f.service_fee_id))
    .reduce((sum, f) => sum + calculateFeeAmount(f, contract.vehicle.price), 0);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={`${styles.header} ${isBuyer ? styles.headerBuyer : styles.headerSeller}`}>
          <div className={styles.headerFlex}>
            <div>
              <h2 className={styles.headerTitle}>
                {isBuyer ? '🚗 Chọn Phí - Người Mua' : '💼 Chọn Phí - Người Bán'}
              </h2>
              <p className={styles.headerSubtitle}>Hợp đồng #{contract.construct_id}</p>
            </div>
            <button onClick={onClose} className={styles.closeButton}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.memberInfoCard}>
            <div className={styles.memberInfoFlex}>
              <User className={`${styles.memberIcon} ${isBuyer ? styles.memberIconBuyer : styles.memberIconSeller}`} />
              <div>
                <p className={styles.memberName}>{member.full_name}</p>
                <p className={styles.memberContact}>{member.phone} • {member.email}</p>
              </div>
            </div>
          </div>

          <div className={styles.vehicleInfoCard}>
            <div className={styles.vehicleInfoFlex}>
              <div className={styles.vehicleDetailsLeft}>
                <Car className={styles.vehicleIcon} />
                <div>
                  <p className={styles.vehicleName}>{contract.vehicle.name}</p>
                  <p className={styles.vehicleLicensePlate}>Biển số: {contract.vehicle.licensePlate}</p>
                </div>
              </div>
              <div className={styles.vehiclePriceRight}>
                <p className={styles.vehiclePriceLabel}>Giá trị xe</p>
                <p className={styles.vehiclePriceValue}>{contract.vehicle.price.toLocaleString('vi-VN')} ₫</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className={styles.feeSelectionSectionTitle}>Chọn các khoản phí bạn muốn thanh toán:</h3>
            <div className={styles.feeSelectionItems}>
              {serviceFees.map(fee => {
                const feeAmount = calculateFeeAmount(fee, contract.vehicle.price);
                const Icon = fee.icon;
                const isSelected = selectedFees.includes(fee.service_fee_id);
                
                return (
                  <div
                    key={fee.service_fee_id}
                    onClick={() => toggleFee(fee.service_fee_id)}
                    className={`${styles.feeItemCard} ${
                      isSelected
                        ? isBuyer
                          ? styles.feeItemCardSelectedBuyer
                          : styles.feeItemCardSelectedSeller
                        : ''
                    }`}
                  >
                    <div className={styles.feeItemFlex}>
                      <div className={styles.feeItemLeft}>
                        <div className={`${styles.checkbox} ${
                          isSelected
                            ? isBuyer
                              ? styles.checkboxSelectedBuyer
                              : styles.checkboxSelectedSeller
                            : ''
                        }`}>
                          {isSelected && <Check className={styles.checkboxIcon} />}
                        </div>
                        <div className={`${styles.feeIconWrapper} ${
                          isSelected
                            ? isBuyer
                              ? styles.feeIconWrapperSelectedBuyer
                              : styles.feeIconWrapperSelectedSeller
                            : styles.feeIconWrapperDefault
                        }`}>
                          <Icon className={`${styles.feeIcon} ${isSelected ? isBuyer ? styles.feeIconSelectedBuyer : styles.feeIconSelectedSeller : styles.feeIconDefault}`} />
                        </div>
                        <div className={styles.feeTextContent}>
                          <p className={styles.feeName}>{fee.name}</p>
                          <p className={styles.feeDescription}>{fee.description}</p>
                          {fee.percentage && (
                            <p className={styles.feePercentageHint}>{fee.percentage}% giá trị xe</p>
                          )}
                        </div>
                      </div>
                      <div className={styles.feeAmountRight}>
                        <p className={styles.feeAmountValue}>{feeAmount.toLocaleString('vi-VN')} ₫</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${styles.totalAmountCard} ${isBuyer ? styles.totalAmountCardBuyer : styles.totalAmountCardSeller}`}>
            <div className={styles.totalAmountFlex}>
              <div>
                <p className={styles.totalAmountLabel}>Tổng số tiền thanh toán</p>
                <p className={styles.totalAmountCount}>{selectedFees.length} khoản phí đã chọn</p>
              </div>
              <p className={`${styles.totalAmountValue} ${isBuyer ? styles.totalAmountValueBuyer : styles.totalAmountValueSeller}`}>
                {totalAmount.toLocaleString('vi-VN')} ₫
              </p>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            onClick={onClose}
            className={styles.cancelButton}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={selectedFees.length === 0}
            className={`${styles.saveButton} ${
              selectedFees.length === 0
                ? styles.saveButtonDisabled
                : isBuyer
                ? styles.saveButtonBuyer
                : styles.saveButtonSeller
            }`}
          >
            Lưu Lựa Chọn
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeSelectionModal;
