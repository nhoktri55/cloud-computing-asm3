# [7] Amazon Web Services, "Building container images for Amazon ECS," Amazon ECS Developer Guide.
# [8] Amazon Web Services, "Amazon ECR private repositories," Amazon ECR User Guide.
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY index.js ./

CMD ["node", "index.js"]