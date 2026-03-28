// ─────────────────────────────────────────────────────
// routes/podcasts.js
// GET  /api/podcasts                → all podcasts (search + category)
// GET  /api/podcasts/trending       → top rated
// GET  /api/podcasts/categories     → list of categories
// GET  /api/podcasts/:id            → single podcast
// GET  /api/podcasts/:id/episodes   → episodes of a podcast
// ─────────────────────────────────────────────────────

const express  = require('express');
const router   = express.Router();
const { podcasts, episodes, categories } = require('../data/mockData');

// GET /api/podcasts
router.get('/', (req, res) => {
  const { search, category, limit = 20, offset = 0 } = req.query;

  let result = [...podcasts];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      p => p.title.toLowerCase().includes(q) ||
           p.author.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'All') {
    result = result.filter(p => p.category === category);
  }

  const total     = result.length;
  const paginated = result.slice(Number(offset), Number(offset) + Number(limit));

  res.json({ data: paginated, total });
});

// GET /api/podcasts/trending — must be before /:id
router.get('/trending', (req, res) => {
  const trending = [...podcasts]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
  res.json({ data: trending });
});

// GET /api/podcasts/categories
router.get('/categories', (req, res) => {
  res.json({ data: categories });
});

// GET /api/podcasts/:id
router.get('/:id', (req, res) => {
  const podcast = podcasts.find(p => p.id === Number(req.params.id));
  if (!podcast) {
    return res.status(404).json({ error: 'Podcast not found', statusCode: 404 });
  }
  res.json({ data: podcast });
});

// GET /api/podcasts/:id/episodes
router.get('/:id/episodes', (req, res) => {
  const podcastId = Number(req.params.id);
  const podcast   = podcasts.find(p => p.id === podcastId);
  if (!podcast) {
    return res.status(404).json({ error: 'Podcast not found', statusCode: 404 });
  }
  const podEpisodes = episodes.filter(e => e.podcastId === podcastId);
  res.json({ data: podEpisodes, total: podEpisodes.length });
});

module.exports = router;
