import React from "react";
import styles from "./Card.module.css";

function Card({ pipeData, mqttData, lastUpdatedTime, mqttInletData, sensorMbrdata }) {
  const [showDetails, setShowDetails] = React.useState(true);
  const [expandedSections, setExpandedSections] = React.useState({
    outlet: true,
    inlet: true
  });
  console.log("sensorMbrdata data........", sensorMbrdata);
  // function toggleDetails() {
  //   setShowDetails(!showDetails);
  // }

  function toggleSection(section) {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }

  return (
    <div className={`${styles.card} ${styles["card-1"]}`}>
      <p className={styles.tankTitle}>{pipeData?.tankExtraDetails?.tankName}</p>
      <p className={styles.waterLevel}>
        water level : {mqttInletData?.iotData?.data?.io?.s1 ? mqttInletData?.iotData?.data?.io?.s1: mqttData?.iotData?.data?.io?.s1}
      </p>

      {(pipeData?.outlet || pipeData?.inlet) && (
        <div className={showDetails ? styles.cardDetails : styles.hide}>
          {pipeData?.outlet && (
            <div className={styles.outletSection}>
              <div 
                className={styles.sectionHeader}
                onClick={() => toggleSection('outlet')}
              >
                <span className={styles.sectionTitle}>Outlet</span>
                <button className={styles.expandButton}>
                  {expandedSections.outlet ? '−' : '+'}
                </button>
              </div>
              
              <div className={`${styles.sectionContent} ${!expandedSections.outlet ? styles.collapsed : ''}`}>
                <div className={styles.outlet}>
                  <span>Position</span>
                  <span className={styles.position}>
                    {pipeData.outlet.attachmentPosition}
                  </span>
                </div>
                
                {(pipeData?.outlet?.pump1 || pipeData?.outlet?.pump2) && (
                  <div className={styles.cardInfo}>
                    {pipeData?.outlet?.pump1 && (
                      <p>{pipeData.outlet.pump1.name}</p>
                    )}
                    {pipeData?.outlet?.pump2 && (
                      <p>{pipeData.outlet.pump2.name}</p>
                    )}
                  </div>
                )}

                {pipeData?.outlet?.sensors && pipeData.outlet.sensors.length > 0 && (
                  <div className={styles.sensorInfo}>
                    <p className={styles.sensorHead}>Sensors Attachment:</p>
                    {pipeData.outlet.sensors.map((ele, index) => {
                      const sensorKey = Object.keys(ele)[0];
                      const sensor = ele[sensorKey];
                      const mqttInfo = sensor?.mqtt || {};
                      const variableNames = mqttInfo?.variableName || [];
                      const units = sensor?.unit || [];
                      const dataSource = mqttInfo?.dataSource;
                      const level = mqttInfo?.level || "0";
                      const modbusData = sensorMbrdata?.iotData?.data?.[dataSource]?.[level];
                      console.log("modbus Data...", modbusData);
                      // const modbusData = mqttData?.iotData?.data?.[dataSource]?.[level];
                      const values = variableNames.map(
                        (varName) => modbusData?.[varName] ?? 0.0
                      );
                      // console.log("modbus data....", modbusData);
                      // const values = variableNames.map(
                      //   (varName) => modbusData?.[varName] ?? 0.0
                      // );
                      // const currentFlow=values[0] ?? 0.0
                      // const totalFlow=values[1] ?? 0.0
                      // const value=values[0] ?? 0.0
                      // const unit=units
                      return (
                        <div key={index} style={{ marginLeft: '0.5rem' }} className={styles.sensorMain}>
                          <p>{sensor.name}</p>
                           {(() => {
                            if (sensorKey === 'magneticFlowMeter') return <div className={styles.magneticFlowmeterSensor}><div><span>CF:</span> <span>{values[0]} {units}</span></div><div><span>TF:</span> <span>{values[1]} {units}</span></div></div>;
                            if (sensorKey !== 'magneticFlowMeter') return <div className={styles.otherSensor}><span>{values[0]} {units}</span></div>;
                          })()}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {pipeData?.inlet && (
            <div className={styles.inletSection}>
              <div 
                className={styles.sectionHeader}
                onClick={() => toggleSection('inlet')}
              >
                <span className={styles.sectionTitle}>Inlet</span>
                <button className={styles.expandButton}>
                  {expandedSections.inlet ? '−' : '+'}
                </button>
              </div>
              
              <div className={`${styles.sectionContent} ${!expandedSections.inlet ? styles.collapsed : ''}`}>
                <div className={styles.inlet}>
                  <span>Position</span>
                  <span className={styles.position}>
                    {pipeData.inlet.attachmentPosition}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {lastUpdatedTime && (
        <p className={styles.update}>Last update: {lastUpdatedTime}</p>
      )}

      {/* <button className={styles.btnDetails} type="button" onClick={toggleDetails}>
        {showDetails ? "Hide Details" : "Show Details"}
      </button> */}
    </div>
  );
}

export default Card;
