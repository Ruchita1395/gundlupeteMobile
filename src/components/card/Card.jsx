import React from "react";
import styles from "./Card.module.css";

function Card({ pipeData, mqttData, lastUpdatedTime }) {
  const [showDetails, setShowDetails] = React.useState(false);

  function toggleDetails() {
    setShowDetails(!showDetails);
  }

  return (
    <div className={`${styles.card} ${styles["card-1"]}`}>
      <p className={styles.tankTitle}>{pipeData?.tankExtraDetails?.tankName}</p>
      <p className={styles.waterLevel}>
        water level : {mqttData?.iotData?.data?.io?.s1 || 0}
      </p>

      {(pipeData?.outlet || pipeData?.inlet) && (
        <div className={ showDetails ? styles.cardDetails : styles.hide }>
          {pipeData?.outlet && (
            <div className={styles.outletSection}>
              <p className={styles.outlet}>
                <span>Outlet Attached</span>
                <span className={styles.position}>
                  {pipeData.outlet.attachmentPosition}
                </span>
              </p>
              {pipeData?.outlet?.pump1 && (
                <p>{pipeData?.outlet?.pump1?.name} attached</p>
              )}
              {pipeData?.outlet?.pump2 && (
                <p>{pipeData?.outlet?.pump2?.name} attached</p>
              )}
              {pipeData?.outlet?.sensors && (
                <>
                  <p>Sensor's Attached</p>
                  {pipeData.outlet.sensors.map((ele, index) => {
                    const sensorKey = Object.keys(ele)[0];
                    const sensor = ele[sensorKey];
                    return (
                      <div key={index}>
                        <p>Sensor Name: {sensor.name}</p>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {pipeData?.inlet && (
            <div className={styles.inletSection}>
              <p className={styles.inlet}>
                <span>Inlet Attached</span>
                <span className={styles.position}>
                  {pipeData.outlet.attachmentPosition}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {lastUpdatedTime && (
        <p className={styles.update}>Last update: {lastUpdatedTime}</p>
      )}

      <button className={styles.btnDetails} type="button" onClick={toggleDetails}>
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
    </div>
  );
}

export default Card;
