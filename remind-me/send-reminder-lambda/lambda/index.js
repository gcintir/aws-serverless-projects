const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamodbClient = new DynamoDBClient({region: process.env.AWS_REGION});


/*
** Flow:
- It should be triggered by dynamodb event when a record is deleted
- It should send notification to users based on notificationType parameter of reminder record.
- In case of failures, it should retry up to 3 times then related message should go to DLQ

*/

const lambda = async (event) => {

}

exports.lambda = lambda;