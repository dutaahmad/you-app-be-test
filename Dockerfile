# Dockerfile
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Enable corepack and activate Yarn v4.9.1
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

# Copy dependency declarations
COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies (Yarn 4 using node-modules)
RUN yarn install --immutable

# Copy app source
COPY . .

# Build the app
RUN yarn build

# Expose app port
EXPOSE 5555

# Start the app
CMD ["node", "dist/main"]
