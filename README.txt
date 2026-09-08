Cloud Computing Assignment 3 App - BoardGameTrade
s3924585-Le Chanh Tri

1. To run local: (You must have AWS Academy Learner Lab credentials configured for our account)
Step 1: At root: cd backend (change directory to backend folder)
Step 2: At backend: npm install (install backend dependencies)
Step 3: Create a .env file in backend with the following variables:

PORT=5000
AWS_REGION=us-east-1
JWT_SECRET= any random string 
BGG_TOKEN= token from our approved BoardGameGeek application

Step 4: At backend: npm run dev (Running backend at port 5000)
Step 5: Open new terminal at root: cd frontend (change directory to frontend folder)
Step 6: npm install (install frontend dependencies)
Step 7: Create a .env file in frontend with the following variables:

VITE_API_URL=http://localhost:5000/api
VITE_BGG_LAMBDA_URL=<API Gateway URL for the boardgametrade-bgg Lambda function>

Step 8: At frontend: npm run dev (Running frontend at http://localhost:5173/)

One-time setup scripts (run once from backend/, requires valid AWS credentials):
node scripts/setupDynamodb.js (creates the BoardGameTrade-Listings table)
node scripts/setupUsersTable.js (creates the BoardGameTrade-Users table)
node scripts/setupMessagesTable.js (creates the BoardGameTrade-Messages table)
node scripts/setupS3Bucket.js (creates the S3 bucket for listing images)

2. Live web link at:
http://boardgametrade-frontend-s3924585.s3-website-us-east-1.amazonaws.com

3. Reference IEEE
[1] Amazon Web Services, "Deploying a Node.js application to Elastic Beanstalk," AWS Elastic Beanstalk Developer Guide. [Online]. Available: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.html. [Accessed: Sep. 6, 2026].
[2] Amazon Web Services, "DynamoDB document client," AWS SDK for JavaScript v3 Developer Guide. [Online]. Available: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/migrate-dynamodb-doc-client.html. [Accessed: Sep. 6, 2026].
[3] Amazon Web Services, "DynamoDB examples using SDK for JavaScript (v3)," AWS SDK for JavaScript v3 Developer Guide. [Online]. Available: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_dynamodb_code_examples.html. [Accessed: Sep. 6, 2026].
[4] Amazon Web Services, "Amazon S3 examples using SDK for JavaScript (v3)," AWS SDK for JavaScript v3 Developer Guide. [Online]. Available: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html. [Accessed: Sep. 6, 2026].
[5] Amazon Web Services, "Creating a Lambda function with the console," AWS Lambda Developer Guide. [Online]. Available: https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html. [Accessed: Sep. 6, 2026].
[6] Amazon Web Services, "Tutorial: Configure a Lambda function to access Amazon API Gateway," AWS Lambda Developer Guide. [Online]. Available: https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html. [Accessed: Sep. 6, 2026].
[7] Amazon Web Services, "Building container images for Amazon ECS," Amazon Elastic Container Service Developer Guide. [Online]. Available: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html. [Accessed: Sep. 6, 2026].
[8] Amazon Web Services, "Amazon ECR private repositories," Amazon ECR User Guide. [Online]. Available: https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html. [Accessed: Sep. 6, 2026].
[9] Amazon Web Services, "Creating an EventBridge Scheduler schedule," Amazon EventBridge Scheduler User Guide. [Online]. Available: https://docs.aws.amazon.com/scheduler/latest/UserGuide/getting-started.html. [Accessed: Sep. 6, 2026].
[10] Amazon Web Services, "Running SQL queries using Amazon Athena," Amazon Athena User Guide. [Online]. Available: https://docs.aws.amazon.com/athena/latest/ug/querying-athena-tables.html. [Accessed: Sep. 6, 2026].
[11] Auth0, "jsonwebtoken," npm. [Online]. Available: https://www.npmjs.com/package/jsonwebtoken. [Accessed: Sep. 6, 2026].
[12] D. St-Amand, "bcryptjs," npm. [Online]. Available: https://www.npmjs.com/package/bcryptjs. [Accessed: Sep. 6, 2026].
[13] Multer contributors, "multer," npm. [Online]. Available: https://www.npmjs.com/package/multer. [Accessed: Sep. 6, 2026].
[14] BoardGameGeek, "Using the XML API," BoardGameGeek Wiki. [Online]. Available: https://boardgamegeek.com/using_the_xml_api. [Accessed: Sep. 6, 2026].