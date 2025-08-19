FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Expose proxy port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production

# Run the proxy
CMD ["npm", "start"]