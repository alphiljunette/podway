// models/Download.js
// UML: Download
//   - id           : int    → _id (ObjectId MongoDB)
//   - episodeId    : int    → ref: 'Episode'
//   - downloadDate : Date
//   - status       : string → enum: pending | in_progress | completed | failed
//
// RÈGLE UML OPTION A :
//   Si un Download (status: 'completed') existe pour un épisode
//   → cet épisode EST téléchargé
//   → pas besoin de isDownloaded dans Episode
//
// Relation UML : Episode 1 ──── 0..1 Download

const mongoose = require('mongoose');

const DownloadSchema = new mongoose.Schema(
  {
    // Relation UML : Download → Episode (FK)
    episodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Episode',
      required: [true, "L'episodeId est obligatoire"],
      unique: true, // Un seul Download par épisode (relation 0..1)
    },
    downloadDate: {
      type: Date,
      default: Date.now,
    },
    // UML: status : string
    status: {
      type: String,
      enum: {
        values: ['pending', 'in_progress', 'completed', 'failed'],
        message: 'Statut invalide : {VALUE}',
      },
      default: 'pending',
    },
    // Taille réelle téléchargée (MB) — pour StorageManager
    downloadedSize: {
      type: Number,
      default: 0,
    },
    // Chemin local du fichier téléchargé
    localPath: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour requêtes fréquentes
<<<<<<< HEAD
=======
DownloadSchema.index({ episodeId: 1 });
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
DownloadSchema.index({ status: 1 });

// Méthode statique : vérifier si un épisode est téléchargé
DownloadSchema.statics.isDownloaded = async function (episodeId) {
  const doc = await this.findOne({ episodeId, status: 'completed' });
  return doc !== null;
};

// Méthode statique : IDs de tous les épisodes téléchargés
DownloadSchema.statics.getCompletedEpisodeIds = async function () {
  const docs = await this.find({ status: 'completed' }, 'episodeId');
  return docs.map(d => d.episodeId);
};

module.exports = mongoose.model('Download', DownloadSchema);
