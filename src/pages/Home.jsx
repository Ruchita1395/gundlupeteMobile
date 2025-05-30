import React, { useState, useEffect, useMemo, useCallback } from "react";
import "../App.css";
import Tank from "../components/tank/Tank";
import PipeOutlet from "../components/pipeOutlet/PipeOutlet";
import Headers from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ClariFlocculator from "../components/clariFlocculator/ClariFlocculator";
import AlumDosingPump from "../components/alumDosingPump/AlumDosingPump";
import AlumMixer from "../components/alumMixer/AlumMixer";
import { IotData, Translate } from "aws-sdk";
import Tooltip from "../components/tooltip/Tooltip";
// import "../styles/Home.css";
import useData from "../data/useData";
import KabiniRever from "../components/kabiniRever/KabiniRever";
import Loader from "../components/loader/Loader";
import { getUserPoolObj, getAWSCredentials } from "../utils/awsConfig.js";
import AWS from "aws-sdk";

import useIoTConnection from "../hooks/useIoTConnection.js";

function Home() {
  const {
    jackwell,
    wtpOutlet,
    wtpInlet,
    ips,
    mbrTank,
    distrbutiontank1,
    distrbutionTank2,
    distrbutionTank3,
    distrbutionTank4,
    distrbutionTank5,
    lastUpdated,
    connectionStatus,
    error,
  } = useIoTConnection();
  const [lastUpdatedTime, setLastUpdatedTime] = useState("");
  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString(); // You can use toLocaleString() for date+time
    setLastUpdatedTime(formattedTime);
  }, [
    mbrTank?.iotData?.data?.io?.s1,
    distrbutiontank1?.iotData?.data?.io?.s1,
    distrbutionTank2?.iotData?.data?.io?.s1,
    distrbutionTank3?.iotData?.data?.io?.s1,
    distrbutionTank4?.iotData?.data?.io?.s1,
    distrbutionTank5?.iotData?.data?.io?.s1,
  ]);

  const {
    scenes = [],
    jackwellJson,
    wtpOutletJson_tank1,
    wtpOutletJson_tank2,
    ipsJson,
    wtpInletJson,
    distributionJson,
  } = useData();

  const [activeSection, setActiveSection] = useState(1);
  console.log("activeSection", activeSection);
  const tankstyle = {
    width: "45%",
    height: "100%",
  };

  const smalltankstyle = {
    width: "30%",
  };

  // Memoize scene names to avoid recalculation on every render
  const pageNames = useMemo(() => {
    return scenes && Array.isArray(scenes)
      ? scenes.map((scene) => scene?.sceneName || "")
      : [];
  }, [scenes]);

  // Handle scene navigation
  const handleSceneChange = useCallback((index) => {
    setActiveSection(index);
  }, []);

  // Memoize scene content rendering for better performance
  const renderSceneContent = useCallback(
    (sceneIndex) => {
      // Make sure scenes array is available and sceneIndex is valid
      if (
        !scenes ||
        !Array.isArray(scenes) ||
        sceneIndex < 1 ||
        sceneIndex > scenes.length
      ) {
        return null;
      }

      const scene = scenes[sceneIndex - 1];
      console.log("scene", sceneIndex);
      switch (sceneIndex) {
        case 4:
          return (
            <section
              className={`${activeSection === 5 ? "jackwell" : "hide"} fade-in`}
            >
              {jackwellJson?.KabiniRever && (
                <div className="jackwell-container">
                  <KabiniRever
                    name={jackwellJson?.KabiniRever?.name}
                    pipeData={jackwellJson.KabiniRever}
                    mqttData={jackwell}
                  />
                </div>
              )}
            </section>
          );
        case 5:
          return (
            <section
              className={`section ${activeSection === 4 ? "wtp-inlet" : "hide"
                } fade-in`}
            >
              <div className="wtp-inlet-container">
                <div className="claroflocculator-container">
                  <ClariFlocculator
                    waterOn={true}
                    wtpInletData={wtpInletJson?.Clariflocculator}
                    mqttData={wtpInlet}
                  />
                </div>
                <div className="alum-dosing-pump-container">
                  {wtpInletJson?.AlumDosingPump && (
                    // <AlumDosingPump
                    //   waterOn={true}
                    //   alumDosingPump={wtpInletJson.AlumDosingPump}
                    // />
                    <div className="alumdosing-container">
                      <AlumDosingPump waterOn={true} />
                    </div>
                  )}
                </div>
                <div className="alum-mixer-container">
                  {(wtpInletJson?.AlumMixer1 || wtpInletJson?.AlumMixer2) && (
                    <div className="alum-mixer-main">
                      {wtpInletJson?.AlumMixer1 && (
                        <AlumMixer alumMixer={wtpInletJson?.AlumMixer1} />
                      )}
                      {wtpInletJson?.AlumMixer2 && (
                        <AlumMixer alumMixer={wtpInletJson?.AlumMixer2} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        case 1:
          return (
            <section
              className={`${activeSection === 1 ? "wtp-outlet" : "hide"
                } fade-in`}
            >
              <div className="tank1">
                <Tank
                  pipeData={wtpOutletJson_tank1}
                  mqttData={wtpOutlet}
                  seperateMqttData={wtpInlet}
                />
              </div>
              <div className="second-tank">
                <div className="second-tank-component">
                  <Tank pipeData={wtpOutletJson_tank2} mqttData={wtpOutlet} />
                </div>
              </div>
            </section>
          );
        case 2:
          return (
            <section
              className={`${activeSection === 2 ? "ips" : "hide"} fade-in`}
            >
              <div className="tank-3">
                <Tank pipeData={ipsJson} mqttData={ips} />
              </div>
              <div className="card card-1">
                <p className="tankTitle">
                  {console.log("ipsJason...", ipsJson)}
                  {ipsJson?.tankExtraDetails?.tankName}
                </p>
                <p className="waterLevel">
                  water level : {ips?.iotData?.data?.io?.s1 || 0}
                </p>
                <div className="outletSection">
                  {ipsJson?.outlet && (
                    <p className="outlet"><span>Outlet Attached</span><span className="position">{ipsJson.outlet.attachmentPosition}</span></p>
                  )}
                  {ipsJson?.outlet?.pump1 && (
                    <p>{ipsJson?.outlet?.pump1?.name} attached</p>
                  )}
                  {ipsJson?.outlet?.pump2 && (
                    <p>{ipsJson?.outlet?.pump2?.name} attached</p>
                  )}
                  {ipsJson?.outlet?.sensors && (
                    <>
                      <p>Sensor's Attached</p>
                      {ipsJson.outlet.sensors.map((ele, index) => {
                        const sensorKey = Object.keys(ele)[0];
                        const sensor = ele[sensorKey];
                        return (
                          <div key={index}>
                            <p>Sensor Name: {sensor.name}</p>
                          </div>
                        );
                      })}
                    </>
                  )}

                </div>
                <div className="inletSection">
                  {ipsJson?.inlet && (
                    <p className="inlet"><span>Inlet Attached</span><span className="position">{ipsJson.outlet.attachmentPosition}</span></p>
                  )}
                </div>
                {lastUpdatedTime && (
                  <p className="update">Last update: {lastUpdatedTime}</p>
                )}
              </div>
            </section>
          );
        case 3:
          return (
            <section
              className={`section ${activeSection === 3 ? "distribution" : "hide"
                } fade-in`}
            >
              <div className="tank-containar">
                <div className="mbr-containar">
                  <div className="mbr-tank">
                    <Tank
                      tankstyle={tankstyle}
                      pipeData={distributionJson?.tank6}
                      mqttData={mbrTank}
                    />
                  </div>
                  <div className="card card-1">
                    <p className="tankTitle">
                      {distributionJson?.tank6?.tankExtraDetails?.tankName}
                    </p>
                    <p className="waterLevel">
                      water level : {mbrTank?.iotData?.data?.io?.s1 || 0}
                    </p>
                    {lastUpdatedTime && (
                      <p className="update">Last update: {lastUpdatedTime}</p>
                    )}
                  </div>
                </div>
                <div className="other-tank-containar">
                  <div className="all-tank">
                    <div className="tank-adjiustment-distribution">
                      <Tank
                        tankstyle={smalltankstyle}
                        pipeData={distributionJson.tank1}
                        mqttData={distrbutiontank1}
                      />
                    </div>
                    <div className="card card-1">
                      <p className="tankTitle">
                        {distributionJson?.tank1?.tankExtraDetails?.tankName}
                      </p>
                      <p className="waterLevel">
                        water level :{" "}
                        {distrbutiontank1?.iotData?.data?.io?.s1 || 0}
                      </p>
                      {lastUpdatedTime && (
                        <p className="update">Last update: {lastUpdatedTime}</p>
                      )}
                    </div>
                  </div>
                  <div className="all-tank">
                    <div className="tank-adjiustment-distribution">
                      <Tank
                        tankstyle={smalltankstyle}
                        pipeData={distributionJson.tank2}
                        mqttData={distrbutionTank2}
                      />
                    </div>
                    <div className="card card-1">
                      <p className="tankTitle">
                        {distributionJson?.tank2?.tankExtraDetails?.tankName}
                      </p>
                      <p className="waterLevel">
                        water level :{" "}
                        {distrbutionTank2?.iotData?.data?.io?.s1 || 0}
                      </p>
                      {lastUpdatedTime && (
                        <p className="update">Last update: {lastUpdatedTime}</p>
                      )}
                    </div>
                  </div>
                  <div className="all-tank">
                    <div className="tank-adjiustment-distribution">
                      <Tank
                        tankstyle={smalltankstyle}
                        pipeData={distributionJson.tank3}
                        mqttData={distrbutionTank3}
                      />
                    </div>
                    <div className="card card-1">
                      <p className="tankTitle">
                        {distributionJson?.tank3?.tankExtraDetails?.tankName}
                      </p>
                      <p className="waterLevel">
                        water level :{" "}
                        {distrbutionTank3?.iotData?.data?.io?.s1 || 0}
                      </p>
                      {lastUpdatedTime && (
                        <p className="update">Last update: {lastUpdatedTime}</p>
                      )}
                    </div>
                  </div>
                  <div className="all-tank">
                    <div className="tank-adjiustment-distribution">
                      <Tank
                        tankstyle={smalltankstyle}
                        pipeData={distributionJson.tank4}
                        mqttData={distrbutionTank4}
                      />
                    </div>
                    <div className="card card-1">
                      <p className="tankTitle">
                        {distributionJson?.tank4?.tankExtraDetails?.tankName}
                      </p>
                      <p className="waterLevel">
                        water level :{" "}
                        {distrbutionTank4?.iotData?.data?.io?.s1 || 0}
                      </p>
                      {lastUpdatedTime && (
                        <p className="update">Last update: {lastUpdatedTime}</p>
                      )}
                    </div>
                  </div>
                  <div className="all-tank ">
                    <div className="tank-adjiustment-distribution">
                      <Tank
                        tankstyle={smalltankstyle}
                        pipeData={distributionJson.tank5}
                        mqttData={distrbutionTank5}
                      />
                    </div>
                    <div className="card card-1">
                      <p className="tankTitle">
                        {distributionJson?.tank5?.tankExtraDetails?.tankName}
                      </p>
                      <p className="waterLevel">
                        water level :{" "}
                        {distrbutionTank5?.iotData?.data?.io?.s1 || 0}
                      </p>
                      {lastUpdatedTime && (
                        <p className="update">Last update: {lastUpdatedTime}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        default:
          return null;
      }
    },
    [
      activeSection,
      wtpOutletJson_tank1,
      wtpOutletJson_tank2,
      ipsJson,
      wtpInletJson,
      scenes,
      jackwell,
      wtpOutlet,
      ips,
      wtpInlet,
      mbrTank,
      distrbutiontank1,
      distrbutionTank2,
      distrbutionTank3,
      distrbutionTank4,
      distrbutionTank5,

      lastUpdated,
      connectionStatus,
      error,
    ]
  );

  // Display connection status message
  const renderConnectionStatus = useMemo(() => {
    if (error) {
      return <div className="error-message fade-in">Error: {error}</div>;
    }

    if (connectionStatus === "connecting") {
      return (
        <div className="status-connecting fade-in">
          Connecting to IoT devices...
        </div>
      );
    }

    if (connectionStatus === "offline") {
      return (
        <div className="status-offline fade-in">
          Connection offline. Reconnecting...
        </div>
      );
    }

    return null;
  }, [connectionStatus, error]);

  // Loading state when scenes aren't available
  if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
    return (
      <main className="main-container fade-in">
        <header className="header">
          <Headers />
        </header>
        <div className="loading-container">
          <div className="loading-message">
            Loading scene data... <Loader />
          </div>
          {renderConnectionStatus}
        </div>
        <footer className="footer">
          <Footer />
        </footer>
      </main>
    );
  }

  // Safe index for activeSection that stays within the array bounds
  const safeActiveIndex = Math.min(Math.max(1, activeSection), scenes.length);

  return (
    <main className="main-container">
      <header className="header">
        <Headers />
      </header>

      {renderConnectionStatus}

      <div className="sidebar">
        {scenes.map((scene, index) => (
          <button
            key={index}
            className={activeSection === index + 1 ? "active" : ""}
            onClick={() => handleSceneChange(index + 1)}
          >
            {scene?.buttonName || `Scene ${index + 1}`}
          </button>
        ))}
      </div>
      <div className="sidebar left-sidebar">
        <div>{pageNames[activeSection - 1] || ""}</div>
      </div>

      {/* Render the active scene */}
      {renderSceneContent(activeSection)}

      <footer className="footer">
        <Footer />
      </footer>
    </main>
  );
}

export default Home;
