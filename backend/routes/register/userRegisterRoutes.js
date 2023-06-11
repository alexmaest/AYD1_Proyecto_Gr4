const express = require('express');
const router = express.Router();

// POST route for user register
router.post('/', (req, res) => {
  const { firstName, lastName, password, email, phoneNumber, address, department, town} = req.body;
  res.send('Information: Request sent');
});

// GET route for user register
router.get('/', (req, res) => {
  res.send('Information: Connected to user register page');
});

module.exports = router;