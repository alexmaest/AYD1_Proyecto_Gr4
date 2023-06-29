require('dotenv').config(); 
const mysql = require('mysql');

var dbname=process.env.DB_NAME;

if (process.env.NODE_ENV === 'test') {
  console.log('--database--: test');
  dbname=process.env.DB_NAME_TEST;
}

// DB configuration
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  ssh      : "Amazon RDS",
  database : dbname,
  multipleStatements: true
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Information: Database connection succeeded');
});

module.exports = connection;
 