const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { v4: uuidv4 } = require('uuid');

const dynamodbClient = new DynamoDBClient({region: process.env.AWS_REGION});
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;
const VALID_NOTIFICATION_TYPES = ['EMAIL', 'SMS', 'SLACK', 'PHONE'];
const MINIMUM_EXPIRY_DATE_DIFF_IN_SECONDS = 5 * 60;

async function saveReminderData (reminderData) {
   const {userId, expiryDate, notificationType, message} = reminderData;
   const timestamp = Date.now();
   const ttl_date = expiryDate / 1000;
   const params = {
      TableName: TABLE_NAME,
      Item: {
        id: { S: `${uuidv4()}`}, 
        user_id: { S: `${userId}`},
        expiry_date: { N: `${expiryDate}`},
        ttl : { N: `${ttl_date}`},
        notification_type: { S: `${notificationType}`},
        message: { S: `${message}`},
        creation_date: {N: `${timestamp}`}
      }
    };
    const result = await dynamodbClient.send(new PutItemCommand(params));
}

const validateReminderData = reminderData => {
   const {userId, expiryDate, notificationType, message} = reminderData;
   if (userId && expiryDate && notificationType && message) {
      if (!VALID_NOTIFICATION_TYPES.includes(notificationType)) {
         return false;
      }

      const parsedExpiryDate = new Date(expiryDate);
      const currentTime = new Date();
      const diff = (parsedExpiryDate - currentTime) / 1000;
      if (diff < MINIMUM_EXPIRY_DATE_DIFF_IN_SECONDS) {
         console.warn("diff is smaller than MINIMUM_EXPIRY_DATE_DIFF_IN_SECONDS. diff: " + diff);
         return false;
      }
      reminderData.expiryDate = parsedExpiryDate.getTime();
      return true;
   } else {
      return false;
   }
};

const extractReminderData = event => {
   return {
      "userId": event.userId,
      "expiryDate": event.expiryDate,
      "notificationType": event.notificationType,
      "message": event.message
   };
};

const lambda = async (event) => {
   const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
        },
      isBase64Encoded: false
    };

    try {
      console.log('Incoming event --> ' + JSON.stringify(event));
      const reminderData = extractReminderData (event);
      if (!validateReminderData(reminderData)) {
         response.statusCode = 400;
         response.body = {
            message: 'Invalid input parameters'
          };
      } else {
         await saveReminderData(reminderData);
         response.body = {
            message: 'Reminder saved successfully'
          };
      }
    } catch (error) {
      console.log(error)
    }
    return response;
}

exports.lambda = lambda;