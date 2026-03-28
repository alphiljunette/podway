// ─────────────────────────────────────────────────────
// routes/episodes.js
// GET /api/episodes           → all episodes (?podcastId= optional)
// GET /api/episodes/:id       → single episode
// ─────────────────────────────────────────────────────

const express  = require('express');
const router   = express.Router();
const { episodes } = require('../data/mockData');

// GET /api/episodes
router.get('/', (req, res) => {
  const { podcastId } = req.query;
  let result = [...episodes];

  if (podcastId) {
    result = result.filter(e => e.podcastId === Number(podcastId));
  }

  res.json({ data: result, total: result.length });
});

// GET /api/episodes/:id
router.get('/:id', (req, res) => {
  const episode = episodes.find(e => e.id === Number(req.params.id));
  if (!episode) {
    return res.status(404).json({ error: 'Episode not found', statusCode: 404 });
  }
  res.json({ data: episode });
});

module.exports = router;
