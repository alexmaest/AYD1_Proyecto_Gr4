require('dotenv').config(); 
const mysql = require('mysql');

// DB configuration
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  ssh      : "Amazon RDS",
  database : process.env.DB_NAME,
  multipleStatements: true
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Information: Database connection succeeded');
});

module.exports = connection;
 