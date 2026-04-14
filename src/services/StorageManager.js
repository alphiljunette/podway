<<<<<<< HEAD
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
=======
// ─────────────────────────────────────────────────────
// services/StorageManager.js
// UML: StorageManager
//   - totalSpace : float
//   - usedSpace  : float
//   - freeSpace  : float
//   + calculateUsedSpace() : float
//   + calculateFreeSpace() : float
// ─────────────────────────────────────────────────────

const { downloads, episodes } = require('../data/mockData');

class StorageManager {
  constructor() {
    this.totalSpace = 16; // GB — device total capacity
  }

  // UML: calculateUsedSpace() : float
  // Sums fileSize (MB) of all completed downloads → converts to GB
  calculateUsedSpace() {
    const completedIds = downloads
      .filter(d => d.status === 'completed')
      .map(d => d.episodeId);

    const totalMB = episodes
      .filter(ep => completedIds.includes(ep.id))
      .reduce((sum, ep) => sum + ep.fileSize, 0);

    // MB → GB, rounded to 2 decimals
    return Math.round((totalMB / 1024) * 100) / 100;
  }

  // UML: calculateFreeSpace() : float
  calculateFreeSpace() {
    const used = this.calculateUsedSpace();
    return Math.round((this.totalSpace - used) * 100) / 100;
  }

  getStorageInfo() {
    const usedSpace = this.calculateUsedSpace();
    const freeSpace = this.calculateFreeSpace();
    return {
      totalSpace: this.totalSpace,
      usedSpace,
      freeSpace,
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
    };
  }
}

<<<<<<< HEAD
=======
// Singleton
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548
module.exports = new StorageManager();
