import { PostConfirmationConfirmSignUpTriggerEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
const dynamoDB = new DynamoDB.DocumentClient();
type userInfo = {
  name: string;
  email: string;
  email_verified: string;
  picture: string;
  id: string;
};

const TABLE_NAME = "vishal-dynamo-db-assignment";

export const handler = async (
  event: PostConfirmationConfirmSignUpTriggerEvent
) => {
  const { email, email_verified, name, picture, id } = event.request
    .userAttributes as userInfo;
  const params = {
    TableName: TABLE_NAME,
    Item: {
      email,
      email_verified,
      name,
      picture,
      username: event.userName,
      id,
      __typeName: "User",
    },
  };
  const res = await dynamoDB.put(params).promise();
  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
};
