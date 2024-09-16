#!/bin/bash

# Check if a commit message was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <commit message>"
    exit 1
fi

# Store the commit message
COMMIT_MESSAGE="$1"

# Add all changes
git add .

# Commit with the provided message
git commit -m "$COMMIT_MESSAGE"

# Push to the main branch
git push -u origin main

echo "Changes have been committed and pushed to the main branch."