import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Sensor from "./components/sensor/Sensor";
import PipeOutlet from "./components/pipeOutlet/PipeOutlet";
import Test from "./Test";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/online_Monitoring",
      element: <Home />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
