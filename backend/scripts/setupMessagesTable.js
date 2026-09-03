const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

const createMessagesTable = async () => {
    const command = new CreateTableCommand({
        TableName: 'BoardGameTrade-Messages',
        KeySchema: [
            { AttributeName: 'conversationId', KeyType: 'HASH' },
            { AttributeName: 'timestamp', KeyType: 'RANGE' },
        ],
        AttributeDefinitions: [
            { AttributeName: 'conversationId', AttributeType: 'S' },
            { AttributeName: 'timestamp', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    });

    try {
        const response = await client.send(command);
        console.log('Messages table created:', response.TableDescription.TableName);
    } catch (err) {
        console.error('Error creating table:', err.message);
    }
};

createMessagesTable();