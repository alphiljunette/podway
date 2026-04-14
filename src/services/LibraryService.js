<<<<<<< HEAD
// services/LibraryService.js — MongoDB version
const Download = require('../models/Download');
const Episode  = require('../models/Episode');
const Podcast  = require('../models/Podcast');
const NetworkManager = require('./NetworkManager');

class LibraryService {
  async _getDownloadedEpisodeIds() {
    const docs = await Download.find({ status: 'completed' }, 'episodeId');
    return docs.map(d => d.episodeId);
  }

  async getDownloadedEpisodes() {
    const ids = await this._getDownloadedEpisodeIds();
    return Episode.find({ _id: { $in: ids } });
  }

  async getDownloadedPodcasts() {
    const eps = await this.getDownloadedEpisodes();
    const podcastIds = [...new Set(eps.map(ep => ep.podcastId.toString()))];
    return Podcast.find({ _id: { $in: podcastIds } });
  }

  async getStats() {
    const ids = await this._getDownloadedEpisodeIds();
    const eps = await Episode.find({ _id: { $in: ids } }, 'podcastId');
    const podcastIds = [...new Set(eps.map(ep => ep.podcastId.toString()))];
    return {
      totalDownloadedEpisodes: ids.length,
      totalDownloadedPodcasts: podcastIds.length,
    };
  }

  async getGrouped() {
    const eps     = await this.getDownloadedEpisodes();
    const podcasts = await this.getDownloadedPodcasts();
    return podcasts.map(podcast => {
      const podEpisodes = eps.filter(ep => ep.podcastId.toString() === podcast._id.toString());
      const totalSizeMB = podEpisodes.reduce((sum, ep) => sum + (ep.fileSize || 0), 0);
=======
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
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
      return { podcast, episodes: podEpisodes, totalSizeMB };
    });
  }

<<<<<<< HEAD
  async getEpisodesForPodcast(podcastId) {
    const ids = await this._getDownloadedEpisodeIds();
    return Episode.find({ _id: { $in: ids }, podcastId });
  }

  isAccessible() {
    const connected = NetworkManager.checkConnection();
    console.log(`[Library] network: ${connected ? 'online' : 'offline'}`);
=======
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
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
    return true;
  }
}

<<<<<<< HEAD
=======
// Singleton
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
module.exports = new LibraryService();
