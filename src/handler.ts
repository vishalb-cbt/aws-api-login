"use strict";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Login, validateLoginSchema } from "./schema/Login";

export const hello: APIGatewayProxyHandlerV2 = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const validateLoginCredentials = (loginCredentials: Login) => {
  const { username, password } = loginCredentials;
  if (username !== "admin" && password !== "password") {
    return false;
  }
  return true;
};

export const login: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const loginCredentials = JSON.parse(event.body as string) as Login;

    const { error } = validateLoginSchema(loginCredentials);

    let apiRes: object;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (error) {
      apiRes = {
        headers,
        statusCode: 400,
        body: JSON.stringify({ error }),
      };
    }

    const result = validateLoginCredentials(loginCredentials);

    if (!result) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          statusCode: 400,
          message: "invalid username or password",
        }),
      };
    }

    apiRes = {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        statusCode: 200,
        message: "logged in successfully",
      }),
    };

    return apiRes;
  } catch (error) {
    return {
      statusCode: 400,
      message: "error",
    };
  }
};
