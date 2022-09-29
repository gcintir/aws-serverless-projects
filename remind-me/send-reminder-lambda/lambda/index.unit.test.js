const rootRequire = require('root-require');

const {handler} = require('../index');

describe('Test send-reminder-lambda', () => {
    beforeEach(async () => {
      jest.resetAllMocks();
    });
  
    it('Test lambda exists', async () => {
      expect.assertions(1);
      expect(handler).toBeTruthy();
    });    
  });