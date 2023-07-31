# Build stage
FROM node:18-alpine AS build

# Install dependencies only when needed
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy and install the dependencies for the project
COPY package.json package-lock.json ./
RUN npm ci

# Copy all other project files to working directory
COPY . .

# Run the next build process and generate the artifacts
RUN npm run build

# Runner stage
FROM node:18-alpine AS runner

# Set environment variables
ENV NODE_ENV production

# Set working directory
WORKDIR /app

# Copy the next files from the build stage
COPY --from=build /app/.next ./.next

# Copy the public folder from the build stage
COPY --from=build /app/public ./public

# Copy the package.json and package-lock.json files from the build stage
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json

# Install production dependencies only
RUN npm ci --only=production

# Start the application
CMD ["npm", "start"]
