# Use the official lightweight Node.js image
FROM node:24-alpine3.22

# Create app directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy application source code
COPY . .

# Expose the port Cloud Run expects
EXPOSE 8080

# Start the server
CMD [ "node", "src/index.js" ]