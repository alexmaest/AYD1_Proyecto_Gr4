//const db = require('../database');

// Login
exports.login = (req, res) => {
  const { email, password, type } = req.body;
  let tableName = '';

  switch (type) {
    case 'user':
      tableName = 'users';
      break;
    case 'company':
      tableName = 'companies';
      break;
    case 'delivery':
      tableName = 'deliveries';
      break;
    default:
      res.send('Error: Invalid user type');
      return;
  }

  /*const query = 'SELECT * FROM ' + tableName + ' WHERE email = ? AND password = ?';
  const values = [email, password];

  db.query(query, values, (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      res.send('Information: Login succeeded');
    } else {
      res.send('Error: Invalid credentials');
    }
  });*/

  res.send('Information: Login endpoint');
};
