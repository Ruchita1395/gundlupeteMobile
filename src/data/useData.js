import { useEffect, useState } from "react";
import jsonData from "./jsonData1.json";
// import { unmarshall } from "@aws-sdk/util-dynamodb";

const useData = () => {
  const [scenes, setscenes] = useState([]);
  const [jackwellJson, setjackwellJson] = useState({});
  const [wtpOutletJson_tank1, setwtpOutletJson_tank1] = useState({});
  const [wtpOutletJson_tank2, setwtpOutletJson_tank2] = useState({});
  const [ipsJson, setipsJson] = useState({});
  const [wtpInletJson, setwtpInletJson] = useState({});
  const [distributionJson, setdistributionJson] = useState({});

  useEffect(() => {
    // getConfiguration();
    // async function getConfiguration() {
    //   const configUrl = "https://h9256d8j84.execute-api.ap-south-1.amazonaws.com/dev/gundlupete-config";
    //   try {
    //     const response = await fetch(configUrl);
    //     if (!response.ok) throw new Error("Failed to fetch configuration");
    //     const rawData = await response.json();
    //     console.log("raw data....", rawData);
    //     const item = unmarshall(rawData.Items[0]);
    //     if (item.data) {
    //       const jsonData = item.data;
    //       console.log("jsonData.....", jsonData);
          setscenes(jsonData.haveri.scenes);// all the data

          const jackwellJsonData = jsonData.haveri.scenes[0];
          setjackwellJson(jackwellJsonData);


          const wtpOutletJson_tank1Data = jsonData.haveri.scenes[0]?.tank1;
          setwtpOutletJson_tank1(wtpOutletJson_tank1Data); // only wtpOutletJson_tank1 data

          const wtpOutletJson_tank2Data = jsonData.haveri.scenes[0]?.tank2;
          setwtpOutletJson_tank2(wtpOutletJson_tank2Data); // only screen one Tank2 data

          const ipsJsonData = jsonData.haveri.scenes[1]?.tank1;
          setipsJson(ipsJsonData); // only screen one Tank2 data

          const inletData = jsonData.haveri.scenes[4];
          //   console.log("inletData...", inletData);
          setwtpInletJson(inletData);

          const distributionJsonData = jsonData.haveri.scenes[2];
          setdistributionJson(distributionJsonData);
        // }
        // if (data.statusCode === 200) {
        //   console.log("data........", data);
        //   // connectToIoT();  
        // } else {
        //   throw new Error("Error getting configuration");
        // }


    //   } catch (error) {
    //     console.error("Error fetching config:", error);
    //   }
    // }

  }, [])

  return { scenes, jackwellJson, wtpOutletJson_tank1, wtpOutletJson_tank2, ipsJson, wtpInletJson, distributionJson };



}

export default useData;
