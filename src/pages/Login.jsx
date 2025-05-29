import React, { useState, useEffect } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js"
import AWS from "aws-sdk"
import { getUserPoolObj, getAWSCredentials } from "../utils/awsConfig.js"

import styles from "../styles/Login.module.css";
import { useNavigate } from "react-router-dom";

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.length > 0) {
      window.localStorage.clear()
    }
    AWS.config.region = "ap-south-1" // Replace with your region
  }, [])

  const userPool = getUserPoolObj()

  const authenticateUser = (username, password) => {
    return new Promise((resolve, reject) => {
      try {
        const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      })
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
      })
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          localStorage.setItem("refreshToken", result.getRefreshToken().getToken())
          resolve(result)
        },
        onFailure: (err) => {
          reject(err)
        },
      })
      } catch (error) {
        console.log(error);
      }
      
    })
  }
  const handleLogin = async (e) => {
    // setIsAuthenticated(true); // Set authentication state to true
    setErrorMessage("");
    setStatusMessage("");
    e.preventDefault();

    try {
      const result = await authenticateUser(username, password)
      await getAWSCredentials(result.getIdToken().getJwtToken(), AWS.config.region)
      navigate("/online_monitoring")
      // window.location.href = "/online_monitoring"
    } catch (error) {
      setErrorMessage(`Error in the authentication process: ${error.message}`)
      console.log(error);

    }

  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["form-container"]} >
      <h1>RevoNext Online Monitoring Platform Login</h1>
        <form onSubmit={handleLogin}>
            <div className={styles["form-group"]}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required value={username} onChange={(e) => setUsername(e.target.value)}></input>
            </div>
            <div className={styles["form-group"]}>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <button className={styles["login-button"]} type="submit" id="loginButton">Login</button>
        </form>
        <div id="errorMessage" className={styles["error-message"]}>{errorMessage}</div>
        <div id="statusMessage" className={styles["status-message"]}>{statusMessage}</div>
        </div>  
    </div>
  );
}

export default Login;
