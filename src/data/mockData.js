// ─────────────────────────────────────────────────────
// data/mockData.js
// In-memory store — replace with real DB later
// UML classes: Podcast, Episode, Download
// ─────────────────────────────────────────────────────

// ── Podcasts ──────────────────────────────────────────
const podcasts = [
  {
    id: 1,
    title: 'Tech Talk Daily',
    author: 'Sarah Kim',
    imageUrl: null,
    description: 'The best of tech every week. AI, startups, development and digital trends.',
    category: 'Tech',
    rating: 4.8,
    episodeCount: 4,
    avgDuration: 44,
  },
  {
    id: 2,
    title: 'Brain & Beyond',
    author: 'Dr. Leroy',
    imageUrl: null,
    description: 'Explore the mysteries of the human brain, psychology and neuroscience.',
    category: 'Science',
    rating: 4.6,
    episodeCount: 3,
    avgDuration: 41,
  },
  {
    id: 3,
    title: 'Space Pod',
    author: 'Nasa Fan Club',
    imageUrl: null,
    description: 'Everything about space exploration, missions and astronomy.',
    category: 'Science',
    rating: 4.9,
    episodeCount: 2,
    avgDuration: 34,
  },
  {
    id: 4,
    title: 'World Stories',
    author: 'Marie Dubois',
    imageUrl: null,
    description: 'Stories from around the world, told by those who lived them.',
    category: 'Society',
    rating: 4.8,
    episodeCount: 2,
    avgDuration: 51,
  },
  {
    id: 5,
    title: 'Daily Insight',
    author: 'Jean Martin',
    imageUrl: null,
    description: 'A daily dose of ideas, reflections and analysis on our world.',
    category: 'Business',
    rating: 4.6,
    episodeCount: 2,
    avgDuration: 20,
  },
  {
    id: 6,
    title: 'Sound Waves',
    author: 'Alex Chen',
    imageUrl: null,
    description: 'Music, sound culture and the stories behind audio masterpieces.',
    category: 'Culture',
    rating: 4.9,
    episodeCount: 2,
    avgDuration: 55,
  },
];

// ── Episodes ──────────────────────────────────────────
// UML Episode: id, title, duration, audioUrl, filePath, fileSize, podcastId
// Note: isDownloaded REMOVED (Option A — Download record = source of truth)
const episodes = [
  // Tech Talk Daily
  { id: 101, podcastId: 1, title: 'AI in 2025: Year in Review',  duration: 45, audioUrl: 'https://example.com/ep101.mp3', filePath: null, fileSize: 98  },
  { id: 102, podcastId: 1, title: 'React Native vs Flutter',      duration: 38, audioUrl: 'https://example.com/ep102.mp3', filePath: null, fileSize: 82  },
  { id: 103, podcastId: 1, title: 'African Startups Rising',      duration: 52, audioUrl: 'https://example.com/ep103.mp3', filePath: null, fileSize: 114 },
  { id: 104, podcastId: 1, title: 'Clean Architecture Guide',     duration: 41, audioUrl: 'https://example.com/ep104.mp3', filePath: null, fileSize: 89  },
  // Brain & Beyond
  { id: 201, podcastId: 2, title: 'Neuroplasticity Explained',    duration: 42, audioUrl: 'https://example.com/ep201.mp3', filePath: null, fileSize: 89  },
  { id: 202, podcastId: 2, title: 'Memory & Sleep Science',       duration: 38, audioUrl: 'https://example.com/ep202.mp3', filePath: null, fileSize: 81  },
  { id: 203, podcastId: 2, title: 'The Emotions Decoded',         duration: 44, audioUrl: 'https://example.com/ep203.mp3', filePath: null, fileSize: 95  },
  // Space Pod
  { id: 301, podcastId: 3, title: 'Mars Mission 2026',            duration: 36, audioUrl: 'https://example.com/ep301.mp3', filePath: null, fileSize: 77  },
  { id: 302, podcastId: 3, title: 'Black Holes Explained',        duration: 32, audioUrl: 'https://example.com/ep302.mp3', filePath: null, fileSize: 68  },
  // World Stories
  { id: 401, podcastId: 4, title: 'Tokyo, City of the Future',    duration: 55, audioUrl: 'https://example.com/ep401.mp3', filePath: null, fileSize: 120 },
  { id: 402, podcastId: 4, title: 'The Amazon in Danger',         duration: 48, audioUrl: 'https://example.com/ep402.mp3', filePath: null, fileSize: 104 },
  // Daily Insight
  { id: 501, podcastId: 5, title: 'The Future of Work',           duration: 22, audioUrl: 'https://example.com/ep501.mp3', filePath: null, fileSize: 48  },
  { id: 502, podcastId: 5, title: 'How to Learn Faster',          duration: 18, audioUrl: 'https://example.com/ep502.mp3', filePath: null, fileSize: 39  },
  // Sound Waves
  { id: 601, podcastId: 6, title: 'Jazz: The Birth of a Genre',   duration: 58, audioUrl: 'https://example.com/ep601.mp3', filePath: null, fileSize: 127 },
  { id: 602, podcastId: 6, title: 'Lofi & The Study Culture',     duration: 52, audioUrl: 'https://example.com/ep602.mp3', filePath: null, fileSize: 114 },
];

// ── Downloads ─────────────────────────────────────────
// UML Download: id, episodeId, downloadDate, status
// Download EXISTS → episode is downloaded (no isDownloaded field needed)
const downloads = [
  { id: 1, episodeId: 101, downloadDate: new Date('2025-01-12'), status: 'completed' },
  { id: 2, episodeId: 201, downloadDate: new Date('2025-01-10'), status: 'completed' },
  { id: 3, episodeId: 202, downloadDate: new Date('2025-01-10'), status: 'completed' },
  { id: 4, episodeId: 301, downloadDate: new Date('2025-01-08'), status: 'completed' },
];

let nextDownloadId = 5;

const categories = ['All', 'Tech', 'Science', 'Society', 'Culture', 'Business'];

module.exports = { podcasts, episodes, downloads, categories, get nextDownloadId() { return nextDownloadId; }, incrementId() { nextDownloadId++; } };
