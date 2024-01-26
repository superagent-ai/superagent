#!/bin/bash

# getting changed files (only staged)
changes=$(git diff --name-only --cached | grep '^libs/superagent.*\.py$' | sed 's|^libs/superagent/||')

lint() {
    poetry run black $changes
    # sort imports 
    poetry run ruff check --select I --fix $changes
    # format code
    poetry run ruff check --fix $changes
    poetry run vulture $changes 
    git add $changes
    echo "Changes applied";
}

format() {
    poetry run black $changes --check
    poetry run ruff $changes
    poetry run vulture $changes 
}

if [ -n "$changes" ]; then
    case "$1" in
        lint)
            lint
            ;;
        format)
            format
            ;;
        *)
            echo "Invalid command. Usage: $0 [lint|format]"
            exit 1
            ;;
    esac
else
    echo "No changes";
fi
