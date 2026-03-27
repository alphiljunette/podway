export const mockPodcasts = [
  {
    id: 1,
    title: 'Tech Talk Daily',
    author: 'Sarah Kim',
    category: 'Tech',
    rating: 4.8,
    episodeCount: 12,
    avgDuration: 45,
    description: 'The best of tech every week. AI, startups, development and digital trends.',
  },
  {
    id: 2,
    title: 'Brain & Beyond',
    author: 'Dr. Leroy',
    category: 'Science',
    rating: 4.6,
    episodeCount: 8,
    avgDuration: 40,
    description: 'Explore the mysteries of the human brain, psychology and neuroscience.',
  },
  {
    id: 3,
    title: 'Space Pod',
    author: 'Nasa Fan Club',
    category: 'Science',
    rating: 4.9,
    episodeCount: 5,
    avgDuration: 35,
    description: 'Everything about space exploration, missions and astronomy.',
  },
  {
    id: 4,
    title: 'World Stories',
    author: 'Marie Dubois',
    category: 'Society',
    rating: 4.8,
    episodeCount: 23,
    avgDuration: 50,
    description: 'Stories from around the world, told by those who lived them.',
  },
  {
    id: 5,
    title: 'Daily Insight',
    author: 'Jean Martin',
    category: 'Business',
    rating: 4.6,
    episodeCount: 45,
    avgDuration: 20,
    description: 'A daily dose of ideas, reflections and analysis on our world.',
  },
  {
    id: 6,
    title: 'Sound Waves',
    author: 'Alex Chen',
    category: 'Culture',
    rating: 4.9,
    episodeCount: 67,
    avgDuration: 55,
    description: 'Music, sound culture and the stories behind audio masterpieces.',
  },
];

export const mockEpisodes = [
  { id: 101, podcastId: 1, title: 'AI in 2025: Year in Review', duration: 45, fileSize: 98 },
  { id: 102, podcastId: 1, title: 'React Native vs Flutter', duration: 38, fileSize: 82 },
  { id: 103, podcastId: 1, title: 'African Startups Rising', duration: 52, fileSize: 114 },
  { id: 104, podcastId: 1, title: 'Clean Architecture Guide', duration: 41, fileSize: 89 },

  { id: 201, podcastId: 2, title: 'Neuroplasticity Explained', duration: 42, fileSize: 89 },
  { id: 202, podcastId: 2, title: 'Memory & Sleep Science', duration: 38, fileSize: 81 },
  { id: 203, podcastId: 2, title: 'The Emotions Decoded', duration: 44, fileSize: 95 },

  { id: 301, podcastId: 3, title: 'Mars Mission 2026', duration: 36, fileSize: 77 },
  { id: 302, podcastId: 3, title: 'Black Holes Explained', duration: 32, fileSize: 68 },

  { id: 401, podcastId: 4, title: 'Tokyo, City of the Future', duration: 55, fileSize: 120 },
  { id: 402, podcastId: 4, title: 'The Amazon in Danger', duration: 48, fileSize: 104 },
];

// Already downloaded podcasts (for Library)
export const mockDownloaded = [
  {
    podcast: mockPodcasts[0],
    episodes: [mockEpisodes[0]],
    totalSize: 98,
  },
  {
    podcast: mockPodcasts[1],
    episodes: [mockEpisodes[4], mockEpisodes[5]],
    totalSize: 170,
  },
  {
    podcast: mockPodcasts[2],
    episodes: [mockEpisodes[7], mockEpisodes[8]],
    totalSize: 145,
  },
];

export const mockCategories = ['All', 'Tech', 'Science', 'Society', 'Culture', 'Business'];
