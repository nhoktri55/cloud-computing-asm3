const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

const createGamesTable = async () => {
    const command = new CreateTableCommand({
        TableName: 'BoardGameTrade-Games',
        KeySchema: [
            { AttributeName: 'gameId', KeyType: 'HASH' },
        ],
        AttributeDefinitions: [
            { AttributeName: 'gameId', AttributeType: 'S' },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    });

    try {
        const response = await client.send(command);
        console.log('Games table created:', response.TableDescription.TableName);
    } catch (err) {
        console.error('Error creating table:', err.message);
    }
};

createGamesTable();