const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const bggRoutes = require('./routes/bggRoutes');
const trendsRoutes = require('./routes/trendsRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://boardgametrade-frontend-s3924585.s3-website-us-east-1.amazonaws.com',
    ],
    credentials: true,
}));

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bgg', bggRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));