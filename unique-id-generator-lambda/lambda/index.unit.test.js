const rootRequire = require('root-require');

const {handler} = require('../index');

describe('Test unique-id-generator-lambda', () => {
    beforeEach(async () => {
      jest.resetAllMocks();
    });
  
    it('Test lambda exists', async () => {
      expect.assertions(1);
      expect(handler).toBeTruthy();
    });

    it('Should return status code 200 with valid input parameters', async () => {
        const input = rootRequire('resources/aws.input.json');
        const expectedResponse = {
            statusCode: 200
        };
        await expect(handler(input)).resolves.toMatchObject(expectedResponse);
        expect.assertions(1);
    });

    it('Should return status code 400 with invalid input parameters', async () => {
        const input = rootRequire('resources/aws.input.json');
        const expectedResponse = {
            statusCode: 400
        };
        input.queryStringParameters.size = 100;
        await expect(handler(input)).resolves.toMatchObject(expectedResponse);
        expect.assertions(1);
    });
    
  });