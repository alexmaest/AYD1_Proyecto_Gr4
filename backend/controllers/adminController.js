//const db = require('../database');

exports.main = (req, res) => {
    res.send('Information: Admin main page');
};

exports.requests = (req, res) => {
    res.send('Information: Admin company and delivery requests page');
};

exports.reports = (req, res) => {
    res.send('Information: Admin reports page');
};
