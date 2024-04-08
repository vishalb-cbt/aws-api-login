import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import
type verfySignUpData = {
  username: string;
  code: string;
};

const client = new CognitoIdentityProviderClient({});
export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { username, code } = JSON.parse(event.body!) as verfySignUpData;
  const input = {
    // ConfirmSignUpRequest
    ClientId: "arkqkja1b7uoqm2darbssfklk", // required
    Username: username, // required
    ConfirmationCode: code, // required
  };
  const command = new ConfirmSignUpCommand(input);
  const response = await client.send(command);
  return { body: JSON.stringify({ response }) };
};
