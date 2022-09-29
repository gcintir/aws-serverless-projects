const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamodbClient = new DynamoDBClient({region: process.env.AWS_REGION});

   /**
    * 
    ** Input parameters
    {
    "id": 0,
    "userId": "", mandatory
    "expiryDate": "", mandatory, should be in UTC+0 timezone with predefined format
    "notificationType": "", mandatory
    "message": "" mandatory
    }

    ** Validation steps:
    - expiryDate should be bigger than now with diffrence at least 5 minutes
    - notificationType could be EMAIL, SMS, SLACK, PHONE

    ** flow
    - validates input fields
    - save reminder with TTL = expiryDate (in unix timestamp seconds)

     */

const lambda = async (event) => {
}

exports.lambda = lambda;