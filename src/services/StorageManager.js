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
    };
  }
}

// Singleton
module.exports = new StorageManager();
