import React, { useMemo } from "react";
import styles from "./KabiniRever.module.css";
import PipeOutlet from "../pipeOutlet/PipeOutlet";

function KabiniRever({ name, pipeData, mqttData }) {
  const attachmentPositionOutlet =
    pipeData?.outlet?.attachmentPosition || "bottom";
  const pipeOutletWidth = pipeData?.outlet?.pipeLength || "50%";

 const waterflow = useMemo(() => {
      if (!mqttData ) return false;
      return (
       mqttData?.iotData?.data?.modbus[0].flowrate1 > 0 
      );
    }, [mqttData]);
  

  const outletPositionClass = useMemo(() => {
    if (!attachmentPositionOutlet) return "";
    return styles[attachmentPositionOutlet] || "";
  }, [attachmentPositionOutlet]);
  return (
    <>
      <div className={styles["jackwell-container"]}>
        <div className={styles["water-container-tank"]}>
          <h4 className={styles["water-tank-name"]}>{name}</h4>
        </div>

        {/* Outlet Pipe */}
        {pipeData?.outlet && (
          <div
            className={styles["pipe-outlet-container"]}
            style={{ width: pipeOutletWidth }}
          >
            <div
              className={`${styles["pipe-outlet-adjuestment"]} ${outletPositionClass}`}
            >
              <PipeOutlet
                waterOn={waterflow}
                sensorData={pipeData.outlet}
                pipeOutletWidth={pipeOutletWidth}
                outletmqttData={mqttData}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default KabiniRever;
