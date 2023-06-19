const express = require('express');
const router = express.Router();

// GET route for main page
router.get('/', (req, res) => {
  res.send('Information: Connected to main page');
});

module.exports = router;