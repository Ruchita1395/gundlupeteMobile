import React from "react";
import "./Test.css";
import PipeOutlet from "./components/pipeOutlet/PipeOutlet";
import Sensor from "./components/sensor/Sensor";
import Pump from "./components/pump/Pump";
import Tank from "./components/tank/Tank";
import PipeInlet from "./components/pipeInlet/PipeInlet"

function Test() {
  return (
    <div className="test">
      <div className="test1">
      <Tank level={10} name={"tank1"} tankNumber={1} />

      </div>
      {/* <PipeOutlet waterOn={true}/> */}
      {/* <div className="test2">
      </div> */}
      <PipeInlet />

      {/* <Sensor name={"ph"} image={"../images/ph-1.png"} currentFlow={0} totalFlow={0}/> */}
    </div>
  );
}

export default Test;
