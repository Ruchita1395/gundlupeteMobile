import React, { createContext, useState, useContext } from "react";

const SensorContext = createContext();

export const SensorProvider = ({ children }) => {
  const [iotsensorData, setIotSensorData] = useState([]);
  

  return (
    <SensorContext.Provider value={{ iotsensorData, setIotSensorData }}>
    {children}
    </SensorContext.Provider>
  );
};


export const useSensorData = () => useContext(SensorContext);