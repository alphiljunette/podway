// services/PodcastSearchService.js
// Real podcast search using iTunes Search API

class PodcastSearchService {
  constructor() {
    this.baseUrl    = 'https://itunes.apple.com/search';
    this.lookupUrl  = 'https://itunes.apple.com/lookup';
  }

  async searchPodcasts(query, limit = 20) {
    if (!query || !query.trim()) return [];
    try {
      const url = `${this.baseUrl}?term=${encodeURIComponent(query.trim())}&entity=podcast&limit=${limit}&country=US&lang=en_us`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return (data.results || []).map(p => ({
        id: p.collectionId,
        title: p.collectionName || 'Unknown',
        author: p.artistName || 'Unknown',
        description: p.collectionCensoredName || p.collectionName || '',
        category: p.primaryGenreName || 'Other',
        imageUrl: p.artworkUrl600 || p.artworkUrl100 || null,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        episodeCount: p.trackCount || 0,
        avgDuration: 40,
      }));
    } catch (error) {
      console.warn('[PodcastSearchService] searchPodcasts failed:', error);
      return [];
    }
  }

  async getPodcastEpisodes(podcastId, limit = 50) {
    try {
      const url = `${this.lookupUrl}?id=${podcastId}&entity=podcastEpisode&limit=${limit}&country=US`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const results = (data.results || []);
      return results
        .filter(item => item.kind === 'podcast-episode')
        .map((ep, index) => {
          // Best audio URL: episodeUrl > previewUrl > enclosureUrl
          const audioUrl = ep.episodeUrl || ep.previewUrl || ep.enclosureUrl || null;
          const durationMin = ep.trackTimeMillis ? Math.round(ep.trackTimeMillis / 60000) : 30;
          return {
            id: ep.trackId || `${podcastId}_${index}`,
            podcastId,
            title: ep.trackName || `Episode ${index + 1}`,
            duration: durationMin,
            audioUrl,
            filePath: null,
            fileSize: Math.max(1, durationMin * 2), // rough estimate: 2MB/min
            episodeNumber: index + 1,
            publishedAt: ep.releaseDate || null,
          };
        });
    } catch (error) {
      console.warn('[PodcastSearchService] getPodcastEpisodes failed:', error);
      return [];
    }
  }
}

export default new PodcastSearchService();
