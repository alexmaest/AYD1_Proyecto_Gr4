const db = require('../database');
require('dotenv').config();

exports.main = (req, res) => {
  res.send('Information: Company main page');
};

exports.products = (req, res) => {
  res.send('Information: Company products control panel page');
};

exports.categories = (req, res) => {
    res.send('Information: Company categories control panel page');
};