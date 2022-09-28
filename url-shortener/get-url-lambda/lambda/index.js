const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamodbClient = new DynamoDBClient({region: process.env.AWS_REGION});
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

async function getShortenedUrlByOrigUrl (origUrl) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      orig_url : {S: origUrl}
    },
    ProjectionExpression: 'shortened_url'
  };
  const result = await dynamodbClient.send(new GetItemCommand(params));
  return result.Item ? unmarshall(result.Item) : undefined;
};

const extractUrl = input => {
  return input.url;
};

const lambda = async (event) => {
  const response = {
    headers: {
      'Content-Type': 'application/json'
      },
    isBase64Encoded: false
  };
  
  try {
    console.log('Incoming event --> ' + JSON.stringify(event));
    const url = extractUrl(event);
    const shortenedUrl = await getShortenedUrlByOrigUrl(url);
    if (shortenedUrl) {
      response.statusCode = 302;
      response.body = {
        shortenedUrl
      };
    } else {
      response.statusCode = 404;
    }
  } catch (error) {
    console.log(error);
  }
  
  return response;
}

exports.lambda = lambda;