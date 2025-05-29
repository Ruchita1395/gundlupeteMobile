import React from "react";
import styles from "./Footer.module.css"; 

function Footer() {
  return (
    <div className={styles.footer}>
      <div>
        <div className={styles.about}>
          <h4>About RevoNext</h4>
          <p> RevoNext is a technology-driven and customer-focused organziation providing innovative solutions for water and wastewater treatment </p>
        </div>
        <div className={styles.contact}>
            <h4>Contact Us</h4>
            <p> Regd:002,Krrish Club Residency,Club Road, Belgavi.590001</p>
        </div>
      </div>
      <div className={styles.copyright}>
        <span>©2023 RevoNext Waters. All rights reserved </span>
      </div>
    </div>
  );
} 

export default Footer;
