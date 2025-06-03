import React from "react";
import styles from "./Card.module.css";

function Card({ pipeData, mqttData, lastUpdatedTime, mqttInletData, sensorMbrdata }) {
  const [showDetails, setShowDetails] = React.useState(true);
  const [expandedSections, setExpandedSections] = React.useState({
    outlet: true,
    inlet: true
  });
  let waterLevel = mqttInletData?.iotData?.data?.io?.s1 ? mqttInletData?.iotData?.data?.io?.s1 : mqttData?.iotData?.data?.io?.s1;
  const waterLevelUnits = pipeData?.Levelsensor?.units;
  
  if (waterLevel == undefined) {
    waterLevel = 0.0
  }

  function toggleSection(section) {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }

  function checkStatus(pumpData) {
    const source = pumpData?.mqtt?.source;
    const dataSource = pumpData?.mqtt?.dataSource;
    const level = pumpData?.mqtt?.level;
    const variableNames = pumpData?.mqtt?.variableName;
    let modbusData;
    switch (source) {
      case 'mbrMqtt':
        modbusData = sensorMbrdata?.iotData?.data?.[dataSource]?.[level];
        break;
      case 'wtpInletMqtt':
        modbusData = mqttInletData?.iotData?.data?.[dataSource]?.[level];
        break;
      default:
        modbusData = mqttData?.iotData?.data?.[dataSource]?.[level];
        break;
    }

    const values = variableNames.map(
      (varName) => modbusData?.[varName] ?? 0.0
    );
    return values[0] > 0 ? true : false;
  }

  function getSensorMqttInfo(sensor) {
    const mqttInfo = sensor?.mqtt || {};
    const variableNames = mqttInfo?.variableName || [];
    const dataSource = mqttInfo?.dataSource;
    const level = mqttInfo?.level || "0";
    let modbusData;
    switch (mqttInfo["source"]) {
      case 'wtpInletMqtt':
        modbusData = mqttInletData?.iotData?.data?.[dataSource]?.[level];
        break;
      case 'mbrMqtt':
        modbusData = sensorMbrdata?.iotData?.data?.[dataSource]?.[level];
        break;
      default:
        modbusData = mqttData?.iotData?.data?.[dataSource]?.[level];
        break;
    }
    const values = variableNames.map(
      (varName) => modbusData?.[varName] ?? 0.0
    );
    return values;
  }

  const renderPumpStatus = (pumpData) => {
    // const isOn = mqttValue === 1 || mqttValue === true;
    const isOn = checkStatus(pumpData);
    return (
      <div className={styles.pumpStatus}>
        <span className={`${styles.statusIndicator} ${isOn ? styles.statusOn : styles.statusOff}`}></span>
        <span>{pumpData.name}</span>
      </div>
    );
  };


  const renderWaterFlow = (sensors) => {
    let isOn = true;
    if (sensors && sensors.length > 0) {
      sensors.map((ele, index) => {
        const sensorKey = Object.keys(ele)[0];
        if (sensorKey == "magneticFlowMeter") {
          const sensor = ele[sensorKey];
          const units = sensor?.unit || [];
          const values = getSensorMqttInfo(sensor);

          isOn = values[0] > 0 ? true : false;
        }
      })
    }
    return (
      <div className={styles.pumpStatus}>
        <span className={`${styles.statusIndicator} ${isOn ? styles.statusOn : styles.statusOff}`}></span>
        <span>Water Flow</span>
      </div>
    );
  };

  return (
    <div className={`${styles.card} ${styles["card-1"]}`}>
      <p className={styles.tankTitle}>{pipeData?.tankExtraDetails?.tankName}</p>
      <p className={styles.waterLevel}>
        water level : <b>{waterLevel} {waterLevelUnits}</b>
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
                {/* <div className={styles.outlet}>
                  <span>Attachment Position</span>
                  <span className={styles.position}>
                    {pipeData.outlet.attachmentPosition}
                  </span>
                </div>
                <div className={styles.outlet}>
                  <span>Attachment Direction</span>
                  <span className={styles.position}>
                    {pipeData.outlet.attachmentDirection}
                  </span>
                </div>
                {pipeData?.outlet?.pump1 && renderPumpStatus(
                  pipeData.outlet.pump1
                )}
                {pipeData?.outlet?.pump2 && renderPumpStatus(
                  pipeData.outlet.pump2
                )} */}
                {renderWaterFlow(pipeData?.outlet?.sensors)}

                {pipeData?.outlet?.sensors && pipeData.outlet.sensors.length > 0 && (
                  <div className={styles.sensorInfo}>
                    <p className={styles.sensorHead}>Sensors Attached:</p>
                    {pipeData.outlet.sensors.map((ele, index) => {
                      // debugger;
                      const sensorKey = Object.keys(ele)[0];
                      const sensor = ele[sensorKey];
                      const units = sensor?.unit || [];
                      const values = getSensorMqttInfo(sensor);
                      return (
                        <div key={index} style={{ marginLeft: '0.5rem' }} className={styles.sensorMain}>
                          <p>{sensor.name}</p>
                          {(() => {
                            if (sensorKey === 'magneticFlowMeter') return <div className={styles.magneticFlowmeterSensor}><div><span>CF:</span> <span><b>{values[0]}</b> {units[0]}</span></div><div><span>TF:</span> <span><b>{values[1]}</b> {units[1]}</span></div></div>;
                            if (sensorKey !== 'magneticFlowMeter') return <div className={styles.otherSensor}><span><b>{values[0]}</b> {units}</span></div>;
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
                {/* <div className={styles.inlet}>
                  <span>Position</span>
                  <span className={styles.position}>
                    {pipeData.inlet.attachmentPosition}
                  </span>
                </div>
                {pipeData?.inlet?.pump1 && renderPumpStatus(
                  pipeData.inlet.pump1
                )}
                {pipeData?.inlet?.pump2 && renderPumpStatus(
                  pipeData.inlet.pump2
                )} */}
                {renderWaterFlow(pipeData?.inlet?.sensors)}
                {pipeData?.inlet?.sensors && pipeData.inlet.sensors.length > 0 && (
                  <div className={styles.sensorInfo}>
                    <p className={styles.sensorHead}>Sensors Attachment:</p>
                    {pipeData.inlet.sensors.map((ele, index) => {
                      // debugger;
                      const sensorKey = Object.keys(ele)[0];
                      const sensor = ele[sensorKey];
                      const units = sensor?.unit || [];
                      const values = getSensorMqttInfo(sensor);
                      return (
                        <div key={index} style={{ marginLeft: '0.5rem' }} className={styles.sensorMain}>
                          <p>{sensor.name}</p>
                          {(() => {
                            if (sensorKey === 'magneticFlowMeter') return <div className={styles.magneticFlowmeterSensor}><div><span>CF:</span> <span><b>{values[0]}</b> {units[0]}</span></div><div><span>TF:</span> <span><b>{values[1]}</b> {units[1]}</span></div></div>;
                            if (sensorKey !== 'magneticFlowMeter') return <div className={styles.otherSensor}><span><b>{values[0]}</b> {units}</span></div>;
                          })()}
                        </div>
                      );
                    })}
                  </div>
                )}
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
