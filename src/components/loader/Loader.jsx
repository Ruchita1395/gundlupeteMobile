import React from 'react'
import PuffLoader from "react-spinners/PuffLoader";

function Loader() {
  return (
    <div
    style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <PuffLoader loading={true} color="#249bd3" size={100} />
  </div>
  )
}

export default Loader