import { DynamoDB } from "aws-sdk";
const dynamoDB = new DynamoDB.DocumentClient();

const TABLE_NAME = "vishalDynamoDBTableA";

// Insert operation
type Employee = {
  employeeType: string;
  employeeId: string;
  name: string;
  age: number;
};

async function insertItem(item: Employee) {
  const params = {
    TableName: TABLE_NAME,
    Item: item,
  };
  return await dynamoDB.put(params).promise();
}
export async function addEmployee(event: Employee) {
  try {
    const res = await insertItem(event);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}

// Update operation
async function updateItem(
  employeeId: string,
  employeeType: string,
  updatedAttributes: Employee
) {
  const params = {
    TableName: TABLE_NAME,
    Key: { employeeType, employeeId },
    UpdateExpression:
      "SET #attr3 = :val3, #attr4 = :val4",
    ExpressionAttributeNames: {
      "#attr3": "name",
      "#attr4": "age",
    },  
    ExpressionAttributeValues: {
      ":val3": updatedAttributes.name,
      ":val4": updatedAttributes.age,
    },
  };
  return await dynamoDB.update(params).promise();
}

export async function updateEmployee(event: Employee) {
  try {
    const res = await updateItem(event.employeeId, event.employeeType, event);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}

// Delete operation
async function deleteItem(employeeId: string, employeeType: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: { employeeType, employeeId },
  };
  await dynamoDB.delete(params).promise();
}
export async function deleteEmployee(event: Partial<Employee>) {
  try {
    const res = await deleteItem(event.employeeId!, event.employeeType!);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}

// Get by ID operation
async function getItemById(employeeId: string, employeeType: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: { employeeType, employeeId },
  };
  const response = await dynamoDB.get(params).promise();
  return response.Item;
}
export async function getEmployee(event: Employee) {
  try {
    const res = await getItemById(event.employeeId, event.employeeType);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}

// Get all items operation
async function getAllItems() {
  const params = {
    TableName: TABLE_NAME,
  };
  const response = await dynamoDB.query(params).promise();
  return response.Items;
}
export async function getAllEmployees() {
  try {
    const res = await getAllItems();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
