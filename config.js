// Configuration for the application
const config = {
  // Default API URL - will be overridden by environment-specific values
  API_URL: 'http://localhost:3000'
};

// Method 1: Runtime configuration via window object (highest priority)
if (typeof window !== 'undefined' && window.PUBLIC_API_URL) {
  config.API_URL = window.PUBLIC_API_URL;
}

// Method 2: Build-time configuration via replacement (medium priority)
const buildTimeUrl = '__API_URL__';
if (buildTimeUrl !== '__API_URL__') {
  config.API_URL = buildTimeUrl;
}

// Method 3: Environment variable check (if available)
if (typeof process !== 'undefined' && process.env && process.env.PUBLIC_API_URL) {
  config.API_URL = process.env.PUBLIC_API_URL;
}

console.log('API URL configured as:', config.API_URL);