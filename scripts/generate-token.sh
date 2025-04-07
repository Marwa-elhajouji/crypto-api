#!/bin/bash

# Check if ts-node is installed
if ! command -v ts-node &> /dev/null
then
    echo "ts-node is not installed. Install it using: npm install -g ts-node"
    exit 1
fi

# Check if a payload argument is provided
if [ -z "$1" ]
then
    echo "Usage: ./generate-token.sh '{\"userId\":123}'"
    exit 1
fi

# Execute the TypeScript script with the provided payload argument
ts-node ./path/to/cli-generate-token.ts "$1"
