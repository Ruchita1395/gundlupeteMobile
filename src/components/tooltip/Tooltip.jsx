import React, { useState, useEffect } from "react";
import styles from "./Tooltip.module.css";

function Tooltip({ children, infotext, changeDirection }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={styles["tooltip-container"]}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
       <div className={`${styles["tooltipInfo"]}${changeDirection === "right" ? styles["right"] : ""} `}>
          {infotext}
          <div className={`styles["arrow"] ${changeDirection === "right" ? styles["leftArrow"] : ""} `}></div>
        </div>
      )}
    </div>
  );
}

export default Tooltip;
