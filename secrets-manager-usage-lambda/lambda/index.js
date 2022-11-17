const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const secretsManagerClient = new SecretsManagerClient({region: process.env.AWS_REGION}); // region in which you store your secret

const lambda = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
      },
    isBase64Encoded: false
  };

  const params = {
    SecretId: 'ApiAccessInformation' // secret name
  };
  const getSecretValueCommand = new GetSecretValueCommand(params);

  const resp = await secretsManagerClient.send(getSecretValueCommand);

  console.log(resp.SecretString);
  response.body = JSON.parse(resp.SecretString);

  return response;
}

exports.lambda = lambda;