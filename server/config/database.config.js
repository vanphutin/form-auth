const mysql = require("mysql");

const pool = mysql.createPool({
  queueLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "auth",
  port: 3307,
});

module.exports = pool;
