const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);
const router = express.Router();

//API to register
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Missing email, password, or name' });
    }

    try {
        const existing = await docClient.send(new GetCommand({
            TableName: 'BoardGameTrade-Users',
            Key: { email },
        }));

        if (existing.Item) {
            return res.status(409).json({ error: 'Your email have been used. Please try other email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await docClient.send(new PutCommand({
            TableName: 'BoardGameTrade-Users',
            Item: { email, password: hashedPassword, name, createdAt: new Date().toISOString() },
        }));

        res.status(201).json({ message: 'User register successfully', email, name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

//API to login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
    }

    try {
        const result = await docClient.send(new GetCommand({
            TableName: 'BoardGameTrade-Users',
            Key: { email },
        }));

        if (!result.Item) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, result.Item.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create JWT token, storage email & name, expired after 24h
        const token = jwt.sign(
            { email: result.Item.email, name: result.Item.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ message: 'Login successfully', token, email: result.Item.email, name: result.Item.name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Check current user (use below middleware verifyToken)
router.get('/me', verifyToken, (req, res) => {
    res.json(req.user);
});

// Middleware to check token validation or not
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization; // "Bearer <token>"
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = decoded;
        next();
    });
}

module.exports = router;
module.exports.verifyToken = verifyToken;