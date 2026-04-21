require('dotenv').config();
// ─────────────────────────────────────────────────────
// server.js — PodWay API
// Node.js + Express (no TypeScript)
// ─────────────────────────────────────────────────────

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const connectDB      = require('./config/db');
const podcastRoutes  = require('./routes/routes/podcasts');
const episodeRoutes  = require('./routes/routes/episodes');
const downloadRoutes = require('./routes/routes/downloads');
const libraryRoutes  = require('./routes/routes/library');
const networkRoutes  = require('./routes/routes/network');

connectDB();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// ── ROUTES ────────────────────────────────────────────
app.use('/api/podcasts',  podcastRoutes);
app.use('/api/episodes',  episodeRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/library',   libraryRoutes);
app.use('/api/network',   networkRoutes);

// ── HEALTH CHECK ──────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'PodWay API', timestamp: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', statusCode: 404 });
});

// ── GLOBAL ERROR HANDLER ──────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(500).json({ error: 'Internal server error', statusCode: 500 });
});

// ── START ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎙️  PodWay API — http://localhost:${PORT}`);
  console.log(`📡  Health      : GET  /health`);
  console.log(`\n📋  Podcasts    : GET  /api/podcasts`);
  console.log(`                  GET  /api/podcasts/trending`);
  console.log(`                  GET  /api/podcasts/categories`);
  console.log(`                  GET  /api/podcasts/:id`);
  console.log(`                  GET  /api/podcasts/:id/episodes`);
  console.log(`\n🎧  Episodes    : GET  /api/episodes`);
  console.log(`                  GET  /api/episodes/:id`);
  console.log(`\n⬇️   Downloads   : GET  /api/downloads`);
  console.log(`                  GET  /api/downloads/stats`);
  console.log(`                  GET  /api/downloads/episode/:id`);
  console.log(`                  POST /api/downloads`);
  console.log(`                  PATCH /api/downloads/:id/status`);
  console.log(`                  DELETE /api/downloads/episode/:id`);
  console.log(`\n📚  Library     : GET  /api/library/stats`);
  console.log(`                  GET  /api/library/grouped`);
  console.log(`                  GET  /api/library/episodes`);
  console.log(`                  GET  /api/library/podcasts`);
  console.log(`                  GET  /api/library/podcast/:id`);
  console.log(`\n🌐  Network     : GET  /api/network/check\n`);
});

module.exports = app;
