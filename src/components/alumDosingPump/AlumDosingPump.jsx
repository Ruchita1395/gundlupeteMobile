import React, { useMemo } from "react";
import PipeInlet from "../pipeInlet/PipeInlet";
import PipeOutlet from "../pipeOutlet/PipeOutlet";
import PipeVartical from "../pipeVartical/PipeVartical";
import styles from "./AlumDosingPump.module.css";

function AlumDosingPump({ waterOn = false, alumDosingPump = {} }) {

  const attachmentPositionInlet =
    alumDosingPump?.inlet?.attachmentPosition || "bottom";
  const attachmentPositionOutlet =
    alumDosingPump?.outlet?.attachmentPosition || "bottom";
  const pipeInletWidth = parseFloat(alumDosingPump?.inlet?.pipeLength || "50%");
  const pipeOutletWidth = parseFloat(
    alumDosingPump?.outlet?.pipeLength || "50%"
  );

  const scale = `scaleX(${pipeInletWidth / 100})`;
  const hasInletData = !!alumDosingPump?.inlet;
  const hasOutletData = !!alumDosingPump?.outlet;

  const inletPositionClass = useMemo(() => {
    if (!attachmentPositionInlet) return "";
    return styles[attachmentPositionInlet] || "";
  }, [attachmentPositionInlet]);

  // Generate CSS class for outlet pipe position
  const outletPositionClass = useMemo(() => {
    if (!attachmentPositionOutlet) return "";
    return styles[attachmentPositionOutlet] || "";
  }, [attachmentPositionOutlet]);

  return (
    <div className={styles["alumdosing-container"]}>
      <div className={styles["verticalPipe-adjustment"]}>
        <PipeVartical waterOn={waterOn} />
      </div>
      <div className={styles["alum-dosing-image-container"]}>
        <img
          src="/images/alum-dosing-pump.jpeg"
          alt="Alum Dosing Pump"
          className={styles["alum-dosing-img"]}
        />
        <h4>alum Dosing Pump</h4>
      </div>
      <div className={styles["pipe-Oultet-adjustment"]}>
        <PipeOutlet
          waterOn={waterOn}
          sensorData={alumDosingPump?.outlet}
          pipeOutletWidth={pipeOutletWidth}
        />
      </div>
    </div>
  );
}

export default AlumDosingPump;
