const express = require('express');
const { randomUUID } = require('crypto');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { verifyToken } = require('./authRoutes');
const { getGameById } = require('../utils/bggClient');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const router = express.Router();

//API to create a listing (a game)
router.post('/', verifyToken, async (req, res) => {
    const { gameId, description, price, type, imageUrl } = req.body;

    if (!gameId || !price || !type) {
        return res.status(400).json({ error: 'Missing gameId, price, or type' });
    }

    try {
        // Get metadata live from BGG
        const game = await getGameById(gameId);

        if (!game) {
            return res.status(404).json({ error: 'Game not found. Please pick a game from search results.' });
        }

        const listing = {
            listingId: randomUUID(),
            gameId: game.gameId,
            gameName: game.name,
            gameYearPublished: game.yearPublished,
            gameRating: game.rating,
            gameComplexity: game.complexity,
            gameMinPlayers: game.minPlayers,
            gameMaxPlayers: game.maxPlayers,
            description: description || '',
            price,
            type, // "sell" or "trade"
            imageUrl: imageUrl || null,
            sellerEmail: req.user.email,
            sellerName: req.user.name,
            createdAt: new Date().toISOString(),
        };

        await docClient.send(new PutCommand({
            TableName: 'BoardGameTrade-Listings',
            Item: listing,
        }));

        res.status(201).json(listing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create listing' });
    }
});

//API to get all listings 
router.get('/', async (req, res) => {
    try {
        const result = await docClient.send(new ScanCommand({
            TableName: 'BoardGameTrade-Listings',
        }));
        res.json(result.Items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

//API to get one listing by id
router.get('/:id', async (req, res) => {
    try {
        const result = await docClient.send(new GetCommand({
            TableName: 'BoardGameTrade-Listings',
            Key: { listingId: req.params.id },
        }));
        if (!result.Item) return res.status(404).json({ error: 'Listing not found' });
        res.json(result.Item);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch listing' });
    }
});

//API to delete a listing (only the owner can delete)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const existing = await docClient.send(new GetCommand({
            TableName: 'BoardGameTrade-Listings',
            Key: { listingId: req.params.id },
        }));

        if (!existing.Item) return res.status(404).json({ error: 'Listing not found' });
        if (existing.Item.sellerEmail !== req.user.email) {
            return res.status(403).json({ error: 'Not your listing' });
        }

        await docClient.send(new DeleteCommand({
            TableName: 'BoardGameTrade-Listings',
            Key: { listingId: req.params.id },
        }));
        res.json({ message: 'Listing deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete listing' });
    }
});

module.exports = router;