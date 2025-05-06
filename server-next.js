// server-next.js
// This file sets up an Express server that integrates with Next.js

const express = require('express');
const next = require('next');
const { createServer } = require('http');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Determine if we're in development or production
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || '0.0.0.0'; // Use 0.0.0.0 for Replit compatibility
const port = process.env.PORT || 3000;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  
  // Add API routes for Express backend
  server.use('/api', (req, res, next) => {
    console.log(`API Request: ${req.method} ${req.url}`);
    next();
  });
  
  // Import API routes from server/routes.ts if it exists
  try {
    // First try to import as TypeScript file with .ts extension
    let registerRoutes;
    try {
      registerRoutes = require('./server/routes.ts');
    } catch (tsError) {
      // If that fails, try to import as JavaScript file
      try {
        registerRoutes = require('./server/routes.js');
      } catch (jsError) {
        // Finally try without extension (Node's default resolution)
        registerRoutes = require('./server/routes');
      }
    }
    
    if (registerRoutes) {
      const httpServer = createServer(server);
      if (typeof registerRoutes === 'function') {
        registerRoutes(server, httpServer);
      } else if (typeof registerRoutes.registerRoutes === 'function') {
        registerRoutes.registerRoutes(server, httpServer);
      } else {
        console.log('API routes module found but no registerRoutes function available');
      }
    }
  } catch (error) {
    console.log('API routes not loaded. This is expected during development with Next.js only.');
    // Create simple API endpoint for testing
    server.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'API server is running' });
    });
  }
  
  // Next.js handles all other routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  // Start the server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});