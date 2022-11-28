const axios = require('axios');

const getSecret = async () => {
  const secretName = 'ApiAccessInformation';
  const config = {
    headers: {
      "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN
    }
  };
  const url = `http://localhost:2773/secretsmanager/get?secretId=${secretName}`;
  const response = await axios.get(url, config);
  return response.data;
};

const getConfiguration = async () => {
  const appConfigApplication = 'MyWebApplication';
  const appConfigEnvironment = 'DEV';
  const appConfigConfiguration = 'BackendApiConfiguration';
  const url = `http://localhost:2772/applications/${appConfigApplication}/environments/${appConfigEnvironment}/configurations/${appConfigConfiguration}`;
  const response = await axios.get(url);
  return response.data;
};

const lambda = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
      },
    isBase64Encoded: false,
    body: 'Success'
  };

  // retrieving application secret
  const apiAccessInformation = await getSecret();
  console.log(apiAccessInformation.SecretString);

  // retrieving application configuration
  const appConfiguration = await getConfiguration();
  console.log(JSON.stringify(appConfiguration));

  return response;
}

exports.lambda = lambda;