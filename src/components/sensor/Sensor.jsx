import React from "react";
import styles from "./Sensor.module.css";

const Sensor = ({ name, image, currentFlow, totalFlow, value, unit }) => {
  if (!name || !image) return null;

  const showFlowmeter =
    name === "magneticFlowMeter" || image.includes("flowmeter.png");

  return (
    <div className={styles["sensor-container"]}>
      {/* Top Section: Flow Data */}
      <div className={styles["sensor-flow"]}>
        {showFlowmeter && (
          <p>
            Current Flow: {currentFlow} {unit[0]}
          </p>
        )}
        {showFlowmeter && (
          <p>
            Total Flow: {totalFlow} {unit[1]}
          </p>
        )}
        {!showFlowmeter && (
          <p>
            {" "}
            {value ? value : 0.0} {unit[0]}
          </p>
        )}
      </div>

      {/* Middle Section: Sensor Image */}
      <div className={styles["sensor-image"]}>
        <img src={image} alt={name} />
      </div>

      {/* Bottom Section: Sensor Name */}
      <div className={styles["sensor-name"]}>
        <h3>{name}</h3>
      </div>
    </div>
  );
};

export default Sensor;
