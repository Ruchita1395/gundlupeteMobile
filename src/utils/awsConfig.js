import { CognitoUserPool } from "amazon-cognito-identity-js"
import AWS from "aws-sdk"

export function getUserPoolObj() {
  const poolData = {
    UserPoolId: "ap-south-1_F2wKjfLbl",
    ClientId: "lkvlrs9p6jl6vfrk2vlu3f6mr",
  }
  return new CognitoUserPool(poolData)
}

export async function getAWSCredentials(idToken, region) {
  AWS.config.region = region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "ap-south-1:f750196a-d766-4753-8a52-b297edc7c653",
    Logins: {
      [`cognito-idp.${region}.amazonaws.com/ap-south-1_F2wKjfLbl`]: idToken,
    },
  })

  return new Promise((resolve, reject) => {
    ; (AWS.config.credentials).get((err) => {
      if (err) {
        reject(err)
      } else {
        const iotCredentials = {
          "accessKeyId": AWS.config.credentials.accessKeyId,
          "secretKey": AWS.config.credentials.secretAccessKey,
          "sessionToken": AWS.config.credentials.sessionToken,
          "expiration": AWS.config.credentials.expireTime
        }
        localStorage.setItem("iotCredentials", JSON.stringify(iotCredentials));
        resolve(AWS.config.credentials)
      }
    })
  })
}

