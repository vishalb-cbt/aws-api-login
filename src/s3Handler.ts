import { S3CreateEvent } from "aws-lambda";
import { S3, DynamoDB } from "aws-sdk";
import { read, utils } from "xlsx";
// export const pushItemToDynamoDB = async (event: S3CreateEvent) => {
//   const bucketName = event.Records[0].s3.bucket.name;
//   const awsRegion = event.Records[0].awsRegion;
//   const key = event.Records[0].s3.object.key;
//   const objectUrl = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${key}`;
// };

const s3 = new S3({ apiVersion: "2006-03-01" });
const dynamoDB = new DynamoDB.DocumentClient({ region: "ap-south-1" });

export const pushItemToDynamoDB = async (event: S3CreateEvent) => {
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  try {
    // Fetch Excel file from S3 bucket
    const s3Response = await s3
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();

    // Read Excel file into JSON
    const workbook = read(s3Response.Body);
    const sheetName = workbook.SheetNames[0];
    const sheetData = utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Insert JSON data into DynamoDB
    const tableName = "vishal-xlsx-to-db-assignment";
    const dynamoBatchWriteParams: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        [tableName]: sheetData.map((item) => ({
          PutRequest: {
            Item: item as AWS.DynamoDB.DocumentClient.PutItemInputAttributeMap,
          },
        })),
      },
    };

    const dynamoResponse = await dynamoDB
      .batchWrite(dynamoBatchWriteParams)
      .promise();
    console.log("Data inserted into DynamoDB:", dynamoResponse);
  } catch (error) {
    console.error("Error:", error);
  }
};
