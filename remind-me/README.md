# RemindMe
RemindMe is mainly used to manage your reminders on the cloud and RemindMe reminds you your reminders in time via notification.
RemindMe is designed as serverless application with serverless components.


It consists of
* set-reminder-lambda: used to save reminder with expiry date
* get-reminder-lambda: used to display reminders
* send-reminder-lambda: used to send notification to users for their expired reminders
* dynamodb: used to persist reminder records
#


# Install & Test & Zip:

## cd to set-reminder-lambda folder
```
npm install
npm test
npm prune --production
zip -r set-reminder-lambda.zip *
```
## cd to get-reminder-lambda folder
```
npm install
npm test
npm prune --production
zip -r get-reminder-lambda.zip *
```
## cd to send-reminder-lambda folder
```
npm install
npm test
npm prune --production
zip -r send-reminder-lambda.zip *
```


# Deploy to AWS

## update code
```
aws lambda update-function-code --function-name set-reminder-lambda --zip-file fileb://set-reminder-lambda.zip
```
```
aws lambda update-function-code --function-name get-reminder-lambda --zip-file fileb://get-reminder-lambda.zip
```
```
aws lambda update-function-code --function-name send-reminder-lambda --zip-file fileb://send-reminder-lambda.zip
```

## update environment variable
```
 aws lambda update-function-configuration --function-name set-reminder-lambda --environment file://aws-lambda-example.env.json
 ```
 ```
 aws lambda update-function-configuration --function-name get-reminder-lambda --environment file://aws-lambda-example.env.json
 ```
  ```
 aws lambda update-function-configuration --function-name send-reminder-lambda --environment file://aws-lambda-example.env.json
 ```

## invoke code
```
aws lambda invoke --function-name set-reminder-lambda --invocation-type Event --cli-binary-format raw-in-base64-out --payload file://resources/aws.input.json response.json

 ```
 ```
aws lambda invoke --function-name get-reminder-lambda --invocation-type Event --cli-binary-format raw-in-base64-out --payload file://resources/aws.input.json response.json

 ```
  ```
aws lambda invoke --function-name send-reminder-lambda --invocation-type Event --cli-binary-format raw-in-base64-out --payload file://resources/aws.input.json response.json

 ```

 ## create dynamodb structure

```
 aws dynamodb create-table --cli-input-json file://resources/create-table-reminder-data.json
 ```

