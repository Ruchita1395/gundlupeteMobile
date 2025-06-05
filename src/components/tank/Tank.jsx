import React, { useState, useEffect, useMemo, memo } from "react";
import styles from "./Tank.module.css";
import TankCap from "./TankCap";
import PipeOutlet from "../pipeOutlet/PipeOutlet";
import PipeInlet from "../pipeInlet/PipeInlet";
import useData from "../../data/useData";
import { useMediaQuery } from "react-responsive";

/**
 * Tank component for displaying water tanks with inlet/outlet pipes and level indicators
 *
 * @param {Object} props Component props
 * @param {Object} props.tankstyle Custom styles for the tank
 * @param {Object} props.tankContainar Custom styles for the tank container
 * @param {number} props.level Water level (0-100)
 * @param {string} props.name Tank name
 * @param {number} props.tankNumber Tank identifier
 * @param {Object} props.pipeData Configuration data for pipes and sensors
 */
const Tank = memo(
  ({
    tankstyle,
    tankContainar,
    name,
    tankNumber,
    pipeData,
    mqttData,
    seperateMqttData,
  }) => {
    const [height, setHeight] = useState(0);
    const [level, setLevel] = useState(0);
    // Extract pipe configuration safely with defaults
    const attachmentPositionInlet =
      pipeData?.inlet?.attachmentPosition || "top";
    const attachmentPositionOutlet =
      pipeData?.outlet?.attachmentPosition || "bottom";
    const inletData = pipeData?.inlet || {};
    const pipeInletWidth = inletData?.pipeLength || "50%";
    const pipeOutletWidth = pipeData?.outlet?.pipeLength || "50%";
    const levelSensorImg = pipeData?.Levelsensor?.image || "";
    const levelSensorUnits = pipeData?.Levelsensor?.units || "m";
    const dataSource = pipeData?.mqtt?.dataSource || "io";
    const variableName = pipeData?.mqtt?.variableName[0] || "s1";

    // const tankCapacity = parseFloat(pipeData?.capacity) || 0;
    const [tankCapacity, setTankCapacity] = useState(0);

    const waterflow = useMemo(() => {
      const flow1 = mqttData?.iotData?.data?.modbus?.[0]?.flowrate1 || 0;
      const flow2 =
        seperateMqttData?.iotData?.data?.modbus?.[0]?.flowrate1 || 0;
      return flow1 > 0 || flow2 > 0;
    }, [mqttData, seperateMqttData]);

      console.log("dataSource", dataSource);
      console.log("variableName", variableName);
    // Update height when level changes
    useEffect(() => {
      const currentLevel = seperateMqttData
        ? seperateMqttData?.iotData?.data?.[dataSource]?.[variableName]
        : mqttData?.iotData?.data?.[dataSource]?.[variableName] || 0;
      setLevel(currentLevel);

      const capacity = parseFloat(pipeData?.capacity) || 0;
      setTankCapacity(capacity);

      if (!currentLevel) return setHeight(0);

      try {
        if (capacity) {
          setHeight(currentLevel * (100 / capacity));
        } else {
          setHeight(currentLevel * 6.66);
        }
      } catch (error) {
        console.error("Error calculating tank height:", error);
      }
    }, [mqttData, seperateMqttData]);

    // Generate CSS class for inlet pipe position
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
      <div className={styles["tank-containar"]} style={tankContainar || {}}>
        {/* Main Tank */}
        <div className={styles["main-container"]} style={tankstyle || {}}>
          <div className={styles["tank-cap"]}></div>

          {/* Level Sensor */}
          {pipeData?.Levelsensor && (
            <div className={styles["level-sensor-container"]}>
              <p>Level Sensor</p>
              <p>
                {level || "0.0"} {levelSensorUnits}
              </p>
              {levelSensorImg && (
                <img src={levelSensorImg} alt="level sensor" />
              )}
            </div>
          )}
          {/* style={tankstyle || {}} */}
          {/* Tank with Water */}
          <div className={styles.tank}>
            <div
              className={height > 0 ? styles.water : ""}
              style={{
                height: `${height}%`,
                transition: "height 1s ease-in-out",
              }}
            />
          </div>

          {/* Tank Stand */}
          <div className={styles.base}></div>
          <div className={styles.columnleft}></div>
          <div className={styles.columnright}></div>
        </div>
      </div>
    );
  }
);

// Display name for debugging
Tank.displayName = "Tank";

export default Tank;
