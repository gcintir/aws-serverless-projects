const rootRequire = require('root-require');

const {handler} = require('../index');

describe('Test secrets-manager-usage-lambda', () => {
    beforeEach(async () => {
      jest.resetAllMocks();
    });
  
    it('Test lambda exists', async () => {
      expect.assertions(1);
      expect(handler).toBeTruthy();
    });
  });