// ─────────────────────────────────────────────────────
// services/LibraryService.js
// UML: Library
//   - totalDownloadedEpisodes : int
//   - totalDownloadedPodcasts : int
//   + getDownloadedEpisodes() : List<Episode>
//   + getDownloadedPodcasts() : List<Podcast>
//
// UML relation: Library <<uses>> NetworkManager
// ─────────────────────────────────────────────────────

const { downloads, episodes, podcasts } = require('../data/mockData');
const NetworkManager = require('./NetworkManager');

class LibraryService {
  // Helper: IDs of all completed downloads
  _getDownloadedEpisodeIds() {
    return downloads
      .filter(d => d.status === 'completed')
      .map(d => d.episodeId);
  }

  // UML: getDownloadedEpisodes() : List<Episode>
  getDownloadedEpisodes() {
    const ids = this._getDownloadedEpisodeIds();
    return episodes.filter(ep => ids.includes(ep.id));
  }

  // UML: getDownloadedPodcasts() : List<Podcast>
  getDownloadedPodcasts() {
    const downloadedEps = this.getDownloadedEpisodes();
    const podcastIds = [...new Set(downloadedEps.map(ep => ep.podcastId))];
    return podcasts.filter(p => podcastIds.includes(p.id));
  }

  // UML: totalDownloadedEpisodes : int
  get totalDownloadedEpisodes() {
    return this._getDownloadedEpisodeIds().length;
  }

  // UML: totalDownloadedPodcasts : int
  get totalDownloadedPodcasts() {
    return this.getDownloadedPodcasts().length;
  }

  getStats() {
    return {
      totalDownloadedEpisodes: this.totalDownloadedEpisodes,
      totalDownloadedPodcasts: this.totalDownloadedPodcasts,
    };
  }

  // Grouped by podcast → used by LibraryScreen
  getGrouped() {
    const downloadedEps  = this.getDownloadedEpisodes();
    const downloadedPods = this.getDownloadedPodcasts();

    return downloadedPods.map(podcast => {
      const podEpisodes  = downloadedEps.filter(ep => ep.podcastId === podcast.id);
      const totalSizeMB  = podEpisodes.reduce((sum, ep) => sum + ep.fileSize, 0);
      return { podcast, episodes: podEpisodes, totalSizeMB };
    });
  }

  // Episodes of one podcast that are downloaded → LibraryEpisodesScreen
  getEpisodesForPodcast(podcastId) {
    const ids = this._getDownloadedEpisodeIds();
    return episodes.filter(ep => ep.podcastId === podcastId && ids.includes(ep.id));
  }

  // UML <<uses>> NetworkManager
  // Library is always accessible, but we log network state
  isAccessible() {
    const connected = NetworkManager.checkConnection();
    console.log(`[Library] accessed — network: ${connected ? 'online' : 'offline'}`);
    return true;
  }
}

// Singleton
module.exports = new LibraryService();
