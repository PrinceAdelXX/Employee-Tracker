const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'saber',
      database: 'employeetracker'
    },
    console.log('Connected to the employeeTracker database.')
);

module.exports = db;