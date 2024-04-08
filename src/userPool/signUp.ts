
import {
  SignUpCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
require("dotenv").config();

type signUpRequestBody = {
  username: string;
  password: string;
  email: string;
  name: string;
  picture: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { username, password, email, name, picture } = JSON.parse(
    event.body!
  ) as signUpRequestBody;

  const client = new CognitoIdentityProviderClient({});

  const command = new SignUpCommand({
    ClientId: "arkqkja1b7uoqm2darbssfklk",
    Username: username,
    Password: password,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: name },
      { Name: "picture", Value: picture },
    ],
  });
  const res = await client.send(command);
  return {
    statusCode: res.$metadata.httpStatusCode,
    body: JSON.stringify(res),
  };
};
