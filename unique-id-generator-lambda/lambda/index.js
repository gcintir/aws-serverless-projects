//const http = require('http');

const UNIQUE_ID_TYPES = ['ONLY_NUMBERS', 'ONLY_CHARS', 'NUMBERS_AND_CHARS'];
const UNIQUE_ID_MIN_SIZE = 4;
const UNIQUE_ID_MAX_SIZE = 10;
const UNIQUE_ID_DEFAULT_SIZE = 8;
const ONLY_CHARS ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const ONLY_NUMBERS ='0123456789';

class ApplicationError extends Error {
  constructor(errorCode, errorMessage) {
    super(errorMessage);
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
    this.name = 'ApplicationError';
  }
}

function validateInputParameters (uniqueIdType, uniqueIdSize) {
  if (!uniqueIdType) {
    const error = new ApplicationError(400, 'Empty type parameter');
    throw error;
  }
  if (UNIQUE_ID_TYPES.indexOf(uniqueIdType) === -1) {
    const error = new ApplicationError(400, 'Invalid type parameter');
    throw error;
  }
  if (uniqueIdSize < UNIQUE_ID_MIN_SIZE || uniqueIdSize > UNIQUE_ID_MAX_SIZE) {
    const error = new ApplicationError(400, 'Invalid size parameter');
    throw error;
  }
}

function generateUniqueId (uniqueIdType, uniqueIdSize) {
  let uniqueId = '';
  if (uniqueIdType === 'ONLY_NUMBERS') {
    for (let i = 0; i < uniqueIdSize; i++) {
      uniqueId += ONLY_NUMBERS.charAt(Math.floor(Math.random() * ONLY_NUMBERS.length));
    }
  } else if (uniqueIdType === 'ONLY_CHARS') {
    for (let i = 0; i < uniqueIdSize; i++ ) {
      uniqueId += ONLY_CHARS.charAt(Math.floor(Math.random() * ONLY_CHARS.length));
    }
  } else { // uniqueIdType = NUMBERS_AND_CHARS
    const charSize = uniqueIdSize / 2;
    const numberSize = uniqueIdSize - charSize;
    for ( let i = 0; i < charSize; i++ ) {
      uniqueId += ONLY_CHARS.charAt(Math.floor(Math.random() * ONLY_CHARS.length));
    }
    for ( let i = 0; i < numberSize; i++ ) {
      uniqueId += ONLY_NUMBERS.charAt(Math.floor(Math.random() * ONLY_NUMBERS.length));
    }
  }
  return uniqueId;
}

const lambda = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
      },
    isBase64Encoded: false
  };

  try {
    console.log(`Incoming event ${JSON.stringify(event)}`);
    const uniqueIdType = event?.queryStringParameters?.type;
    const uniqueIdSize = event?.queryStringParameters?.size ? event?.queryStringParameters?.size : UNIQUE_ID_DEFAULT_SIZE;
    console.log(`uniqueIdType: ${uniqueIdType} uniqueIdSize: ${uniqueIdSize}`);
    validateInputParameters(uniqueIdType, uniqueIdSize);
    const id = generateUniqueId(uniqueIdType, uniqueIdSize);
    response.body = JSON.stringify({id});

  } catch (error) {
    console.log(error);
    if (error instanceof ApplicationError) {
      response.statusCode = error.errorCode;
      const errorMessage = error.errorMessage;
      response.body = JSON.stringify({errorMessage});
    } else {
      response.statusCode = 500;
      const errorMessage = 'Internal server error';
      response.body = JSON.stringify({errorMessage});
    }
  }
  return response;
}

exports.lambda = lambda;