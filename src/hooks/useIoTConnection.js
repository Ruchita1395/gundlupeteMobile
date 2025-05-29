import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserPoolObj, getAWSCredentials } from "../utils/awsConfig.js";

const TOPICS = {
  JACKWELL_OUTLET: "sreesubha/gundlupete/jackwell_outlet",
  WTP_OUTLET: "sreesubha/gundlupete/main_wtp_outlet",
  IPS: "sreesubha/gundlupete/ips",
  WTP_INLET: "sreesubha/gundlupete/main_wtp_inlet",
  MBR: "sreesubha/gundlupete/mbr",
  OHT_1: "sreesubha/gundlupete/oht-1",
  OHT_2: "sreesubha/gundlupete/oht-2",
  OHT_3: "sreesubha/gundlupete/oht-3",
  OHT_4: "sreesubha/gundlupete/oht-4",
  OHT_5: "sreesubha/gundlupete/oht-5",
};

// IoT endpoint
const IOT_ENDPOINT = "a1ruirjvjwioo0-ats.iot.ap-south-1.amazonaws.com";

// Custom hook for IoT connection and messaging
export default function useIoTConnection() {

  const [iotData2, setIotData2] = useState({});
  const [jackwell, setJackwell] = useState({});
  const [wtpOutlet, setWtpOutlet] = useState({});
  const [ips, setIps] = useState({});
  const [wtpInlet, setWtpInlet] = useState({});

  const [mbrTank, setMbrTank] = useState({});
  const [distrbutionTank1, setDistrbutionTank1] = useState({});
  const [distrbutionTank2, setDistrbutionTank2] = useState({});
  const [distrbutionTank3, setDistrbutionTank3] = useState({});
  const [distrbutionTank4, setDistrbutionTank4] = useState({});
  const [distrbutionTank5, setDistrbutionTank5] = useState({});

  const [tank1, setTank1] = useState(0);
  const [tank2, setTank2] = useState(0);
  const [tank3, setTank3] = useState(0);
  const [tank4, setTank4] = useState(0);
  const [tank5, setTank5] = useState(0);
  const [tank6, setTank6] = useState(0);

  const [lastUpdated, setLastUpdated] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAndRefreshCredentials = async () => {
      // console.log("check and refresh credentials.....");
      const storedCredentials = localStorage.getItem("iotCredentials");
      if (storedCredentials) {
        const credentials = JSON.parse(storedCredentials);
        const now = new Date();
        const expirationTime = new Date(credentials.expiration);
        // console.log(
        //   "expiration token ",
        //   expirationTime.getTime() - now.getTime() <= 5 * 60 * 1000
        // );

        if (expirationTime.getTime() - now.getTime() <= 5 * 60 * 1000) {
          try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
              throw new Error("No refresh token found");
            }
            // Refresh logic would go here
            const session = await refreshSession();
            const idToken = session.getIdToken().getJwtToken();
            await getAWSCredentials(idToken, "ap-south-1");
            connectToIoT();
          } catch (error) {
            console.log(`Failed to refresh credentials: ${error.message}`);
            // window.location.href = "/";
            navigate("/");
          }
        } else {
          // console.log("Credentials are valid");
        }
      } else {
        console.log("Credentials not found");
        // window.location.href = "/";
        navigate("/");
      }
    }
    const refreshSession = async () => {
      return new Promise((resolve, reject) => {
        const userPool = getUserPoolObj();
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
          cognitoUser.getSession((err, session) => {
            if (err) {
              reject(err);
              return;
            }
            const refreshToken = session.getRefreshToken();
            localStorage.setItem("refreshToken", refreshToken.getToken());
            cognitoUser.refreshSession(refreshToken, (err, session) => {
              if (err) {
                reject(err);
              } else {
                resolve(session);
              }
            });
          });
        } else {
          reject(new Error("No current user"));
        }
      });
    };
    const connectToIoT = () => {
      try {
        setConnectionStatus("connecting");
        const iotCredentials = JSON.parse(
          localStorage.getItem("iotCredentials") || "{}"
        );

        const topics = Object.values(TOPICS);

        const { accessKeyId, secretKey, sessionToken } = iotCredentials;

        // Check for required credentials
        if (!accessKeyId || !secretKey) {
          throw new Error("Missing IoT credentials");
        }

        // Make sure AwsIot is available
        if (typeof AwsIot === "undefined") {
          throw new Error("AWS IoT SDK not available");
        }

        const clientID = "webapp:" + new Date().getTime();

        const mqttDevice = AwsIot.device({
          clientId: clientID,
          host: IOT_ENDPOINT,
          protocol: "wss",
          accessKeyId,
          secretKey,
          sessionToken,
        });

        mqttDevice.on("connect", () => {
          setConnectionStatus("connected");
          console.log("Connected to IoT endpoint");

          // Delay subscribing to allow connection to stabilize
          setTimeout(() => {
            topics.forEach((topic) => {
              if (!topic) return; // Skip undefined topics

              mqttDevice.subscribe(topic, (err) => {
                if (err) {
                  console.error(`Error subscribing to ${topic}:`, err);
                } else {
                  console.log(`Subscribed to ${topic}`);
                }
              });
            });
          }, 2000);
        });

        mqttDevice.on("error", (err) => {
          setError(`IoT connection error: ${err.message}`);
          setConnectionStatus("error");
          console.error("IoT connection error:", err);
        });

        mqttDevice.on("offline", () => {
          setConnectionStatus("offline");
          console.log("IoT connection offline");
        });

        mqttDevice.on("message", function (topic, payload) {
          const iotData = JSON.parse(payload.toString());
          if (topic === "sreesubha/gundlupete/jackwell_outlet") {
            if (iotData?.data?.modbus) {
              setJackwell((prevData) => ({ ...prevData, iotData }));
            }
          }
          if (topic === "sreesubha/gundlupete/main_wtp_outlet") {
            if (iotData?.data?.modbus) {
              setWtpOutlet((prevData) => ({ ...prevData, iotData }));
             
            }
          }
          if (topic === "sreesubha/gundlupete/ips") {
            if (iotData?.data?.modbus) {
              setIps((prevData) => ({ ...prevData, iotData }));

            }
          }
          if (topic === "sreesubha/gundlupete/main_wtp_inlet") {
            if (iotData?.data?.modbus || iotData?.data?.io) {
              setWtpInlet((prevData) => ({ ...prevData, iotData }));
               
            }
          }
          if (topic === "sreesubha/gundlupete/mbr") {
            if (iotData?.data?.io) {
              const levelSensor = iotData.data.io.s1;
              setTank1((prevData) => ({ ...prevData, levelSensor }));
            }
            if (iotData?.data?.modbus) {
              setMbrTank((prevData) => ({ ...prevData, iotData }));
            }
          }
          if (topic == "sreesubha/gundlupete/oht-1") {
            if (iotData?.data?.io) {
              const levelSensor = iotData.data.io.s1;
              setTank2((prevData) => ({ ...prevData, levelSensor }));
            }
            if (iotData?.data?.modbus) {
              setDistrbutionTank1((prevData) => ({ ...prevData, iotData }));
            }
          }
          if (topic == "sreesubha/gundlupete/oht-2") {
            if (iotData?.data?.io) {

              const levelSensor = iotData.data.io.s1;
              setTank3((prevData) => ({ ...prevData, levelSensor }));
            }
            if (iotData?.data?.modbus) {
              setDistrbutionTank2((prevData) => ({ ...prevData, iotData }));
            }
          }
          if (topic == "sreesubha/gundlupete/oht-3") {
            if (iotData?.data?.io) {
              const levelSensor = iotData.data.io.s1;
              setTank4((prevData) => ({ ...prevData, levelSensor }));
            }
            if (iotData?.data?.modbus) {
              setDistrbutionTank3((prevData) => ({ ...prevData, iotData }));
            }
          }
          if (topic == "sreesubha/gundlupete/oht-4") {
            if (iotData?.data?.io) {
              const levelSensor = iotData.data.io.s1;
              setTank5((prevData) => ({ ...prevData, levelSensor }));
            }
            if (iotData?.data?.modbus) {
              setDistrbutionTank4((prevData) => ({ ...prevData, iotData }));
            }
          }
          if (topic == "sreesubha/gundlupete/oht-5") {
            if (iotData?.data?.io) {
              const levelSensor = iotData.data.io.s1;
              setTank6((prevData) => ({ ...prevData, levelSensor }));
            }
            if (iotData?.data?.modbus) {
              setDistrbutionTank5((prevData) => ({ ...prevData, iotData }));
            }
          }
        });
      } catch (err) {
        setError(`Failed to connect to IoT: ${err.message}`);
        setConnectionStatus("error");
        console.error("Error connecting to IoT:", err);
      }
    };

    //
    connectToIoT();
    const interval = setInterval(checkAndRefreshCredentials, 4000);

  }, []);

  return {
    jackwell,
    wtpOutlet,
    ips,
    wtpInlet,
    mbrTank,
    distrbutionTank1,
    distrbutionTank2,
    distrbutionTank3,
    distrbutionTank4,
    distrbutionTank5,
    tank1,
    tank2,
    tank3,
    tank4,
    tank5,
    tank6,
    lastUpdated,
    connectionStatus,
    error,
  };
}