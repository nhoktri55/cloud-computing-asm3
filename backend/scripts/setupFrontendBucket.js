const { S3Client, CreateBucketCommand, PutBucketWebsiteCommand, PutPublicAccessBlockCommand, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');

const client = new S3Client({ region: 'us-east-1' });
const BUCKET_NAME = 'boardgametrade-frontend-s3924585';

const setup = async () => {
    try {
        await client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
        console.log('Bucket created:', BUCKET_NAME);

        await client.send(new PutPublicAccessBlockCommand({
            Bucket: BUCKET_NAME,
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: false,
                IgnorePublicAcls: false,
                BlockPublicPolicy: false,
                RestrictPublicBuckets: false,
            },
        }));

        await client.send(new PutBucketPolicyCommand({
            Bucket: BUCKET_NAME,
            Policy: JSON.stringify({
                Version: '2012-10-17',
                Statement: [{
                    Sid: 'PublicReadGetObject',
                    Effect: 'Allow',
                    Principal: '*',
                    Action: 's3:GetObject',
                    Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
                }],
            }),
        }));

        await client.send(new PutBucketWebsiteCommand({
            Bucket: BUCKET_NAME,
            WebsiteConfiguration: {
                IndexDocument: { Suffix: 'index.html' },
                ErrorDocument: { Key: 'index.html' },
            },
        }));

        console.log('Static website hosting configured.');
        console.log(`Website URL: http://${BUCKET_NAME}.s3-website-us-east-1.amazonaws.com`);
    } catch (err) {
        console.error('Error:', err.message);
    }
};

setup();