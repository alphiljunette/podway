// models/Episode.js
// UML: Episode
//   - id         : int      → _id (ObjectId MongoDB)
//   - title      : string
//   - duration   : int      (minutes)
//   - audioUrl   : string
//   - filePath   : string   (chemin local après téléchargement)
//   - fileSize   : float    (MB)
//   - podcastId  : int      → ref: 'Podcast'
//
// ⚠️  isDownloaded SUPPRIMÉ (UML Option A)
//     → Si un document Download existe pour cet épisode = il est téléchargé
//
// Relation UML : Podcast 1 ──── * Episode  (podcastId = FK)
// Relation UML : Episode  1 ──── 0..1 Download

const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      trim: true,
    },
    duration: {
      type: Number, // minutes
      required: [true, 'La durée est obligatoire'],
      min: [1, 'La durée doit être supérieure à 0'],
    },
    audioUrl: {
      type: String,
      required: [true, "L'URL audio est obligatoire"],
      trim: true,
    },
    filePath: {
      type: String,
      default: null, // null = pas encore téléchargé localement
    },
    fileSize: {
      type: Number, // MB
      required: [true, 'La taille du fichier est obligatoire'],
      min: [0, 'La taille doit être positive'],
    },
    // Relation UML : Episode → Podcast (FK)
    podcastId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Podcast',
      required: [true, 'Le podcastId est obligatoire'],
    },
    // Numéro d'ordre dans le podcast
    episodeNumber: {
      type: Number,
      default: 1,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index pour les requêtes fréquentes
EpisodeSchema.index({ podcastId: 1 });
EpisodeSchema.index({ podcastId: 1, episodeNumber: 1 });

module.exports = mongoose.model('Episode', EpisodeSchema);
