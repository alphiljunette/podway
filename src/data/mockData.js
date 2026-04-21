// ─────────────────────────────────────────────────────
// data/mockData.js
// ─────────────────────────────────────────────────────

const podcasts = [
  { id: 1, title: 'Tech Talk Daily',  author: 'Sarah Kim',     imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts126/v4/3e/75/e9/3e75e9fa-2cd3-f3b0-3e1d-fa90a6b9d0e7/mza_12661399501543428626.jpg/600x600bb.jpg', description: 'The best of tech every week. AI, startups, development and digital trends.', category: 'Tech',      rating: 4.8, episodeCount: 4, avgDuration: 44 },
  { id: 2, title: 'Brain & Beyond',   author: 'Dr. Leroy',     imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/3a/23/98/3a239880-fc8e-d5d7-f8f4-5b4a9e9c4a0e/mza_7987748519505890328.jpg/600x600bb.jpg', description: 'Explore the mysteries of the human brain, psychology and neuroscience.', category: 'Science',   rating: 4.6, episodeCount: 3, avgDuration: 41 },
  { id: 3, title: 'Space Pod',        author: 'Nasa Fan Club',  imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/13/80/02/138002e6-99e7-8e6a-84cf-9f7a4ca85a22/mza_3883042989906498498.jpg/600x600bb.jpg', description: 'Everything about space exploration, missions and astronomy.', category: 'Science',   rating: 4.9, episodeCount: 2, avgDuration: 34 },
  { id: 4, title: 'World Stories',    author: 'Marie Dubois',  imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/4e/60/15/4e601526-e44d-e1e9-2aba-c2ff68ff8e9c/mza_6440213740256691567.jpg/600x600bb.jpg', description: 'Stories from around the world, told by those who lived them.', category: 'Society',   rating: 4.8, episodeCount: 2, avgDuration: 51 },
  { id: 5, title: 'Daily Insight',    author: 'Jean Martin',   imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts125/v4/7b/ca/cb/7bcacbd1-5b2a-8b93-aeea-ceafc82e3e5c/mza_2696558990777543595.jpg/600x600bb.jpg', description: 'A daily dose of ideas, reflections and analysis on our world.', category: 'Business', rating: 4.6, episodeCount: 2, avgDuration: 20 },
  { id: 6, title: 'Sound Waves',      author: 'Alex Chen',     imageUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/8c/e4/7c/8ce47c59-b8f4-6c50-a85a-0b8d4b1c57e1/mza_1832551870745316777.jpg/600x600bb.jpg', description: 'Music, sound culture and the stories behind audio masterpieces.', category: 'Music',    rating: 4.9, episodeCount: 2, avgDuration: 55 },
];

// URLs MP3 publiques fiables
const U = (n) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

const episodes = [
  // Tech Talk Daily
  { id: 101, podcastId: 1, title: 'AI in 2025: Year in Review',  duration: 45, audioUrl: U(1),  filePath: null, fileSize: 98  },
  { id: 102, podcastId: 1, title: 'React Native vs Flutter',      duration: 38, audioUrl: U(2),  filePath: null, fileSize: 82  },
  { id: 103, podcastId: 1, title: 'African Startups Rising',      duration: 52, audioUrl: U(3),  filePath: null, fileSize: 114 },
  { id: 104, podcastId: 1, title: 'Clean Architecture Guide',     duration: 41, audioUrl: U(4),  filePath: null, fileSize: 89  },
  // Brain & Beyond
  { id: 201, podcastId: 2, title: 'Neuroplasticity Explained',    duration: 42, audioUrl: U(5),  filePath: null, fileSize: 89  },
  { id: 202, podcastId: 2, title: 'Memory & Sleep Science',       duration: 38, audioUrl: U(6),  filePath: null, fileSize: 81  },
  { id: 203, podcastId: 2, title: 'The Emotions Decoded',         duration: 44, audioUrl: U(7),  filePath: null, fileSize: 95  },
  // Space Pod
  { id: 301, podcastId: 3, title: 'Mars Mission 2026',            duration: 36, audioUrl: U(8),  filePath: null, fileSize: 77  },
  { id: 302, podcastId: 3, title: 'Black Holes Explained',        duration: 32, audioUrl: U(9),  filePath: null, fileSize: 68  },
  // World Stories
  { id: 401, podcastId: 4, title: 'Tokyo, City of the Future',    duration: 55, audioUrl: U(10), filePath: null, fileSize: 120 },
  { id: 402, podcastId: 4, title: 'The Amazon in Danger',         duration: 48, audioUrl: U(11), filePath: null, fileSize: 104 },
  // Daily Insight
  { id: 501, podcastId: 5, title: 'The Future of Work',           duration: 22, audioUrl: U(12), filePath: null, fileSize: 48  },
  { id: 502, podcastId: 5, title: 'How to Learn Faster',          duration: 18, audioUrl: U(13), filePath: null, fileSize: 39  },
  // Sound Waves
  { id: 601, podcastId: 6, title: 'Jazz: The Birth of a Genre',   duration: 58, audioUrl: U(14), filePath: null, fileSize: 127 },
  { id: 602, podcastId: 6, title: 'Lofi & The Study Culture',     duration: 52, audioUrl: U(15), filePath: null, fileSize: 114 },
];

const downloads = [
  { id: 1, episodeId: 101, downloadDate: new Date('2025-01-12'), status: 'completed' },
  { id: 2, episodeId: 201, downloadDate: new Date('2025-01-10'), status: 'completed' },
  { id: 3, episodeId: 202, downloadDate: new Date('2025-01-10'), status: 'completed' },
  { id: 4, episodeId: 301, downloadDate: new Date('2025-01-08'), status: 'completed' },
];

let nextDownloadId = 5;

const categories = [
  'All', 'Tech', 'Science', 'Society', 'Culture', 'Business',
  'Health', 'Education', 'Sports', 'Comedy', 'News',
  'History', 'True Crime', 'Music', 'Arts', 'Religion',
];

module.exports = {
  podcasts, episodes, downloads, categories,
  get nextDownloadId() { return nextDownloadId; },
  incrementId() { nextDownloadId++; }
};
