const db = require('../database');

// User model
class User {
  static getByEmail(email, callback) {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results[0]);
      }
    });
  }

  static create(email, firstName, lastName, password, address, callback) {
    db.query(
      'INSERT INTO users (email, first_name, last_name, password, address) VALUES (?, ?, ?, ?, ?)',
      [email, firstName, lastName, password, address],
      (err, result) => {
        if (err) {
          callback(err, null);
        } else {
          const createdUser = {
            id: result.insertId,
            email,
            firstName,
            lastName,
            address,
          };
          callback(null, createdUser);
        }
      }
    );
  }
}

module.exports = User;
