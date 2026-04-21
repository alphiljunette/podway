// services/NetworkManager.js
// Version serveur Node.js (pas de React hooks)

const NetworkManager = {
  checkConnection: () => true,
  getStatus: () => ({ isConnected: true, type: 'wifi' }),
  isAccessible: () => {
    const connected = this.checkConnection();
    console.log(`[NetworkManager] Server accessible — network: ${connected ? 'online' : 'offline'}`);
  }
};

module.exports = NetworkManager;