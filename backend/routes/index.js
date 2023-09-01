const express = require('express');

const router = express.Router();

// Test route to make sure the server is running
router.get('/test', (req, res) => {
  res.send('Server is running');
});

module.exports = router;
