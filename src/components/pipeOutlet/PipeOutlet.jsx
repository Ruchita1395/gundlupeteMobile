import React, {  useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./PipeOutlet.module.css";
import Sensor from "../sensor/Sensor";
import Pump from "../pump/Pump";
 
function PipeOutlet({
  waterOn = false,
  sensorData = {},
  pipeOutletWidth,
  outletmqttData,
  seperateMqttData
}) {
  const sensors = sensorData?.sensors || [];
  const waterFlowAnimation = sensorData?.waterFlowAnimationReverse === "true";

  const pump1Status = sensorData?.pump1?.waterFlow === "true";
  const pump2Status = sensorData?.pump2?.waterFlow === "true";
  const pump3Status = sensorData?.pump3?.waterFlow === "true";
  const pump4Status = sensorData?.pump4?.waterFlow === "true";
  const pumpGreen = sensorData?.pump1?.pumpGreenImage;
  const pumpRed = sensorData?.pump1?.pumpRedImage;
  const pump1Name = sensorData?.pump1?.name;
  const pump2Name = sensorData?.pump2?.name;
  const pump3Name = sensorData?.pump3?.name;
  const pump4Name = sensorData?.pump4?.name;
  const [hide, setHide] = useState(false);


  const getPumpImage = (isActive) => (isActive ? pumpGreen : pumpRed);


  return (
    <div className={styles["pipe-outlet-main-container"]}>
      <div className={styles["pump-adjustment"]}>
        {sensorData?.pump1 && (
          <Pump name={pump1Name} image={getPumpImage(waterOn)} />
        )}
        {sensorData?.pump2 && (
          <Pump name={pump2Name} image={getPumpImage(waterOn)} />
        )}
        {sensorData?.pump3 && (
          <Pump name={pump3Name} image={getPumpImage(waterOn)} />
        )}
        {sensorData?.pump4 && (
          <Pump name={pump4Name} image={getPumpImage(waterOn)} />
        )}
      </div>

      <div
        className={` ${styles["sensor-adjustment"]} ${
          hide ? styles["sensor-change-adjustment"] : ""
        } `}
      >
        {sensors.map((ele, index) => {
          const sensorKey = Object.keys(ele)[0]; // magneticFlowMeter
          const sensor = ele[sensorKey];
          const mqttInfo = sensor?.mqtt || {};
          const variableNames = mqttInfo?.variableName || [];
          const units = sensor?.unit || [];
          const dataSource = mqttInfo?.dataSource;
          const level = mqttInfo?.level || "0";
          const modbusData = seperateMqttData && sensorKey === "magneticFlowMeter" ? seperateMqttData?.iotData?.data?.[dataSource]?.[level] :
            outletmqttData?.iotData?.data?.[dataSource]?.[level] || {};
          const values = variableNames.map(
            (varName) => modbusData?.[varName] ?? 0.0
          );

          return (
            <div className={styles["sensors"]} key={index}>
              <Sensor
                name={sensor?.name}
                image={sensor?.image}
                // currentFlow={
                //   outletmqttData?.iotData?.data?.modbus[0]?.flowrate1
                //     ? outletmqttData?.iotData?.data?.modbus[0]?.flowrate1
                //     : 0.0
                // }
                // totalFlow={
                //   outletmqttData?.iotData?.data?.modbus[0]?.totaliser1
                //     ? outletmqttData?.iotData?.data?.modbus[0]?.totaliser1
                //     : 0.0
                // }
                currentFlow={values[0] ?? 0.0}
                totalFlow={values[1] ?? 0.0}
                value={values[0] ?? 0.0}
                unit={units}
              />
            </div>
          );
        })}
      </div>

      <div className={styles["pipe-outlet"]}>
        <div className={  waterOn ? styles["pipe-water"] : styles["hide"]}>
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

PipeOutlet.propTypes = {
  waterOn: PropTypes.bool,
  sensorData: PropTypes.shape({
    outlet: PropTypes.shape({
      sensors: PropTypes.array,
      pump1: PropTypes.shape({
        waterFlow: PropTypes.string,
      }),
      pump2: PropTypes.shape({
        waterFlow: PropTypes.string,
      }),
    }),
  }),
};

export default PipeOutlet;
