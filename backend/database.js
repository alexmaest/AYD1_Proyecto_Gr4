const mysql = require('mysql');

// DB configuration
var connection = mysql.createConnection({
  host     : 'ayd1g4db.cunwtkz7gu5j.us-east-2.rds.amazonaws.com',
  user     : 'ayd1g4',
  password : 'ayd1grp4',
  ssh : "Amazon RDS",
  database: 'alchilazodb'
});

/*const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '12345',
  database: 'alchilazodb',
});*/

connection.connect((err) => {
  if (err) throw err;
  console.log('Information: Database connection succeeded');
});

module.exports = connection;
 