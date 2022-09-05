const lambda = async (event) => {
  const response = {
    statusCode: 200,
    body: "OK",
    headers: {
      'Content-Type': 'application/json'
      },
    isBase64Encoded: false
  };
  return response;
}

exports.lambda = lambda;