import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
const dynamoDB = new DynamoDB.DocumentClient();

type loginRequestBody = {
  username: string;
  password: string;
};

const TABLE_NAME = "vishal-dynamo-db-assignment";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { username, password } = JSON.parse(event.body!) as loginRequestBody;
  const client = new CognitoIdentityProviderClient({});

  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
    ClientId: "arkqkja1b7uoqm2darbssfklk",
  });

  try {
    const res = await client.send(command);
    console.log(res);

    const getUserCmd = new GetUserCommand({
      AccessToken: res.AuthenticationResult?.AccessToken,
    });

    const user = await client.send(getUserCmd);

    const params = {
      TableName: TABLE_NAME,
      Key: { __typeName: "User", username: user.Username },
    };
    const { Item } = await dynamoDB.get(params).promise();

    const { AuthenticationResult } = res;

    return {
      statusCode: 200,
      body: JSON.stringify({ AuthenticationResult, user: Item }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error,
      }),
    };
  }
};
