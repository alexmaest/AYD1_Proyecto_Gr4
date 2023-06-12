const express = require('express');
const router = express.Router();

// POST route for delivery register
router.post('/', (req, res) => {
  const { firstName, lastName, password, email, phoneNumber, address, department, town, license, transport} = req.body;
  res.send('Information: Request sent');
});

// GET route for delivery register
router.get('/', (req, res) => {
  res.send('Information: Connected to delivery register page');
});

module.exports = router;