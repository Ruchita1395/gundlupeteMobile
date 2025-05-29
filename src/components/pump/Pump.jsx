import React from "react";
import styles from "./Pump.module.css";

const Pump = ({ name, image }) => {
  return (
    <div className={styles["pump-container"]}>
      <div className={styles["pump-image"]}>
        <img src={image} alt={name} />
      </div>
      <div className={styles["pump-name"]}>
        <h4>{name}</h4>
      </div>
    </div>
  );
};

export default Pump;
