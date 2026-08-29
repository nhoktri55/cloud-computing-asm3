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

//API to get metada game by id
router.get('/thing/:id', async (req, res) => {
    try {
        const result = await docClient.send(new GetCommand({
            TableName: 'BoardGameTrade-Games',
            Key: { gameId: req.params.id },
        }));

        if (!result.Item) return res.status(404).json({ error: 'Game not found' });
        res.json(result.Item);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fetch failed' });
    }
});

module.exports = router;