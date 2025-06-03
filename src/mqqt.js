"saifelectrical/gundlupet/jackwell/oht1/waterlevel": {
    data: {
      imei: "868651062770723",
      uid: 1,
      dtm: "20240911142811",
      seq: 25,
      sig: 19,
      msg: "io",
      io: {
        di1: 0,
        d12: 0,
        op1: 0,
        a1: 0.0,
        a2: 0.0,
        s1: 6,
        p1: 0,
        gps: "0.0000000,0.0000000",
      },
      dev: {
        sysv: 24.21,
      },
    },
  },
  "saifelectrical/gundlupet/jackwell/oht2/waterlevel": {
    data: {
      imei: "868651062770999",
      uid: 2,
      dtm: "20240911143000",
      seq: 30,
      sig: 18,
      msg: "io",
      io: {
        di1: 1,
        d12: 1,
        op1: 1,
        a1: 1.2,
        a2: 1.5,
        s1: 8,
        p1: 1,
        gps: "12.345678,76.543210",
      },
      dev: {
        sysv: 22.5,
      },
    },
  },


"saifelectrical/gundlupet/distribution/oht1/waterlevel": {
    data: {
      imei: "868651062770723",
      uid: 1,
      dtm: "20240911142811",
      seq: 25,
      sig: 19,
      msg: "io",
      io: {
        di1: 0,
        d12: 0,
        op1: 0,
        a1: 0.0,
        a2: 0.0,
        s1: 6,
        p1: 0,
        gps: "0.0000000,0.0000000",
      },
      dev: {
        sysv: 24.21,
      },
    },
  },
  "saifelectrical/gundlupet/distribution/oht2/waterlevel": {
    data: {
      imei: "868651062770723",
      uid: 1,
      dtm: "20240911142811",
      seq: 25,
      sig: 19,
      msg: "io",
      io: {
        di1: 0,
        d12: 0,
        op1: 0,
        a1: 0.0,
        a2: 0.0,
        s1: 6,
        p1: 0,
        gps: "0.0000000,0.0000000",
      },
      dev: {
        sysv: 24.21,
      },
    },
  },


saifelectrical/gundlupet/distribution/oht2/waterlevel
saifelectrical/gundlupet/distribution/oht3/waterlevel
saifelectrical/gundlupet/distribution/oht4/waterlevel
saifelectrical/gundlupet/distribution/oht5/waterlevel
saifelectrical/gundlupet/distribution/oht6/waterlevel

useEffect(() => {
    if (!iotData2) return; // Ensure iotData2 is not empty
  
    const newPageOneData = {};
    const newPageTwoData = {};
    const newPageThreeData = {};
    const newPageFourData = {};
  
    Object.entries(iotData2).forEach(([topic, data]) => {
      if (iotData2.includes(topic)) {
        newPageOneData[topic] = data;
      } else if (pageTwoTopics.includes(topic)) {
        newPageTwoData[topic] = data;
      } else if (pageThreeTopics.includes(topic)) {
        newPageThreeData[topic] = data;
      } else if (pageFourTopics.includes(topic)) {
        newPageFourData[topic] = data;
      }
    });
  
    setPageOneIotData(newPageOneData);
    setPageTwoIotData(newPageTwoData);
    setPageThreeIotData(newPageThreeData);
    setPageFourIotData(newPageFourData);
  }, [iotData2]); // Runs whenever iotData2 updates


  if(iotData2) {
    Object.entries(iotData2).forEach(([topic, data]) => {
      if (topics.includes("jackwell")) {
        // topics.includes("distribution");
        setPageOneIotData((prev) => ({
          ...prev,
          [topic]: data || prev[topic], // Preserve previous data if new data is missing
        }));
      } else if (topics.includes("ips")) {
        setPageTwoIotData((prev) => ({
          ...prev,
          [topic]: data || prev[topic],
        }));
      } else if (topics.includes("wtp")) {
        setPageThreeIotData((prev) => ({
          ...prev,
          [topic]: data || prev[topic],
        }));
      } else if (topics.includes("distribution")) {
        setPageFourIotData((prev) => ({
          ...prev,
          [topic]: data || prev[topic],
        }));
      }
    });
  }

    useEffect(() => {
      if (iotData2) {
        Object.entries(iotData2).forEach(([key, value]) => {
          if (key.includes("jackwell")) {
            setPageOneIotData((prev) => ({
              ...prev,
              [key]: value,
            }));
          } else if (key.includes("ips")) {
            setPageTwoIotData((prev) => ({
              ...prev,
              [key]: value,
            }));
          } else if (key.includes("wtp")) {
            setPageThreeIotData((prev) => ({
              ...prev,
              [key]: value,
            }));
          } else if (key.includes("distribution")) {
            setPageFourIotData((prev) => ({
              ...prev,
              [key]: value,
            }));
          }
        });
      }
    }, [iotData2]);







    <div className=" grid-tank-containar">
          <div className="grid-item grid-item-1">
            <div className="screen-4-tank-1">
              <div className="flow-meter-4">
                <div className="flowmeter-4">
                  <Tooltip infotext={"Current flow"}>
                    <div>
                      {mbrTank.iotData === undefined
                        ? "0.00"
                        : mbrTank?.iotData?.data?.modbus[0].flowrate1}{" "}
                      L/s{" "}
                    </div>
                  </Tooltip>
                  <Tooltip infotext={"Total flow"}>
                    <div>
                      {mbrTank.iotData === undefined
                        ? "0.00"
                        : mbrTank?.iotData?.data?.modbus[0].totaliser1}{" "}
                      L/s{" "}
                    </div>
                  </Tooltip>
                </div>

                <figure className="flow-meter-4-img"></figure>
                <div className="flow-meter-4-name">
                  ELECTROMAGNETIC
                  <br /> FLOWMETER
                </div>
              </div>

              <div className="inletTank-1">
                <PipeOutlet waterOn={true} />
              </div>
              <div className="outletTank-1">
                <PipeOutlet waterOn={true} />
              </div>
              <div className={"tank-cap-containar-1"}>
                <TankCap />
              </div>

              <Tank level={tank1} />
            </div>
            <div className="card card-1">
              <p className="tankTitle">{name ? { name } : "MBR"} </p>
              <p className="waterLevel">
                {/* Water Level: <span>{level !== null ? level : 0}</span>{" "} */}
                water level : {tank1}
              </p>
              {lastUpdated && (
                <p className="update">Last update: {lastUpdated}</p>
              )}
            </div>
          </div>
          <div className="grid-item">
            <div className="screen-4-tank-2">
              <div className={"tank-cap-containar-2"}>
                <TankCap extraSmall={true} />
              </div>
              <div className="inletTank-2">
                <PipeOutlet waterOn={true} />
              </div>
              <div className="flow-meter-5">
                <div className="flowmeter-5">
                  <Tooltip infotext={"Current flow"}>
                    <div>
                      {distrbutionTank1.iotData === undefined
                        ? "0.00"
                        : distrbutionTank1?.iotData?.data?.modbus[0].flowrate1}
                      L/s{" "}
                    </div>
                  </Tooltip>
                  <Tooltip infotext={"Total flow"}>
                    <div>
                      {distrbutionTank1.iotData === undefined
                        ? "0.00"
                        : distrbutionTank1?.iotData?.data?.modbus[0].totaliser1}
                      L/s{" "}
                    </div>
                  </Tooltip>
                </div>

                <figure className="flow-meter-5-img"></figure>
                <div className="flow-meter-5-name">
                  ELECTROMAGNETIC FLOWMETER
                </div>
              </div>

              <Tank
                level={tank2}
                tankstyle={tank_5}
                tankContainar={tankContainar5}
              />
            </div>
            <div className="card">
              <p className="tankTitle">{name ? { name } : "Tank No 1"} </p>
              <p className="waterLevel">
                {/* Water Level: <span>{level !== null ? level : 0}</span>{" "} */}
                water level : {tank2}
              </p>
              {lastUpdated && (
                <p className="update">Last update: {lastUpdated}</p>
              )}
            </div>
          </div>