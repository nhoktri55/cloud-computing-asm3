const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

const createUsersTable = async () => {
    const command = new CreateTableCommand({
        TableName: 'BoardGameTrade-Users',
        KeySchema: [
            { AttributeName: 'email', KeyType: 'HASH' }, // Primary key
        ],
        AttributeDefinitions: [
            { AttributeName: 'email', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    });

    try {
        const response = await client.send(command);
        console.log('Users table created:', response.TableDescription.TableName);
    } catch (err) {
        console.error('Error creating table:', err.message);
    }
};

createUsersTable();