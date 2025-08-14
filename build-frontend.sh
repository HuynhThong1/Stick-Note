#!/bin/bash

# Build script for configuring the frontend with the correct API URL
# Usage: ./build-frontend.sh [API_URL]
# Example: ./build-frontend.sh https://my-api.herokuapp.com

API_URL=${1:-"http://localhost:3000"}

echo "🔧 Building frontend with API_URL: $API_URL"

# Method 1: Create a production config file with the API URL
sed "s|__API_URL__|$API_URL|g" config.js > config.prod.js

# Method 2: Create a production HTML file with the API URL configured
cp index.html index.deployment.html
sed -i "s|<script src=\"config.js\"></script>|<script>\n    window.PUBLIC_API_URL = '$API_URL';\n  </script>\n  <script src=\"config.js\"></script>|g" index.deployment.html

echo "✅ Frontend built successfully!"
echo ""
echo "📦 Deployment options:"
echo "1. Use config.prod.js instead of config.js in your deployment"
echo "2. Use index.deployment.html which has the API URL pre-configured"
echo "3. Set window.PUBLIC_API_URL in your HTML before loading config.js"
echo ""
echo "🚀 For production deployment:"
echo "   - Copy index.deployment.html as your main HTML file"
echo "   - Or set window.PUBLIC_API_URL = '$API_URL' in your HTML"