// routes/podcasts.js
// GET  /api/podcasts              → tous les podcasts (search + category)
// GET  /api/podcasts/trending     → top rated
// GET  /api/podcasts/categories   → liste des catégories
// GET  /api/podcasts/:id          → un podcast
// GET  /api/podcasts/:id/episodes → épisodes d'un podcast

const express = require('express');
const router  = express.Router();
const Podcast = require('../models/Podcast');
const Episode = require('../models/Episode');

const CATEGORIES = ['All', 'Tech', 'Science', 'Society', 'Culture', 'Business'];

// GET /api/podcasts
router.get('/', async (req, res) => {
  try {
    const { search, category, limit = 20, offset = 0 } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const total = await Podcast.countDocuments(query);
    const podcasts = await Podcast
      .find(query)
      .populate('episodeCount')
      .sort({ rating: -1 })
      .skip(Number(offset))
      .limit(Number(limit));

    res.json({ data: podcasts, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/podcasts/trending
router.get('/trending', async (req, res) => {
  try {
    const podcasts = await Podcast
      .find()
      .populate('episodeCount')
      .sort({ rating: -1 })
      .limit(6);
    res.json({ data: podcasts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/podcasts/categories
router.get('/categories', (req, res) => {
  res.json({ data: CATEGORIES });
});

// GET /api/podcasts/:id
router.get('/:id', async (req, res) => {
  try {
    const podcast = await Podcast
      .findById(req.params.id)
      .populate('episodeCount');
    if (!podcast) {
      return res.status(404).json({ error: 'Podcast introuvable', statusCode: 404 });
    }
    res.json({ data: podcast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/podcasts/:id/episodes
router.get('/:id/episodes', async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ error: 'Podcast introuvable', statusCode: 404 });
    }
    const episodes = await Episode
      .find({ podcastId: req.params.id })
      .sort({ episodeNumber: 1 });
    res.json({ data: episodes, total: episodes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
