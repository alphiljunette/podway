// routes/network.js
// UML: NetworkManager
//   + checkConnection() : boolean
// GET /api/network/check

const express        = require('express');
const router         = express.Router();
<<<<<<< HEAD
const NetworkManager = require('../../services/NetworkManager');
=======
const NetworkManager = require('../services/NetworkManager');
>>>>>>> 2bbc1d65d42591cda0a1921daed68a104f1e7548

router.get('/check', (req, res) => {
  const status = NetworkManager.getStatus();
  res.json({ data: status });
});

module.exports = router;
