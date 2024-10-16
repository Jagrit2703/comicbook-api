const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

// Initialize DynamoDB client
const dynamoDbClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
});

module.exports = dynamoDbClient;
