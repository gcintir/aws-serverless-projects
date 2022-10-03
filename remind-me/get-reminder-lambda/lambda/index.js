const { DynamoDBClient, GetItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamodbClient = new DynamoDBClient({region: process.env.AWS_REGION});
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;
const PAGINATION_PAGE_SIZE = 2;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getReminderDataByPagination (userId) {
    let accumulated = [];
    let ExclusiveStartKey;

    while (true) {
        const params = {
            TableName: TABLE_NAME,
            ExclusiveStartKey,
            IndexName: 'user-id-index',
            Limit: PAGINATION_PAGE_SIZE,
            KeyConditionExpression: 'user_id = :uid',
            ExpressionAttributeValues: {
                ":uid": {'S': userId}
            }
        };
        const result = await dynamodbClient.send(new QueryCommand(params));
        accumulated = accumulated.concat(result.Items.map(e => unmarshall(e)));
        ExclusiveStartKey = result.LastEvaluatedKey;

        await sleep(1000);

        if (result.LastEvaluatedKey) {
            continue;
        } else {
            break;
        }
    }
    return accumulated;
};

async function getReminderDataById (id) {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id : {S: id}
        }
    };
    const result = await dynamodbClient.send(new GetItemCommand(params));
    return result.Item ? unmarshall(result.Item) : {};
};

const validateReminderSearchData = reminderSearchData => {
    const {userId} = reminderSearchData;
    if (!userId) {
        console.warn('userId could not be empty');
        return false;
    }
    return true;
};

const extractReminderSearchData = event => {
    return {
       "userId": event.userId,
       "id": event.id
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
        const reminderSearchData = extractReminderSearchData(event);
        if (!validateReminderSearchData(reminderSearchData)) {
            response.statusCode = 400;
            response.body = {
               message: 'Invalid input parameters'
             };
        } else {
            if (reminderSearchData.id) {
                const reminder = await getReminderDataById(reminderSearchData.id);
                response.body = JSON.stringify(reminder)
            } else {
                const reminders = await getReminderDataByPagination(reminderSearchData.userId);
                response.body = JSON.stringify(reminders)
            }
        }
    } catch(error) {
        console.log(error);
    }
    return response;
}

exports.lambda = lambda;