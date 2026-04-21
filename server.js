// server.js — PodWay API avec MongoDB
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const connectDB      = require('./src/config/db');
const podcastRoutes  = require('./src/routes/routes/podcasts');
const episodeRoutes  = require('./src/routes/routes/episodes');
const downloadRoutes = require('./src/routes/routes/downloads');
const libraryRoutes  = require('./src/routes/routes/library');
const networkRoutes  = require('./src/routes/routes/network');

connectDB();

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/podcasts',  podcastRoutes);
app.use('/api/episodes',  episodeRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/library',   libraryRoutes);
app.use('/api/network',   networkRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'PodWay API + MongoDB', timestamp: new Date().toISOString() });
});

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🎙️  PodWay API  — http://localhost:${PORT}`);
  console.log(`🍃  MongoDB     — ${process.env.MONGO_URI || 'mongodb://localhost:27017/podway'}\n`);
});

module.exports = app;
