const db = require('../database');

// User register
exports.register = (req, res) => {
  const { email, firstName, lastName, password, address } = req.body;

  db.query(
    'INSERT INTO users (email, first_name, last_name, password, address) VALUES (?, ?, ?, ?, ?)',
    [email, firstName, lastName, password, address],
    (err, results) => {
      if (err) throw err;
      res.send('Information: Register success');
    }
  );
};
