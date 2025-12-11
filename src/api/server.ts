/**
 * Express API Server for Stream Workflow Status
 *
 * Serves REST API endpoints and static dashboard files
 */

import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config.js';
import { streamsRouter } from './routes/streams.js';
import { commitsRouter } from './routes/commits.js';
import { statsRouter } from './routes/stats.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/streams', streamsRouter);
app.use('/api/commits', commitsRouter);
app.use('/api/stats', statsRouter);

// Serve dashboard (static files from dashboard/dist)
const dashboardPath = path.join(__dirname, '../../dashboard/dist');
app.use(express.static(dashboardPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(dashboardPath, 'index.html'));
});

/**
 * Start the API server
 *
 * Only starts if API_ENABLED is true in config.
 * Logs server URL and available endpoints.
 */
export function startApiServer(): void {
  if (!config.API_ENABLED) {
    console.log('API server disabled (API_ENABLED=false)');
    return;
  }

  app.listen(config.API_PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log('Stream Workflow Status API Server');
    console.log(`${'='.repeat(60)}\n`);
    console.log(`Dashboard:      http://localhost:${config.API_PORT}/`);
    console.log(`API Endpoints:  http://localhost:${config.API_PORT}/api/`);
    console.log(`\nAvailable Routes:`);
    console.log(`  GET /api/streams              List all streams`);
    console.log(`  GET /api/streams/:id          Get single stream`);
    console.log(`  GET /api/commits              Get recent commits`);
    console.log(`  GET /api/stats                Get statistics`);
    console.log(`\n${'='.repeat(60)}\n`);
  });
}
