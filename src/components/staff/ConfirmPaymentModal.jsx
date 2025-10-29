import React from 'react';
import { AlertCircle, Check, X } from 'lucide-react';
import styles from './ConfirmPaymentModal.module.css';

const ConfirmPaymentModal = ({ isOpen, onClose, onConfirm, contract, buyerTotal, sellerTotal }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.mainContent}>
          <div className={styles.headerFlex}>
            <div className={styles.iconContainer}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className={styles.title}>Xác Nhận Thanh Toán</h3>
          </div>

          <div className={`${styles.bodyText} space-y-4 mb-6`}>
            <p>Bạn có chắc chắn muốn xác nhận thanh toán cho hợp đồng này không?</p>
            
            <div className={styles.summaryCard}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Hợp đồng:</span>
                <span className={styles.summaryValue}>{contract.construct_id}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Người mua trả:</span>
                <span className={`${styles.summaryValue} ${styles.summaryValueGreen}`}>{buyerTotal.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Người bán trả:</span>
                <span className={`${styles.summaryValue} ${styles.summaryValuePurple}`}>{sellerTotal.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>

            <div className={styles.warningCard}>
              <p className={styles.warningText}>
                ⚠️ Sau khi xác nhận, hợp đồng sẽ chuyển sang trạng thái "Hoàn thành" và không thể chỉnh sửa.
              </p>
            </div>
          </div>

          <div className={styles.footerButtons}>
            <button
              onClick={onClose}
              className={styles.cancelButton}
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className={styles.confirmButton}
            >
              Xác Nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPaymentModal;
