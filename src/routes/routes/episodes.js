// routes/episodes.js
// GET /api/episodes           → tous les épisodes (?podcastId=)
// GET /api/episodes/:id       → un épisode

const express = require('express');
const router  = express.Router();
const Episode = require('../../models/Episode');

// GET /api/episodes
router.get('/', async (req, res) => {
  try {
    const { podcastId } = req.query;
    const query = podcastId ? { podcastId } : {};
    const episodes = await Episode
      .find(query)
      .populate('podcastId', 'title author')
      .sort({ episodeNumber: 1 });
    res.json({ data: episodes, total: episodes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/episodes/:id
router.get('/:id', async (req, res) => {
  try {
    const episode = await Episode
      .findById(req.params.id)
      .populate('podcastId', 'title author imageUrl');
    if (!episode) {
      return res.status(404).json({ error: 'Épisode introuvable', statusCode: 404 });
    }
    res.json({ data: episode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
