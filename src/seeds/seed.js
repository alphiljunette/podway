// seeds/seed.js
// Peuple la base MongoDB avec les données de départ
// Utilisation : node seeds/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Podcast  = require('../models/Podcast');
const Episode  = require('../models/Episode');
const Download = require('../models/Download');

const seedPodcasts = [
  { title: 'Tech Talk Daily',  author: 'Sarah Kim',    imageUrl: null, description: 'The best of tech every week. AI, startups, development and digital trends.', category: 'Tech',     rating: 4.8, avgDuration: 44 },
  { title: 'Brain & Beyond',   author: 'Dr. Leroy',    imageUrl: null, description: 'Explore the mysteries of the human brain, psychology and neuroscience.',      category: 'Science',  rating: 4.6, avgDuration: 41 },
  { title: 'Space Pod',        author: 'Nasa Fan Club', imageUrl: null, description: 'Everything about space exploration, missions and astronomy.',                  category: 'Science',  rating: 4.9, avgDuration: 34 },
  { title: 'World Stories',    author: 'Marie Dubois', imageUrl: null, description: 'Stories from around the world, told by those who lived them.',                  category: 'Society',  rating: 4.8, avgDuration: 51 },
  { title: 'Daily Insight',    author: 'Jean Martin',  imageUrl: null, description: 'A daily dose of ideas, reflections and analysis on our world.',                 category: 'Business', rating: 4.6, avgDuration: 20 },
  { title: 'Sound Waves',      author: 'Alex Chen',    imageUrl: null, description: 'Music, sound culture and the stories behind audio masterpieces.',               category: 'Culture',  rating: 4.9, avgDuration: 55 },
];

const seedEpisodesData = [
  // Tech Talk Daily [0]
  { title: 'AI in 2025: Year in Review',  duration: 45, fileSize: 98,  episodeNumber: 1, audioUrl: 'https://example.com/ep101.mp3' },
  { title: 'React Native vs Flutter',     duration: 38, fileSize: 82,  episodeNumber: 2, audioUrl: 'https://example.com/ep102.mp3' },
  { title: 'African Startups Rising',     duration: 52, fileSize: 114, episodeNumber: 3, audioUrl: 'https://example.com/ep103.mp3' },
  { title: 'Clean Architecture Guide',    duration: 41, fileSize: 89,  episodeNumber: 4, audioUrl: 'https://example.com/ep104.mp3' },
  // Brain & Beyond [1]
  { title: 'Neuroplasticity Explained',   duration: 42, fileSize: 89,  episodeNumber: 1, audioUrl: 'https://example.com/ep201.mp3' },
  { title: 'Memory & Sleep Science',      duration: 38, fileSize: 81,  episodeNumber: 2, audioUrl: 'https://example.com/ep202.mp3' },
  { title: 'The Emotions Decoded',        duration: 44, fileSize: 95,  episodeNumber: 3, audioUrl: 'https://example.com/ep203.mp3' },
  // Space Pod [2]
  { title: 'Mars Mission 2026',           duration: 36, fileSize: 77,  episodeNumber: 1, audioUrl: 'https://example.com/ep301.mp3' },
  { title: 'Black Holes Explained',       duration: 32, fileSize: 68,  episodeNumber: 2, audioUrl: 'https://example.com/ep302.mp3' },
  // World Stories [3]
  { title: 'Tokyo, City of the Future',   duration: 55, fileSize: 120, episodeNumber: 1, audioUrl: 'https://example.com/ep401.mp3' },
  { title: 'The Amazon in Danger',        duration: 48, fileSize: 104, episodeNumber: 2, audioUrl: 'https://example.com/ep402.mp3' },
  // Daily Insight [4]
  { title: 'The Future of Work',          duration: 22, fileSize: 48,  episodeNumber: 1, audioUrl: 'https://example.com/ep501.mp3' },
  { title: 'How to Learn Faster',         duration: 18, fileSize: 39,  episodeNumber: 2, audioUrl: 'https://example.com/ep502.mp3' },
  // Sound Waves [5]
  { title: 'Jazz: The Birth of a Genre',  duration: 58, fileSize: 127, episodeNumber: 1, audioUrl: 'https://example.com/ep601.mp3' },
  { title: 'Lofi & The Study Culture',    duration: 52, fileSize: 114, episodeNumber: 2, audioUrl: 'https://example.com/ep602.mp3' },
];

// Mapping podcast index → épisodes
const episodePodcastMap = [0,0,0,0, 1,1,1, 2,2, 3,3, 4,4, 5,5];

const seed = async () => {
  try {
    await connectDB();

    // Nettoyer les collections existantes
    console.log('🧹 Nettoyage des collections...');
    await Promise.all([
      Podcast.deleteMany(),
      Episode.deleteMany(),
      Download.deleteMany(),
    ]);

    // Insérer les podcasts
    console.log('📻 Insertion des podcasts...');
    const podcasts = await Podcast.insertMany(seedPodcasts);
    console.log(`   ✅ ${podcasts.length} podcasts insérés`);

    // Insérer les épisodes en liant les podcastId réels
    console.log('🎧 Insertion des épisodes...');
    const episodesWithIds = seedEpisodesData.map((ep, i) => ({
      ...ep,
      podcastId: podcasts[episodePodcastMap[i]]._id,
      filePath: null,
      publishedAt: new Date(),
    }));
    const episodes = await Episode.insertMany(episodesWithIds);
    console.log(`   ✅ ${episodes.length} épisodes insérés`);

    // Créer des downloads de démo (3 épisodes pré-téléchargés)
    console.log('⬇️  Insertion des downloads de démo...');
    const demoDownloads = [
      { episodeId: episodes[0]._id, status: 'completed', downloadedSize: episodes[0].fileSize, downloadDate: new Date('2025-01-12') },
      { episodeId: episodes[4]._id, status: 'completed', downloadedSize: episodes[4].fileSize, downloadDate: new Date('2025-01-10') },
      { episodeId: episodes[5]._id, status: 'completed', downloadedSize: episodes[5].fileSize, downloadDate: new Date('2025-01-10') },
      { episodeId: episodes[7]._id, status: 'completed', downloadedSize: episodes[7].fileSize, downloadDate: new Date('2025-01-08') },
    ];
    const downloads = await Download.insertMany(demoDownloads);
    console.log(`   ✅ ${downloads.length} downloads insérés`);

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('📊 Résumé :');
    console.log(`   - ${podcasts.length} podcasts`);
    console.log(`   - ${episodes.length} épisodes`);
    console.log(`   - ${downloads.length} downloads`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur seed :', error);
    process.exit(1);
  }
};

seed();
