1. create table
aws dynamodb create-table --cli-input-json file://create-table-url-data.json

2. save data
aws dynamodb put-item --cli-input-json file://save-table-url-data.json

3. getting item with partition key
aws dynamodb get-item --table-name url_data --key '{\"orig_url\": {\"S\": \"abc123456\"}}'

4. Query data based on partition key
aws dynamodb query  --table-name url_data --key-condition-expression "orig_url = :param" --expression-attribute-values '{\":param\": {\"S\": \"abc123456\"}}'

5. Query data based on global secondary index
aws dynamodb query  --table-name url_data --index-name shortened-url-index --key-condition-expression "shortened_url = :param" --expression-attribute-values '{\":param\": {\"S\": \"xyz\"}}'

6. Get info about table
aws dynamodb describe-table --table-name url_data

7. Delete table
aws dynamodb delete-table --table-name url_data