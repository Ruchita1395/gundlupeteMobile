import React from "react";
import styles from "./TankCap.module.css";

function TankCap({ small, extraSmall }) {
  if (small) {
    return (
      <div className={styles["tank-cap-containar-small"]}>
        <div className={styles["tank-cap-small"]}></div>
      </div>
    );
  }

  return (
    <div className={styles["tank-cap-containar"]}>
      <div
        className={extraSmall ? styles["extraSmall"] : styles["tank-cap"]}
      ></div>
    </div>
  );
}

export default TankCap;
