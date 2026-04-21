// services/StorageManager.js — MongoDB version
const Download = require('../models/Download');
const Episode  = require('../models/Episode');

class StorageManager {
  constructor() { this.totalSpace = 16; } // GB

  async calculateUsedSpace() {
    const completed = await Download.find({ status: 'completed' }, 'episodeId');
    const ids = completed.map(d => d.episodeId);
    const episodes = await Episode.find({ _id: { $in: ids } }, 'fileSize');
    const totalMB = episodes.reduce((sum, ep) => sum + (ep.fileSize || 0), 0);
    return Math.round((totalMB / 1024) * 100) / 100;
  }

  async calculateFreeSpace() {
    const used = await this.calculateUsedSpace();
    return Math.round((this.totalSpace - used) * 100) / 100;
  }

  async getStorageInfo() {
    const usedSpace = await this.calculateUsedSpace();
    return {
      totalSpace: this.totalSpace,
      usedSpace,
      freeSpace: Math.round((this.totalSpace - usedSpace) * 100) / 100,
    };
  }
}

module.exports = new StorageManager();
