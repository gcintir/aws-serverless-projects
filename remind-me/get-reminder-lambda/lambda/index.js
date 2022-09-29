const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamodbClient = new DynamoDBClient({region: process.env.AWS_REGION});


/*
** Input parameters
{
    "userId": "0" mandatory,
    "id": "",
    "paginationParams"
}

** Flow
- validate input parameters
- retrieve reminder records of user and return
*/

const lambda = async (event) => {

}

exports.lambda = lambda;