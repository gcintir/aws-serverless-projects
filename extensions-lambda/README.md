# extensions lambda
This lambda function is an example on how to retrieve application secret and application configuration by using lambda extensions

# Install & Test & Zip:

## cd to extensions-lambda lambda folder
```
npm install
npm test
npm prune --production
zip -r extensions-lambda.zip *
```

# Deploy to AWS

## update code
```
aws lambda update-function-code --function-name extensions-lambda --zip-file fileb://extensions-lambda.zip
```
## update environment variable
```
 aws lambda update-function-configuration --function-name extensions-lambda --environment file://extensions-lambda.env.json
 ```

## invoke code
```
aws lambda invoke --function-name extensions-lambda --invocation-type Event --cli-binary-format raw-in-base64-out --payload file://resources/aws.input.json response.json

 ```
