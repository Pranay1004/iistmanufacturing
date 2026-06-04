#!/bin/bash

# Get commit message from argument
MSG="$1"

# If no argument is provided, prompt for a message
if [ -z "$MSG" ]; then
    echo -n "Enter commit message: "
    read MSG
fi

# Fallback to default message if still empty
if [ -z "$MSG" ]; then
    MSG="update: working changes"
fi

echo "Staging all changes..."
git add .

echo "Committing with message: '$MSG'..."
git commit -m "$MSG"

echo "Pushing to remote repository (origin main)..."
git push origin main

echo "Done!"
