# Build stage
FROM node:18-alpine AS build

# Accept the path to the environment file as a build argument
ARG ENV_FILE

# Install dependencies only when needed
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy the specified .env file to the current directory
COPY $ENV_FILE ./.env

# Copy and install the dependencies for the project
COPY package.json package-lock.json ./
RUN npm ci

# Copy all other project files to working directory
COPY . .

# Run the next build process and generate the artifacts
RUN npm run build

# Runner stage
FROM node:18-alpine AS runner

# Install bash in the runner stage
RUN apk add --no-cache bash

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
COPY --from=build /app/supabase ./supabase
# RUN cp ./supabase/config.docker.toml ./supabase/config.toml
# RUN rm ./supabase/config.toml
# COPY --from=build /app/override-env.sh ./override-env.sh
# RUN chmod +x override-env.sh

# Install production dependencies only
RUN npm ci --only=production

# Start the application
CMD printenv && npm run supabase:docker:push --debug && npm start
