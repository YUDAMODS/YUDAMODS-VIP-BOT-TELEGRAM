#!/bin/bash

# Grant execute permission to main.sh
chmod +x main.sh

# Install dependencies
npm install telegraf axios cheerio fs gradient-string pino

# Run the bot
node index.js
