import React, { useState } from 'react';
import { CheckCircle, X, Send } from 'lucide-react';
import styles from './SendLinkModal.module.css';

const SendLinkModal = ({ isOpen, onClose, contract, memberType }) => {
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const member = memberType === 'buyer' ? contract.buyer : contract.seller;
  const token = memberType === 'buyer' ? contract.buyer_token : contract.seller_token;
  const link = `${window.location.origin}/fee-selection?token=${token}&type=${memberType}`;

  const handleSend = () => {
    console.log(`Gửi link cho ${member.full_name}:`, link);
    // API: Send SMS/Email
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.mainContent}>
          <div className={styles.headerFlex}>
            <h3 className={styles.headerTitle}>Gửi Link Chọn Phí</h3>
            <button onClick={onClose} className={styles.closeButton}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className={styles.bodyContent}>
            <div className={styles.memberInfoCard}>
              <p className={styles.memberTypeText}>
                <strong className={styles.memberNameBold}>
                  {memberType === 'buyer' ? 'Người mua' : 'Người bán'}:
                </strong> {member.full_name}
              </p>
              <p className={styles.memberContactText}>📞 {member.phone}</p>
              <p className={styles.memberContactText}>📧 {member.email}</p>
            </div>

            <div className={styles.linkCard}>
              <p className={styles.linkCardLabel}>Link chọn phí:</p>
              <div className={styles.linkDisplay}>
                {link}
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
                onClick={handleSend}
                disabled={sent}
                className={`${styles.sendButton} ${
                  sent ? styles.sendButtonSent : styles.sendButtonActive
                }`}
              >
                {sent ? (
                  <>
                    <CheckCircle className={styles.sendButtonIcon} />
                    Đã gửi!
                  </>
                ) : (
                  <>
                    <Send className={styles.sendButtonIcon} />
                    Gửi qua Email & SMS
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendLinkModal;
