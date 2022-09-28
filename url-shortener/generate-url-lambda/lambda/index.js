const { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand  } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const dynamodbClient = new DynamoDBClient({region: process.env.AWS_REGION});
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;

async function getItemByOrigUrl (origUrl) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      orig_url : {S: origUrl}
    }
  };
  const result = await dynamodbClient.send(new GetItemCommand(params));
  return result.Item ? unmarshall(result.Item) : {};
};

async function checkOrigUrlExists (origUrl) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      orig_url : {S: origUrl}
    },
    ProjectionExpression: 'orig_url'
  };
  const result = await dynamodbClient.send(new GetItemCommand(params));
  return result.Item ? true : false;
};

async function saveUrlData (origUrl, shortenedUrl, urlCode) {
  const timestamp = Date.now();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      orig_url: { S: origUrl},
      shortened_url: { S: shortenedUrl},
      url_code: { S: urlCode},
      timestamp: {N: `${timestamp}`}
    }
  };
  const result = await dynamodbClient.send(new PutItemCommand(params));
};

async function checkShortenedUrlExists (shortenedUrl) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    IndexName: 'shortened-url-index',
    KeyConditionExpression: "shortened_url = :u",
    ExpressionAttributeValues: {
      ":u": { S: shortenedUrl }
    },
    ProjectionExpression: "shortened_url",
  };
  const result = await dynamodbClient.send(new QueryCommand(params));
  return result.Items.length > 0 ? true : false;
}

const extractUrl = input => {
  return input.url;
};

const generateUrlData = url => {
  const randomString = Math.random().toString(36).substring(2,7);
  const shortenedUrl = url.replace(url.substring(url.indexOf('//') + 2, url.indexOf('.')), randomString);
  return {shortenedUrl, randomString};
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
    const url = extractUrl(event);
    if (await checkOrigUrlExists(url)) {
      response.body = {
        message: 'Already available'
      };
    } else {
      const {shortenedUrl, randomString} = generateUrlData(url);
      await saveUrlData(url, shortenedUrl, randomString);
      response.body = {
        message: 'Created',
        shortenedUrl
      };
    }
  } catch (error) {
    console.log(error);
  }
  
  return response;
}

exports.lambda = lambda;