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
      return { podcast, episodes: podEpisodes, totalSizeMB };
    });
  }

  async getEpisodesForPodcast(podcastId) {
    const ids = await this._getDownloadedEpisodeIds();
    return Episode.find({ _id: { $in: ids }, podcastId });
  }

  isAccessible() {
    const connected = NetworkManager.checkConnection();
    console.log(`[Library] network: ${connected ? 'online' : 'offline'}`);
    return true;
  }
}

module.exports = new LibraryService();
