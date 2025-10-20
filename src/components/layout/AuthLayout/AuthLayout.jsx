import React from "react";
import styles from "./AuthLayout.module.css";

const AuthLayout = ({ children, title }) => {
  return (
    <div className={styles.authLayout}>
      <div className={styles.authFormContainer}>
        {children}
      </div>
      <div className={styles.authImageContainer}>
        <div className={styles.authOverlay}>
          <h1 className={styles.authTitle}>EV Battery Hub</h1>
          <p className={styles.authSubtitle}>
            Your trusted platform for quality second-hand EV batteries
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
