// models/Podcast.js
// UML: Podcast
//   - id          : int       → _id (ObjectId MongoDB)
//   - title       : string
//   - author      : string
//   - imageUrl    : string
//   - description : string
//
// Relation UML : Podcast 1 ──── * Episode
// → Les épisodes référencent le podcast via podcastId

const mongoose = require('mongoose');

const PodcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      trim: true,
      maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères'],
    },
    author: {
      type: String,
      required: [true, "L'auteur est obligatoire"],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: [true, 'La description est obligatoire'],
      trim: true,
    },
    // Champs supplémentaires pour le frontend (cohérence avec mockData)
    category: {
      type: String,
      enum: ['Tech', 'Science', 'Society', 'Culture', 'Business', 'Other'],
      default: 'Other',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    avgDuration: {
      type: Number, // minutes
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt automatiques
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual : nombre d'épisodes (calculé depuis la collection Episode)
PodcastSchema.virtual('episodeCount', {
  ref: 'Episode',
  localField: '_id',
  foreignField: 'podcastId',
  count: true,
});

// Index pour la recherche
PodcastSchema.index({ title: 'text', author: 'text', description: 'text' });
PodcastSchema.index({ category: 1 });
PodcastSchema.index({ rating: -1 });

module.exports = mongoose.model('Podcast', PodcastSchema);
