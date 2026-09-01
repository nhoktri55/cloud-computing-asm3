const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const router = express.Router();

//API to search game
router.get('/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Missing query param' });

    try {
        const result = await docClient.send(new ScanCommand({
            TableName: 'BoardGameTrade-Games',
        }));

        const matches = result.Items.filter((game) =>
            game.name.toLowerCase().includes(query.toLowerCase())
        );

        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;