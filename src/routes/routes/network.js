// routes/network.js
// UML: NetworkManager
//   + checkConnection() : boolean
// GET /api/network/check

const express        = require('express');
const router         = express.Router();
const NetworkManager = require('../../services/NetworkManager');

router.get('/check', (req, res) => {
  const status = NetworkManager.getStatus();
  res.json({ data: status });
});

module.exports = router;
