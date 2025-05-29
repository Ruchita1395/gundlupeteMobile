import React, { useMemo } from "react";
import PropTypes from "prop-types";
import PipeInlet from "../pipeInlet/PipeInlet";
import styles from "./ClariFlocculator.module.css";

function ClariFlocculator({ waterOn = true, wtpInletData = {} , mqttData }) {
  const attachmentPositionInlet = wtpInletData?.inlet?.attachmentPosition || 'bottom';
  const inletData = wtpInletData?.inlet || {};
  const pipeInletWidth = parseFloat(wtpInletData?.inlet?.pipeLength  || '50%');
  const scale = `scaleX(${pipeInletWidth/100})`
  const inletPositionClass = useMemo(() => {
    if (!attachmentPositionInlet) return '';
    return styles[attachmentPositionInlet] || '';
  }, [attachmentPositionInlet]);

  const hasInletData = !!wtpInletData?.inlet;

  return (
    <div className={styles["clariflocculator-container"]}>
      {hasInletData && (
        <div
          className={styles["pipe-inlet-container"]}
        >
          <div
            className={`${styles["pipe-inlet-adjuestment"]} ${inletPositionClass}`}
            style={{ transform: scale }}
          >
            <PipeInlet waterOn={waterOn} inletData={inletData} inletmqttData={mqttData} />
          </div>
        </div>
      )}
      <div className={styles["clariflocculator-main"]}>
        <div className={styles["box-horizontal"]} >
          <div className={styles["box-black"]} ></div>
        </div>
        
        <div className={styles["triangle-container"]}>
          <div className={styles["triangle"]}>
            <div className={styles["inner-div"]}></div>
          </div>
        </div>

        <p className={styles["clariflocculator-Name"]}>Clariflocculator</p>
       </div> 
       
    </div>
  );
}

ClariFlocculator.propTypes = {
  waterOn: PropTypes.bool,
  wtpInletData: PropTypes.shape({
    inlet: PropTypes.shape({
      attachmentPosition: PropTypes.string,
      pipeLength: PropTypes.string,
      sensors: PropTypes.array
    }),
    outlet: PropTypes.shape({
      attachmentPosition: PropTypes.string
    })
  })
};

export default ClariFlocculator;