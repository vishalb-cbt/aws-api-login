import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";
const s3 = new S3({ region: "ap-south-1" });

export const addItem: APIGatewayProxyHandlerV2 = async (req) => {
  const jsonFileData = req.body;
  console.log(jsonFileData);
  if (jsonFileData == null)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "json data is required",
      }),
    };
  const fileName = `data-${uuid()}.json`;

  s3.upload(
    {
      Bucket: "vishal-s3-bucket-assignment",
      Key: fileName,
      Body: jsonFileData,
    },
    function (err) {
      if (err)
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: "some error occured",
            err,
          }),
        };
    }
  );
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "successfully added to bucket",
      fileName,
    }),
  };
};
// url: host/list-items?bucketName=bucketName
export const listItemsByBucketName: APIGatewayProxyHandlerV2 = async (req) => {
  const { bucketName } = req.queryStringParameters as { bucketName: string };

  if (!bucketName)
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "bucketName is required",
      }),
    };
  const params = {
    Bucket: bucketName!,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    return { statusCode: 200, body: JSON.stringify(data.Contents) };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "invalid bucket name",
        error,
      }),
    };
  }
};

export const readFileFromS3: APIGatewayProxyHandlerV2 = async (req) => {
  const { bucketName, fileName } = req.queryStringParameters as {
    bucketName: string;
    fileName: string;
  };
  const file = await s3
    .getObject({ Bucket: bucketName, Key: fileName })
    .promise();
  if (!file.Body) {
    return {
      statusCode: 400,
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      fileContent: JSON.parse(file.Body.toString()) || "no data present",
    }),
  };
};
// url: host/list-items?bucketName=bucketName&fileName=fileName
export const deleteFileFromS3: APIGatewayProxyHandlerV2 = async (req) => {
  const { bucketName, fileName } = req.queryStringParameters as {
    bucketName: string;
    fileName: string;
  };
  try {
    await s3.headObject({ Bucket: bucketName, Key: fileName }).promise();

    const res = await s3
      .deleteObject({ Bucket: bucketName, Key: fileName })
      .promise();

    const data = res.$response.data;
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "file Deleted succesfully",
        data,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error,
      }),
    };
  }
};
