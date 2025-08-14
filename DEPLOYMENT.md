# Deployment Setup Instructions

This document provides step-by-step instructions for setting up automated deployment of the Stick Note API.

## Overview

The API can be deployed to multiple hosting platforms:
- **Render** (recommended for simplicity)
- **Railway** (good for advanced features)
- **Any Docker-compatible platform**

## Option 1: Render Deployment

### 1. Create Render Account
1. Sign up at [render.com](https://render.com)
2. Connect your GitHub account

### 2. Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `stick-note-api`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

### 3. Configure Environment Variables
In Render dashboard, add:
- `NODE_ENV`: `production`
- `PORT`: (leave empty, Render sets this automatically)

### 4. Setup GitHub Secrets (for automated deployment)
In your GitHub repository settings → Secrets and variables → Actions:
- `RENDER_SERVICE_ID`: Your service ID from Render dashboard
- `RENDER_API_KEY`: Generate in Render account settings
- `RENDER_SERVICE_URL`: Your service URL (e.g., `https://stick-note-api.onrender.com`)

## Option 2: Railway Deployment

### 1. Create Railway Account
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub account

### 2. Deploy from GitHub
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your repository
3. Railway will automatically detect the Node.js app

### 3. Configure Environment Variables
In Railway dashboard:
- `NODE_ENV`: `production`
- `PORT`: (Railway sets this automatically)

### 4. Setup GitHub Secrets (for automated deployment)
In your GitHub repository settings → Secrets and variables → Actions:
- `RAILWAY_TOKEN`: Generate in Railway account settings
- `RAILWAY_SERVICE_NAME`: Your service name (optional, defaults to `stick-note-api`)
- `RAILWAY_SERVICE_URL`: Your service URL

## Option 3: Docker Deployment

The application includes a Dockerfile for deployment to any Docker-compatible platform:

```bash
# Build the image
docker build -t stick-note-api .

# Run the container
docker run -p 3000:3000 -e NODE_ENV=production stick-note-api
```

## Verifying Deployment

Once deployed, verify the API is working:

1. **Health Check**: `GET https://your-api-url/health`
   ```json
   {"status":"healthy","timestamp":"..."}
   ```

2. **Service Info**: `GET https://your-api-url/`
   ```json
   {"status":"ok","service":"Stick Note API","version":"1.0.0","timestamp":"..."}
   ```

3. **PDF Annotation**: `POST https://your-api-url/pdf/annotate-upload`
   - Upload a PDF file with annotation parameters
   - Should return annotated PDF

## Deployment Workflow

The GitHub Actions workflow automatically:

1. **On every push/PR**: Builds and tests the application
2. **On main branch push**: Triggers deployment workflow
3. **Deployment workflow**: Deploys to configured platforms and verifies deployment

## Troubleshooting

### Common Issues:

1. **Build failures**: Check Node.js version compatibility (18.x or 20.x required)
2. **Port issues**: Ensure `PORT` environment variable is not hardcoded
3. **Health check failures**: Verify `/health` endpoint is accessible
4. **Deployment timeouts**: Check logs in hosting platform dashboard

### Debug Steps:

1. Check GitHub Actions logs for build/deployment errors
2. Check hosting platform logs for runtime errors
3. Test endpoints manually after deployment
4. Verify environment variables are set correctly

## Security Considerations

- Never commit API keys or secrets to repository
- Use GitHub Secrets for sensitive information
- Enable HTTPS in production (most platforms do this automatically)
- Consider rate limiting for production use

## Cost Considerations

- **Render Free**: 750 hours/month, sleeps after 15 minutes of inactivity
- **Railway Free**: $5 credit/month, no sleep
- **Paid plans**: Available for production workloads requiring 24/7 uptime