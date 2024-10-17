const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 4000;

//Parse the requests of content-type 'App/json'
app.use(bodyParser.json());

//Create the mysql connection 
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password123',
    database: 'Users'
})

//Connect to MySQL
db.connect((err) => {
    if(err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    // Query to get tables from the current database
    db.query('SHOW TABLES', (err, results) => {
        if (err) {
            console.error('Error fetching tables: ', err);
            return;
        }

        // Get the name of the first table, you can adjust this as needed
        const tableName = results[0] ? Object.values(results[0])[0] : 'No tables found';

        // Log the database and table name
        console.log(`Connected to MySQL with database: ${db.config.database} and table: ${tableName}`);
    });
});

// Get all users
app.get('/api/Users', (req, res) => {
    db.query('SELECT * FROM Users', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });
  
  // Create a new user
  app.post('/api/Users', (req, res) => {
    const { name, email, password} = req.body;
    db.query('INSERT INTO Users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User created', userId: result.insertId });
    });
  });
 /* 
// Update a user
app.put('/api/Users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    db.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, password, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User updated' });
    });
  });
  */
 /*
  // Delete a user
  app.delete('/api/Users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Users WHERE id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User deleted' });
    });
  });
  */

//Start a server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports = db;