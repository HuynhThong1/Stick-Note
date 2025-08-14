# PDF Sticky-Note Annotator

A web application for adding sticky note annotations to PDF files.

## Development

1. Install dependencies:
```bash
npm install
```

2. Build the backend:
```bash
npm run build
```

3. Start the development server:
```bash
npm run start:dev
```

4. Open `index.html` in your browser to use the application.

## Production Deployment

### Backend Deployment

Deploy the NestJS backend to your preferred platform (Heroku, Railway, Vercel, etc.):

```bash
# Build the backend
npm run build

# Start production server
npm start
```

### Frontend Configuration

Configure the frontend to use your deployed backend API URL using one of these methods:

#### Method 1: Runtime Configuration (Recommended)

Add this script tag before loading `config.js` in your HTML:

```html
<script>
  window.PUBLIC_API_URL = 'https://your-backend-api.herokuapp.com';
</script>
<script src="config.js"></script>
```

#### Method 2: Build-time Configuration

Use the provided build script:

```bash
./build-frontend.sh https://your-backend-api.herokuapp.com
```

This creates `index.deployment.html` with the API URL pre-configured.

#### Method 3: Environment Variables

If using a build system that supports environment variables:

```bash
PUBLIC_API_URL=https://your-backend-api.herokuapp.com npm run build
```

### Deployment Examples

#### Vercel/Netlify Frontend + Railway/Heroku Backend

1. Deploy backend to Railway/Heroku
2. Get your backend URL (e.g., `https://stick-note-api.railway.app`)
3. In your frontend deployment, set:
   ```html
   <script>
     window.PUBLIC_API_URL = 'https://stick-note-api.railway.app';
   </script>
   ```

#### Static Hosting

For static hosting (GitHub Pages, etc.):

1. Run the build script with your API URL:
   ```bash
   ./build-frontend.sh https://your-api-domain.com
   ```
2. Deploy the generated `index.deployment.html` as your main HTML file

## Configuration

The application automatically detects the API URL in this priority order:

1. `window.PUBLIC_API_URL` (runtime configuration)
2. Build-time replacement in `config.js`
3. Environment variable `PUBLIC_API_URL`
4. Default: `http://localhost:3000`

## API Endpoints

- `POST /pdf/annotate-upload` - Upload PDF and annotation data, returns annotated PDF

Required form data:
- `file`: PDF file
- `page`: Page number (0-based)
- `x`, `y`: Coordinates for annotation
- `width`, `height`: Annotation dimensions
- `noteText`: Text content
- `author`: Author name
- `fileName`: Output filename