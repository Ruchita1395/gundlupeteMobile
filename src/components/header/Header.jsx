import { React, useEffect, useState } from "react";
import styles from "./Header.module.css";

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);



  return (
    <nav>
      <div className={styles.logo}>
        <figure className={styles.logo} />
        {/* <h1>RevoNext Waters <span>water.......................</span></h1> */}
      </div>
      <div className={styles.header}>
        <h1>RevoNext Online Monitoring Platform </h1>
      </div>
      <div className={styles.date}>
        {/* <li>Time:17.28.00</li> */}
        <li>
          {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </li>
        <li>
          Date:
          {currentTime.toLocaleDateString("en-US", {
            day: "2-digit", // e.g., 07
            month: "2-digit", // e.g., 02 (for February)
            year: "numeric", // e.g., 2025
          })}
        </li>
      </div>
    </nav>
  );
}

export default Header;
