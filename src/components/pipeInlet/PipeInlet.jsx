import React from "react";
import PropTypes from "prop-types";
import styles from "./PipeInlet.module.css";
import Sensor from "../sensor/Sensor";
import { IotData } from "aws-sdk";

function PipeInlet({ waterOn = true, inletData = {} , inletmqttData }) {
  const sensors = inletData?.sensors || [];
  const flashMixer = inletData?.flashMixer || "";
  const areater = inletData?.areater || "";
  const inlethight = parseInt(inletData?.inletHeight) || "";
  const waterFlowAnimation = inletData?.waterFlowAnimationReverse === "true";
  let sensorstyle = {};

  if (!flashMixer && !areater) {
    sensorstyle = {
      width: "100%",
      height: "80%",       
    }
  }

  return (
    <div className={styles["pipe-inlet-main-container"]}>
      <div  className={styles["sensor-adjustment"]} style={sensorstyle}>
        {sensors.map((ele, index) => {
          const sensorKey = Object.keys(ele)[0];
          const sensor = ele[sensorKey];
          const mqttInfo = sensor?.mqtt || {};
          const variableNames = mqttInfo?.variableName || [];
          const units = sensor?.unit || [];
          const dataSource = mqttInfo?.dataSource;
          const level = mqttInfo?.level || "0";
          const modbusData = inletmqttData?.iotData?.data?.[dataSource]?.[level] || {};
          const values = variableNames.map(varName => modbusData?.[varName] ?? 0.0);
        
          return (
            <div className={styles["sensors"]} key={index}>
              <Sensor
                name={sensor?.name}
                image={sensor?.image}
                // currentFlow={inletmqttData?.iotData?.data?.modbus[0]?.flowrate1 || 0}
                currentFlow={values[0] ?? 0.0}
                totalFlow={values[1] ?? 0.0}
                value={values[0] ?? 0.0}
                unit={units}
              />
            </div>
          );
        })}
      </div>
      {areater && (
        <div className={styles["areator"]}>
          <img src={areater.image} alt={areater.name} />
          <span>{areater.name}</span>
        </div>
      )}
      {flashMixer && (
        <div className={styles["flash-mixer"]}>
          <img src={flashMixer.image} alt={flashMixer.name} />
          <div className={styles["flash-mixer-pump-img"]}></div>
          <span>{flashMixer.name}</span>
        </div>
      )}
      <div className={styles["pipe-inlet"]} style={{ height: inlethight + "%" }} >
        <div className={waterOn ? styles["pipe-water"] : "hide"}>
          {Array(13)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className={`${styles.rectangle}  ${waterFlowAnimation ? styles["animateReverse"] : styles["animateStart"]}`}
              ></div>
            ))}
        </div>
      </div>
    </div>
  );
}

PipeInlet.propTypes = {
  waterOn: PropTypes.bool,
  inletData: PropTypes.shape({
    sensors: PropTypes.array,
  }),
};

export default PipeInlet;
