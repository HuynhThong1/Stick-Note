# Stick Note API

A NestJS API service for adding sticky note annotations to PDF files.

## Features

- Upload PDF files and add sticky note annotations
- RESTful API endpoints for frontend integration
- CORS enabled for cross-origin requests
- Containerized deployment ready

## API Endpoints

### POST /pdf/annotate-upload

Accepts a PDF file and annotation data, returns the annotated PDF.

**Request:** multipart/form-data
- `file`: PDF file (required)
- `page`: Page number (0-based index)
- `x`: X coordinate for annotation
- `y`: Y coordinate for annotation
- `width`: Width of annotation
- `height`: Height of annotation
- `noteText`: Text content of the sticky note
- `author`: Author name (optional)
- `fileName`: Output filename (optional)

**Response:** PDF file with annotation

## Development

### Prerequisites
- Node.js 18+ 
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run start:dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## Deployment

The application is configured for automatic deployment to Render via GitHub Actions:

1. **Automatic Deployment**: Pushes to the `main` branch trigger automatic deployment
2. **Environment Variables**: Configure `PORT` environment variable (defaults to 3000)
3. **Build Process**: The CI/CD pipeline builds and deploys the application automatically

### Manual Deployment

For manual deployment to other platforms:

1. Build the application: `npm run build`
2. Set environment variables as needed
3. Run: `npm start`

### Docker Deployment

```bash
docker build -t stick-note-api .
docker run -p 3000:3000 stick-note-api
```

## Environment Variables

- `PORT`: Port number for the server (default: 3000)
- `NODE_ENV`: Environment mode (development/production)