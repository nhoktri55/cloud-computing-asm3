const express = require('express');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { verifyToken } = require('./authRoutes');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const router = express.Router();

// Creeate conversationId
function getConversationId(listingId, email1, email2) {
    const emails = [email1, email2].sort();
    return `${listingId}#${emails[0]}#${emails[1]}`;
}

// Send message
router.post('/', verifyToken, async (req, res) => {
    const { listingId, toEmail, text } = req.body;

    if (!listingId || !toEmail || !text) {
        return res.status(400).json({ error: 'Missing listingId, toEmail, or text' });
    }

    const conversationId = getConversationId(listingId, req.user.email, toEmail);
    const timestamp = new Date().toISOString();

    const message = {
        conversationId,
        timestamp,
        listingId,
        fromEmail: req.user.email,
        toEmail,
        text,
    };

    try {
        await docClient.send(new PutCommand({
            TableName: 'BoardGameTrade-Messages',
            Item: message,
        }));
        res.status(201).json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Get the list all coversation of 1 listing (for the use post listing answer)
router.get('/listing/:listingId', verifyToken, async (req, res) => {
    const { listingId } = req.params;

    try {
        const result = await docClient.send(new ScanCommand({
            TableName: 'BoardGameTrade-Messages',
            FilterExpression: 'listingId = :lid AND (fromEmail = :me OR toEmail = :me)',
            ExpressionAttributeValues: { ':lid': listingId, ':me': req.user.email },
        }));

        const conversations = {};
        for (const m of result.Items) {
            const otherEmail = m.fromEmail === req.user.email ? m.toEmail : m.fromEmail;
            if (!conversations[otherEmail] || m.timestamp > conversations[otherEmail].timestamp) {
                conversations[otherEmail] = { otherEmail, lastMessage: m.text, timestamp: m.timestamp };
            }
        }

        const list = Object.values(conversations).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        res.json(list);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// Get all message of a conservation
router.get('/:listingId/:otherEmail', verifyToken, async (req, res) => {
    const { listingId, otherEmail } = req.params;
    const conversationId = getConversationId(listingId, req.user.email, otherEmail);

    try {
        const result = await docClient.send(new QueryCommand({
            TableName: 'BoardGameTrade-Messages',
            KeyConditionExpression: 'conversationId = :cid',
            ExpressionAttributeValues: { ':cid': conversationId },
        }));
        res.json(result.Items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;