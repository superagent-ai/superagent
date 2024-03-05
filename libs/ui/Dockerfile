# Build stage
FROM node:18-buster AS build

# Accept NEXT_PUBLIC_* variables as build arguments
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SUPERAGENT_API_URL
ARG NEXT_PUBLIC_SUPABASE_STORAGE_NAME
ARG NEXT_PUBLIC_APIDECK_API_KEY
ARG NEXT_PUBLIC_APIDECK_API_ID
ARG NEXT_PUBLIC_STRIPE_SECRET_KEY
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY
ARG NEXT_PUBLIC_LANGFUSE_BASE_URL

# Set the environment variables
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV NEXT_PUBLIC_SUPERAGENT_API_URL=${NEXT_PUBLIC_SUPERAGENT_API_URL}
ENV NEXT_PUBLIC_SUPABASE_STORAGE_NAME=${NEXT_PUBLIC_SUPABASE_STORAGE_NAME}
ENV NEXT_PUBLIC_APIDECK_API_KEY=${NEXT_PUBLIC_APIDECK_API_KEY}
ENV NEXT_PUBLIC_APIDECK_API_ID=${NEXT_PUBLIC_APIDECK_API_ID}
ENV NEXT_PUBLIC_STRIPE_SECRET_KEY=${NEXT_PUBLIC_STRIPE_SECRET_KEY}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY=${NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY}
ENV NEXT_PUBLIC_LANGFUSE_BASE_URL=${NEXT_PUBLIC_LANGFUSE_BASE_URL}

# Install dependencies only when needed
RUN apt-get update && apt-get install -y \
    libc6-dev \
    libvips-dev \
    libfftw3-dev \
    build-essential \
    python3

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
FROM node:18-buster AS runner

# Install bash and netcat in the runner stage
RUN apt-get update && apt-get install -y bash netcat-openbsd libvips-dev libfftw3-dev build-essential python3

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

# Install production dependencies only
RUN npm ci --only=production

# Start the application
CMD npm start
