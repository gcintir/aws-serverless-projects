const event = require('./resources/aws.input.json');
process.env = require('./config/aws-lambda-example.env.json').Variables;
const {handler} = require('.');

handler(event).then(console.log).catch(console.log);
