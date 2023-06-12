const express = require('express');
const router = express.Router();

// POST route for company register
router.post('/', (req, res) => {
  const { name, password, description, category, email, address, department, town } = req.body;
  res.send('Information: Request sent');
});

// GET route for company register
router.get('/', (req, res) => {
  res.send('Information: Connected to company register page');
});

module.exports = router;