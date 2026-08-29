const { S3Client, CreateBucketCommand, PutBucketCorsCommand, PutPublicAccessBlockCommand, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const client = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = 'boardgametrade-images-s3924585';

const createBucket = async () => {
    try {
        await client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
        console.log('Bucket created:', BUCKET_NAME);

        await client.send(new PutBucketCorsCommand({
            Bucket: BUCKET_NAME,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ['*'],
                        AllowedMethods: ['GET', 'PUT', 'POST'],
                        AllowedOrigins: ['*'],
                        ExposeHeaders: [],
                    },
                ],
            },
        }));
        console.log('CORS configured');

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
                Statement: [
                    {
                        Sid: 'PublicReadGetObject',
                        Effect: 'Allow',
                        Principal: '*',
                        Action: 's3:GetObject',
                        Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
                    },
                ],
            }),
        }));
        console.log('Public read access configured');
    } catch (err) {
        console.error('Error:', err.message);
    }
};

createBucket();