import React from "react";
import styles from "./PipeVartical.module.css";

function PipeVartical( waterOn = true) {
  return (
    <div className={styles["pipe-vertical-container"]}>
      <div className={styles["pipe-vertical"]}>
        <div className={waterOn ? styles["pipe-water"] : "hide"}>
          {Array(13)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className={`${styles.rectangle} ${styles.animateStart}`}
              ></div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default PipeVartical;
