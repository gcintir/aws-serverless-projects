# URL Shortener
It consists of two lambda functions:
* generate-url-lambda: used to generate short urls for long urls
* get-url-lambda: used to query shortened urls by original urls


# Install & Test & Zip:

## cd to generate-url-lambda folder
```
npm install
npm test
npm prune --production
zip -r generate-url-lambda.zip *
```
## cd to get-url-lambda folder
```
npm install
npm test
npm prune --production
zip -r get-url-lambda.zip *
```


# Deploy to AWS

## update code
```
aws lambda update-function-code --function-name generate-url-lambda --zip-file fileb://generate-url-lambda.zip
```
```
aws lambda update-function-code --function-name get-url-lambda --zip-file fileb://get-url-lambda.zip
```

## update environment variable
```
 aws lambda update-function-configuration --function-name generate-url-lambda --environment file://aws-lambda-example.env.json
 ```
 ```
 aws lambda update-function-configuration --function-name get-url-lambda --environment file://aws-lambda-example.env.json
 ```

## invoke code
```
aws lambda invoke --function-name generate-url-lambda --invocation-type Event --cli-binary-format raw-in-base64-out --payload file://resources/aws.input.json response.json

 ```
 ```
aws lambda invoke --function-name get-url-lambda --invocation-type Event --cli-binary-format raw-in-base64-out --payload file://resources/aws.input.json response.json

 ```

