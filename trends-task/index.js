const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const REGION = 'us-east-1';
const RESULTS_BUCKET = 'boardgametrade-images-s3924585';

// [3] Amazon Web Services, "DynamoDB examples using SDK for JavaScript (v3)."
// [4] Amazon Web Services, "Amazon S3 examples using SDK for JavaScript (v3)."
const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));
const s3 = new S3Client({ region: REGION });

async function computeTrends() {
    console.log('Fetching listings...');
    const result = await dynamo.send(new ScanCommand({ TableName: 'BoardGameTrade-Listings' }));
    const listings = result.Items || [];

    // Count listing by game
    const countByGame = {};
    const priceByGame = {};

    for (const listing of listings) {
        const name = listing.gameName || 'Unknown';
        countByGame[name] = (countByGame[name] || 0) + 1;
        priceByGame[name] = priceByGame[name] || [];
        if (typeof listing.price === 'number') priceByGame[name].push(listing.price);
    }

    const trends = Object.keys(countByGame).map((name) => {
        const prices = priceByGame[name];
        const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
        return { gameName: name, listingCount: countByGame[name], averagePrice: avgPrice };
    }).sort((a, b) => b.listingCount - a.listingCount);

    const output = {
        generatedAt: new Date().toISOString(),
        totalListings: listings.length,
        trends,
    };

    console.log('Computed trends:', JSON.stringify(output, null, 2));

    await s3.send(new PutObjectCommand({
        Bucket: RESULTS_BUCKET,
        Key: 'trends/latest.json',
        Body: JSON.stringify(output),
        ContentType: 'application/json',
    }));

    console.log('Uploaded trends to S3.');
}

computeTrends().catch((err) => {
    console.error('Error computing trends:', err);
    process.exit(1);
});