// ─────────────────────────────────────────────────────
// routes/downloads.js
// UML: Download { id, episodeId, downloadDate, status }
// Download record = proof that episode is downloaded (Option A)
//
// GET    /api/downloads                   → all downloads
// GET    /api/downloads/stats             → storage info
// GET    /api/downloads/episode/:id       → download record for one episode
// POST   /api/downloads                   → create download
// PATCH  /api/downloads/:id/status        → update status
// DELETE /api/downloads/episode/:id       → remove download
// ─────────────────────────────────────────────────────

const express        = require('express');
const router         = express.Router();
const db             = require('../data/mockData');
const StorageManager = require('../services/StorageManager');

const VALID_STATUSES = ['pending', 'in_progress', 'completed', 'failed'];

// GET /api/downloads
router.get('/', (req, res) => {
  res.json({ data: db.downloads, total: db.downloads.length });
});

// GET /api/downloads/stats — via StorageManager (UML)
router.get('/stats', (req, res) => {
  const storage = StorageManager.getStorageInfo();
  res.json({ data: storage });
});

// GET /api/downloads/episode/:episodeId
router.get('/episode/:episodeId', (req, res) => {
  const episodeId = Number(req.params.episodeId);
  const download  = db.downloads.find(d => d.episodeId === episodeId);

  if (!download) {
    return res.status(404).json({
      error: 'No download found for this episode',
      downloaded: false,
    });
  }
  res.json({ data: download, downloaded: download.status === 'completed' });
});

// POST /api/downloads — create a download record
router.post('/', (req, res) => {
  const { episodeId } = req.body;

  if (!episodeId) {
    return res.status(400).json({ error: 'episodeId is required', statusCode: 400 });
  }

  // Episode must exist
  const episode = db.episodes.find(e => e.id === Number(episodeId));
  if (!episode) {
    return res.status(404).json({ error: 'Episode not found', statusCode: 404 });
  }

  // Prevent duplicate
  const existing = db.downloads.find(d => d.episodeId === Number(episodeId));
  if (existing) {
    return res.status(409).json({
      error: 'Already downloaded',
      data: existing,
      statusCode: 409,
    });
  }

  const newDownload = {
    id: db.nextDownloadId,
    episodeId: Number(episodeId),
    downloadDate: new Date(),
    status: 'completed',
  };

  db.downloads.push(newDownload);
  db.incrementId();

  res.status(201).json({ data: newDownload, message: 'Download created' });
});

// PATCH /api/downloads/:id/status
router.patch('/:id/status', (req, res) => {
  const id     = Number(req.params.id);
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  const download = db.downloads.find(d => d.id === id);
  if (!download) {
    return res.status(404).json({ error: 'Download not found', statusCode: 404 });
  }

  download.status = status;
  res.json({ data: download, message: 'Status updated' });
});

// DELETE /api/downloads/episode/:episodeId
router.delete('/episode/:episodeId', (req, res) => {
  const episodeId = Number(req.params.episodeId);
  const idx       = db.downloads.findIndex(d => d.episodeId === episodeId);

  if (idx === -1) {
    return res.status(404).json({ error: 'Download not found', statusCode: 404 });
  }

  db.downloads.splice(idx, 1);
  res.json({ message: 'Download deleted successfully', episodeId });
});

module.exports = router;
