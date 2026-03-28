// ─────────────────────────────────────────────────────
// routes/network.js
// UML: NetworkManager
//   - isConnected : boolean
//   + checkConnection() : boolean
//
// GET /api/network/check → ping to verify server reachability
// ─────────────────────────────────────────────────────

const express        = require('express');
const router         = express.Router();
const NetworkManager = require('../services/NetworkManager');

// GET /api/network/check
// React Native app calls this to confirm internet is available
router.get('/check', (req, res) => {
  const status = NetworkManager.getStatus();
  res.json({ data: status });
});

module.exports = router;
