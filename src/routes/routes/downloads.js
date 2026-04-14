// routes/downloads.js
// UML: Download { id, episodeId, downloadDate, status }
// Download EXISTS → épisode téléchargé (Option A)
//
// GET    /api/downloads                    → tous les downloads
// GET    /api/downloads/stats              → infos stockage (StorageManager)
// GET    /api/downloads/episode/:episodeId → download d'un épisode
// POST   /api/downloads                    → créer un download
// PATCH  /api/downloads/:id/status         → mettre à jour le statut
// DELETE /api/downloads/episode/:episodeId → supprimer un download

const express        = require('express');
const router         = express.Router();
<<<<<<< HEAD
const Download       = require('../../models/Download');
const Episode        = require('../../models/Episode');
const StorageManager = require('../../services/StorageManager');
=======
const Download       = require('../models/Download');
const Episode        = require('../models/Episode');
const StorageManager = require('../services/StorageManager');
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548

const VALID_STATUSES = ['pending', 'in_progress', 'completed', 'failed'];

// GET /api/downloads
router.get('/', async (req, res) => {
  try {
    const downloads = await Download
      .find()
      .populate('episodeId', 'title duration fileSize podcastId');
    res.json({ data: downloads, total: downloads.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/downloads/stats — via StorageManager (UML)
router.get('/stats', async (req, res) => {
  try {
    const storage = await StorageManager.getStorageInfo();
    res.json({ data: storage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/downloads/episode/:episodeId
router.get('/episode/:episodeId', async (req, res) => {
  try {
    const download = await Download
      .findOne({ episodeId: req.params.episodeId })
      .populate('episodeId');
    if (!download) {
      return res.status(404).json({
        error: 'Aucun download pour cet épisode',
        downloaded: false,
      });
    }
    res.json({
      data: download,
      downloaded: download.status === 'completed',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/downloads — créer un download
router.post('/', async (req, res) => {
  try {
    const { episodeId } = req.body;

    if (!episodeId) {
      return res.status(400).json({ error: 'episodeId est obligatoire' });
    }

    // L'épisode doit exister
    const episode = await Episode.findById(episodeId);
    if (!episode) {
      return res.status(404).json({ error: 'Épisode introuvable', statusCode: 404 });
    }

    // Éviter les doublons (relation 0..1)
    const existing = await Download.findOne({ episodeId });
    if (existing) {
      return res.status(409).json({
        error: 'Déjà téléchargé',
        data: existing,
        statusCode: 409,
      });
    }

    const download = await Download.create({
      episodeId,
      downloadDate: new Date(),
      status: 'completed',
      downloadedSize: episode.fileSize,
    });

    res.status(201).json({ data: download, message: 'Download créé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/downloads/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `Statut invalide. Valeurs : ${VALID_STATUSES.join(', ')}`,
      });
    }

    const download = await Download.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!download) {
      return res.status(404).json({ error: 'Download introuvable' });
    }

    res.json({ data: download, message: 'Statut mis à jour' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/downloads/episode/:episodeId
router.delete('/episode/:episodeId', async (req, res) => {
  try {
    const download = await Download.findOneAndDelete({
      episodeId: req.params.episodeId,
    });

    if (!download) {
      return res.status(404).json({ error: 'Download introuvable' });
    }

    res.json({
      message: 'Download supprimé avec succès',
      episodeId: req.params.episodeId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
