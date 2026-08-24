const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

const createListingsTable = async () => {
    const command = new CreateTableCommand({
        TableName: 'BoardGameTrade-Listings',
        KeySchema: [
            { AttributeName: 'listingId', KeyType: 'HASH' }, // Primary key
        ],
        AttributeDefinitions: [
            { AttributeName: 'listingId', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    });

    try {
        const response = await client.send(command);
        console.log('Listings table created:', response.TableDescription.TableName);
    } catch (err) {
        console.error('Error creating table:', err.message);
    }
};

createListingsTable();