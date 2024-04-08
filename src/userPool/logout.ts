import {
  GlobalSignOutCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const client = new CognitoIdentityProviderClient({});

type LogoutApiBody = {
  AccessToken: string;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ message: "plea" }) };
  }
  const { AccessToken } = JSON.parse(event.body) as LogoutApiBody;
  const command = new GlobalSignOutCommand({ AccessToken });

  const r = await client.send(command);

  return {
    status: r.$metadata.httpStatusCode,
    body: JSON.stringify({ message: "logout successfull" }),
  };
};
