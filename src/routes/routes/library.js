// routes/library.js
// UML: Library
//   + getDownloadedEpisodes() : List<Episode>
//   + getDownloadedPodcasts() : List<Podcast>
//
// GET /api/library/stats        → totalDownloadedEpisodes + totalDownloadedPodcasts + storage
// GET /api/library/episodes     → tous les épisodes téléchargés
// GET /api/library/podcasts     → tous les podcasts téléchargés
// GET /api/library/grouped      → groupés par podcast (LibraryScreen)
// GET /api/library/podcast/:id  → épisodes téléchargés d'un podcast (LibraryEpisodesScreen)

const express        = require('express');
const router         = express.Router();
const LibraryService = require('../../services/LibraryService');
const StorageManager = require('../../services/StorageManager');

// GET /api/library/stats
router.get('/stats', async (req, res) => {
  try {
    LibraryService.isAccessible(); // UML <<uses>> NetworkManager
    const [stats, storage] = await Promise.all([
      LibraryService.getStats(),
      StorageManager.getStorageInfo(),
    ]);
    res.json({ data: { ...stats, storage } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/library/episodes — UML: getDownloadedEpisodes()
router.get('/episodes', async (req, res) => {
  try {
    const episodes = await LibraryService.getDownloadedEpisodes();
    res.json({ data: episodes, total: episodes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/library/podcasts — UML: getDownloadedPodcasts()
router.get('/podcasts', async (req, res) => {
  try {
    const podcasts = await LibraryService.getDownloadedPodcasts();
    res.json({ data: podcasts, total: podcasts.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/library/grouped — pour LibraryScreen
router.get('/grouped', async (req, res) => {
  try {
    const grouped = await LibraryService.getGrouped();
    res.json({ data: grouped, total: grouped.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/library/podcast/:id — pour LibraryEpisodesScreen
router.get('/podcast/:id', async (req, res) => {
  try {
    const episodes = await LibraryService.getEpisodesForPodcast(req.params.id);
    res.json({ data: episodes, total: episodes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
