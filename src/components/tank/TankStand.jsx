import React from "react";
import styles from "./TankStand.module.css";

function TankStand() {
  return (
    <>
      <div className={styles.base}></div>
      <div className={styles.columnleft}></div>
      <div className={styles.columnright}></div>
    </>
  );
}

export default TankStand;
