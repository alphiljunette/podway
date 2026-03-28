// ─────────────────────────────────────────────────────
// routes/library.js
// UML: Library
//   + getDownloadedEpisodes() : List<Episode>
//   + getDownloadedPodcasts() : List<Podcast>
//
// GET /api/library/stats         → totalDownloadedEpisodes, totalDownloadedPodcasts + storage
// GET /api/library/episodes      → all downloaded episodes
// GET /api/library/podcasts      → all downloaded podcasts
// GET /api/library/grouped       → grouped by podcast (LibraryScreen)
// GET /api/library/podcast/:id   → downloaded episodes of one podcast (LibraryEpisodesScreen)
// ─────────────────────────────────────────────────────

const express        = require('express');
const router         = express.Router();
const LibraryService = require('../services/LibraryService');
const StorageManager = require('../services/StorageManager');

// GET /api/library/stats
router.get('/stats', (req, res) => {
  LibraryService.isAccessible(); // UML <<uses>> NetworkManager (logs state)
  const stats   = LibraryService.getStats();
  const storage = StorageManager.getStorageInfo();
  res.json({ data: { ...stats, storage } });
});

// GET /api/library/episodes — UML: getDownloadedEpisodes()
router.get('/episodes', (req, res) => {
  const episodes = LibraryService.getDownloadedEpisodes();
  res.json({ data: episodes, total: episodes.length });
});

// GET /api/library/podcasts — UML: getDownloadedPodcasts()
router.get('/podcasts', (req, res) => {
  const pods = LibraryService.getDownloadedPodcasts();
  res.json({ data: pods, total: pods.length });
});

// GET /api/library/grouped — for LibraryScreen (podcast list)
router.get('/grouped', (req, res) => {
  const grouped = LibraryService.getGrouped();
  res.json({ data: grouped, total: grouped.length });
});

// GET /api/library/podcast/:id — for LibraryEpisodesScreen
router.get('/podcast/:id', (req, res) => {
  const episodes = LibraryService.getEpisodesForPodcast(Number(req.params.id));
  res.json({ data: episodes, total: episodes.length });
});

module.exports = router;
