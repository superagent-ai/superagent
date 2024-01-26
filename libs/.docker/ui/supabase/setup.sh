#!/bin/bash

# Configuration
SUPABASE_REPO="https://raw.githubusercontent.com/supabase/supabase/master/docker"
TARGET_DIR="./supabase-setup" # Set this to your desired directory

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    echo "curl could not be found. Please install curl and rerun the script."
    exit 1
fi

# Create necessary directories
mkdir -p "$TARGET_DIR/volumes/api"
mkdir -p "$TARGET_DIR/volumes/db/init"
mkdir -p "$TARGET_DIR/volumes/db"
mkdir -p "$TARGET_DIR/volumes/functions/main"
mkdir -p "$TARGET_DIR/volumes/logs"

# Function to download a file and maintain directory structure
download_file() {
    local file_path=$1
    local target_path="$TARGET_DIR/${file_path#*/docker/}"
    echo "Downloading $file_path..."
    curl -o "$target_path" "$SUPABASE_REPO/$file_path"
}

# List of files to download
files_to_download=(
    "volumes/api/kong.yml"
    "volumes/db/init/data.sql"
    "volumes/db/jwt.sql"
    "volumes/db/logs.sql"
    "volumes/db/realtime.sql"
    "volumes/db/roles.sql"
    "volumes/db/webhooks.sql"
    "volumes/functions/main/index.ts"
    "volumes/logs/vector.yml"
    "docker-compose.yml"
)

# Download each file
for file in "${files_to_download[@]}"; do
    download_file "$file"
done

# Note: Add any additional files or directories as needed
