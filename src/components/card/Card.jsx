import React from "react";
import styles from "./Card.module.css";

function Card({ pipeData, mqttData, lastUpdatedTime }) {
  const [showDetails, setShowDetails] = React.useState(true);
  const [expandedSections, setExpandedSections] = React.useState({
    outlet: true,
    inlet: true
  });

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
        water level : {mqttData?.iotData?.data?.io?.s1 || 0}
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
                  <div>
                    {pipeData?.outlet?.pump1 && (
                      <p>{pipeData.outlet.pump1.name}</p>
                    )}
                    {pipeData?.outlet?.pump2 && (
                      <p>{pipeData.outlet.pump2.name}</p>
                    )}
                  </div>
                )}

                {pipeData?.outlet?.sensors && pipeData.outlet.sensors.length > 0 && (
                  <div>
                    <p style={{ marginBottom: '0.5rem' }}>Sensors Attachment:</p>
                    {pipeData.outlet.sensors.map((ele, index) => {
                      const sensorKey = Object.keys(ele)[0];
                      const sensor = ele[sensorKey];
                      return (
                        <div key={index} style={{ marginLeft: '0.5rem' }}>
                          <p>{sensor.name}</p>
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
