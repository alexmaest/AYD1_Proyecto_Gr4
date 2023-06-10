const db = require('../database');

// User Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.send('Information: Login succeed');
    } else {
      res.send('Error: Invalid credentials');
    }
  });
};
